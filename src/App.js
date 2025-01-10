import React, { useEffect, useState } from 'react';
import GridLayout from 'react-grid-layout';
import { Button, Form, Layout, Select, Radio, Space, Modal, Drawer, Flex, Tag, message } from 'antd';
import { layouts } from './layouts';
import DrawerFn from './SideSection';
import { devList } from './devList';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNotification } from './common/notification';


const App = () => {
  const { Header, Content, } = Layout;
  const [open, setOpen] = useState(false);
  const [currentLayout, setCurrentLayout] = useState([]);
  const [selecetedPerson, setSelectedPerson] = useState([]);
  const [enableUnOccupiedViews, setEnableUnOccupiedViews] = useState([])
  const [radioValue, setRadioValue] = useState('single');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [displayStack, setDisplayStack] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [unOccupiedPeople, setUnOccupiedPeople] = useState([]);
  const api = useNotification();

  console.log("unOccupiedPeople", unOccupiedPeople, ":::::::::::::::", currentLayout);


  const [form] = Form.useForm();

  const handleOk = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    let combinedArr = layouts.layout1.map(item1 => {
      let item2 = devList.find(item => item.i === item1.i);
      return { ...item1, ...item2 };
    });
    let data = combinedArr.map((item, index) => {
      if (item?.unOccupied && (item.role === "developer")) {
        return { ...item, cls: `${item.cls} available-seats` }
      } else {
        return { ...item }
      }

    })
    setCurrentLayout(data)
    setSelectedPerson([]);
  }, [])

  useEffect(() => {
    const value = selecetedPerson?.[0]
    if (radioValue === 'single' && value) {
      let combinedArr = layouts.layout1.map(item1 => {
        let item2 = devList.find(item => item.i === item1.i);
        return { ...item1, ...item2 };
      });
      let data = combinedArr.map((item) => {
        if (item?.i === value?.i) {
          return { ...item, cls: `${item.cls} selected-place` }
        }
        else if ((item?.unOccupied && (item.role === "developer"))) {
          return { ...item, cls: `${item.cls} available-seats` }
        } else {
          return { ...item }
        }
      })
      setSelectedPerson([value])
      setCurrentLayout(data)
    }
  }, [radioValue])

  const handleCancel = () => {
    setIsModalOpen(false);
  };
console.log('testttt')
  const handleOpenSideSection = (val) => {
    let tempData = [...selecetedPerson];
    setIsVisible(false);
    const isPersonSelected = tempData.some(person => person.i === val.i);
    if (isPersonSelected) {
      tempData = tempData.filter(person => person.devId !== val.devId);
    } else {
      if (radioValue === 'single') {
        tempData = [{ ...val }];
        form.setFieldsValue({
          newEmployee: `${val.devName} - ${val.i}`,
        });
        setOpen(true);
      } else {
        tempData.push(val);
      }
    }
    const updatedLayout = currentLayout.map(item => {
      const match = tempData.find(dataItem => dataItem.devId === item.devId);

      const clsMapping = [
        { condition: match, cls: 'selected-place' }
      ];

      if (radioValue === "single") {
        if (match?.i === item.i) {
          item.cls = clsMapping.find(mapping => mapping.condition)?.cls;
        } else {
          if (item?.unOccupied && (item.role === "developer")) {
            return { ...item, cls: " available-seats" }
          } else if (item.cls === 'selected-place') {
            return { ...item, cls: "" }
          }
        }
      } else if (radioValue === "multiple") {
        if (val?.cls === "selected-place" && (val?.i === item.i)) {
          if (item?.unOccupied && (item.role === "developer")) {
            return { ...item, cls: " available-seats" }
          } else if (item.cls === 'selected-place') {
            return { ...item, cls: "" }
          }
        } else {
          if (match?.i) {
            item.cls = clsMapping.find(mapping => mapping.condition)?.cls;
          }
        }
      }
      return item;
    });

    const show = devList.filter((data) => {
      if (data.i === (val.i)) {
        return data.stack
      }
    })

    setDisplayStack(show)

    setCurrentLayout(updatedLayout);
    setSelectedPerson(tempData);
  };

  const handleSelectStack = (value) => {
    const stackClasses = {
      php: 'php-bg',
      backend: 'cf-bg',
      frontend: 'react-bg'
    };
    const selecedStack = stackClasses[value] || "";
    const updatedLayout = currentLayout.map(item => {
      const clsMapping = [
        { condition: !item?.devName && !item.emptyArea && !item?.unchange, cls: 'available-seats' },
        { condition: item?.devName && item.stack === value && !item.emptyArea, cls: `${item.cls} ${selecedStack}` },
        { condition: true, cls: '' }
      ];
      const cls = clsMapping.find(mapping => mapping.condition)?.cls || '';
      return { ...item, cls };
    });
    setCurrentLayout(updatedLayout);
  };

  const handleDeleteModalOk = () => {
    setIsDeleteModalOpen(false)
    setIsSubmit(true);
    // setOpen(false);
  }

  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false)
  }

  const onHandleSelect = () => {
    setIsModalOpen(true);
  }

  const onHandleComplete = () => {
    setIsCompleteModalOpen(true);
  }

  const handleRemoveMultiple = () => {
    currentLayout.map((dev) => {
      if (dev.cls === "selected-place" && dev.devName) {
        return { ...dev, unOccupied: true };
      }
      return dev
    })
    api.info({
      message: `Users removed from the seat successfully`,
      placement: 'topRight',
    });
    setIsModalOpen(false)
  }

  const onChange = (e) => {
    setRadioValue(e.target.value);
  };

  const handleTagChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  }

  const onVisibleClose = () => {
    setIsVisible(false)
  }
  const handleUnoccupiedPeople = () => {
    setOpen(true)
    setIsVisible(true)
  }

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Select
          style={{
            width: 150,
          }}
          className='ms-2'
          onChange={handleSelectStack}
          showSearch
          placeholder="Select Stack"
          options={[
            {
              value: 'frontend',
              label: 'FrontEnd',
            },
            {
              value: 'backend',
              label: 'Coldfusion',
            },
            {
              value: 'php',
              label: 'Php',
            },
            {
              value: 'all',
              label: 'All',
            },
          ]}
        />
        <Radio.Group onChange={onChange} value={radioValue}>
          <Space direction="vertical">
            <Radio value={'single'}><div style={{ color: "white" }}>Single</div></Radio>
            <Radio value={'multiple'}><div style={{ color: "white" }}>Multiple</div></Radio>
          </Space>
        </Radio.Group>
        {radioValue === "multiple" && selecetedPerson?.length > 1 && <Button type="primary" onClick={onHandleSelect}>Selected </Button>}
        <Button type="primary" onClick={onHandleComplete}>Complete </Button>
        <Button type="primary" onClick={handleUnoccupiedPeople} >UnOccupied Peoples </Button>

      </Header>
      <Content
        className='d-flex'
        style={{
          padding: '0 48px',
        }}
      >
        <div className='grid-parent-layout'>
          <GridLayout
            className="layout"
            rowHeight={30}
            // margin={[10, 30]}
            width={4000}
            isDraggable={false}
            isResizable={false}
            cols={50}
            preventCollision={true}
          >

            {currentLayout?.map((val, index) => {
              return <div
                title={val.devName}
                onClick={() => { !val?.unchange && handleOpenSideSection(val); }}
                style={{ cursor: 'pointer' }}
                data-grid={{ x: val.x, y: val.y, w: val.w, h: val.h, }}
                key={val?.i}
                className={`seat ${val.cls} ${val.cusClass} ${val.emptyArea ? 'walk-area' : 'dev-area'}`}
              >
                {val?.i}
              </div>

            })}

          </GridLayout >
        </div>
        {open ? <div className='secondElement'>  < DrawerFn
          setOpen={setOpen}
          setCurrentLayout={setCurrentLayout}
          currentLayout={currentLayout}
          selecetedPerson={selecetedPerson}
          setSelectedPerson={setSelectedPerson}
          form={form}
          show={displayStack}
          setEnableUnOccupiedViews={setEnableUnOccupiedViews}
          enableUnOccupiedViews={enableUnOccupiedViews}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          isSubmit={isSubmit}
          setIsSubmit={setIsSubmit}
          isVisible={isVisible}
          setUnOccupiedPeople={setUnOccupiedPeople}
          unOccupiedPeople={unOccupiedPeople}
        /></div > : null}
        {/* <Drawer title="UnOccupied Peoples" onClose={onVisibleClose} open={isVisible}>
          <Flex gap={4} wrap align="center">
            {currentLayout.filter(dev => dev.unOccupied && dev.devName).map((tag) => (
              <Tag.CheckableTag
                className={tag.stack === 'frontend' ? 'react-bg' : tag.stack === 'php' ? 'php-bg' : tag.stack === 'backend' ? 'cf-bg' : ""}
                key={tag}
                checked={selectedTags.includes(tag)}
                onChange={(checked) => handleTagChange(tag, checked)}
              >
                {tag.devName}
              </Tag.CheckableTag>
            ))}
          </Flex>
        </Drawer> */}
      </Content>
      <Modal footer={null} title="Remove Multiple User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

        <div>
          Are you sue you want to remove the Multiple developers to unoccupied Positons
        </div>
        <div className='my-2'>
          {currentLayout.filter(dev => dev.cls === "selected-place" && dev.devName).map((tag) => (
            <Tag
              key={tag}
              checked={selectedTags.includes(tag)}
              onChange={(checked) => handleTagChange(tag, checked)}
            >
              {tag.devName}
            </Tag>
          ))}
        </div>
        <Button onClick={() => { handleRemoveMultiple() }}>
          Remove
        </Button>
        {/* <Select defaultValue="apple" style={{ width: 200 }}>
          {groupedOptions.map(group => (
            <OptGroup key={group.label} label={group.label}>
              {group.options.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </OptGroup>
          ))}
        </Select> */}

        {/* <Flex gap={4} wrap align="center"> */}

        {/* </Flex> */}
      </Modal>
      <Modal title="Save Alert" open={isCompleteModalOpen} onOk={()=>setIsCompleteModalOpen(false)} onCancel={()=>setIsCompleteModalOpen(false)} okText="Yes" okType="primary">
        <div>
          Are you sure you want to save the changes?
        </div>
        <div className='my-2'>
          {currentLayout.filter(dev => dev.cls === "selected-place" && dev.devName).map((tag) => (
            <Tag
              key={tag}
              checked={selectedTags.includes(tag)}
              onChange={(checked) => handleTagChange(tag, checked)}
            >
              {tag.devName}
            </Tag>
          ))}
        </div>
      </Modal>
      <Modal
        title="Change User"
        open={isDeleteModalOpen}
        onOk={handleDeleteModalOk}
        onCancel={handleDeleteModalCancel}
        okText="Yes"
        okType="primary"
      >
        <div>
          Are you sure want to Change the place?
        </div>
      </Modal>
    </Layout >
  );
};

export default App;