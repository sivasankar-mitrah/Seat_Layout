import React, { useEffect, useState } from 'react';
import GridLayout from 'react-grid-layout';
import { Button, Form, Layout, Select, Radio, Space, Modal, Drawer, Flex, Tag, message, Badge, Switch } from 'antd';
import { layouts } from './layouts';
import DrawerFn from './SideSection';
import { devList } from './devList';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNotification } from './common/notification';
import { CheckOutlined, CloseOutlined, PhoneTwoTone } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';


const App = () => {
  const { Header, Content, } = Layout;
  const [open, setOpen] = useState(false);
  const [selectedStack, setselectedStack] = useState("All")
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
  const [selectBoxGlow, setSelectBoxGlow] = useState({ seatName: "", selectStatus: true }); // Seat Glow while Selecting inputs
  const [badgeContent, setBadgeContent] = useState(false); // Initial badge content
  const [isIntercomVisible , setIsIntercomVisible] = useState(false)




  const [form] = Form.useForm();


  useEffect(() => {
    let combinedArr = layouts.layout1.map(item1 => {
      if (!item1.unchange) {
        let item2 = devList.find(item => item.seat_id === item1.i) || { "devName": "", "seat_id": "", "role": "", "stack": "", "devId": "", "isFresher": null, "TL_id": "" };
        return { ...item1, ...item2 };
      }
      else return item1;
    }).map(a => (a.seat_id === "") ? ({ ...a, cls: "seat empty-seat" }) : ({ ...a, cls: "seat" }));

    const remainingDevs = devList.filter((dev) => !dev.seat_id);
    setUnOccupiedPeople(remainingDevs);
    setCurrentLayout(combinedArr)
    setSelectedPerson([]);
  }, [])

  useEffect(() => {
    setOpen(currentLayout.some(item => item.cls.includes("selected-place")));
  }, [currentLayout])


  useEffect(() => {
    const value = selecetedPerson?.[0];
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
      setCurrentLayout(currentLayout.map(a => {
        if (a.i === value.i) return { ...a, cls: "seat selected-place" }
        else return (a.seat_id === "") ? { ...a, cls: "seat empty-seat" } : { ...a, cls: "seat" }
      }))
      setselectedStack("All");
    }

  }, [radioValue])

  const handleOk = () => {
    setIsModalOpen(false);
  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOpenSideSection = (val) => {

    let tempData = [...selecetedPerson];
    setIsVisible(false);
    const isPersonSelected = tempData.some(person => person.i === val.i);

    if (isPersonSelected) tempData = selecetedPerson.filter(person => person?.i !== val?.i)
    else {
      if (radioValue === "single") {
        form.setFieldsValue({ newEmployee: `${val.devName} - ${val.i}` });
        tempData = [val]
      } else {
        tempData.push(val)
      }
    }

    const show = devList.filter((data) => {
      if (data.seat_id === (val.i)) {
        return data.stack
      }
    })
    setSelectedPerson(tempData);
    setDisplayStack(show);
    const updatedLayout = currentLayout.map(item => {
      const itemStyle = (item.seat_id === "") ? `seat empty-seat selected-place` : `seat selected-place`
      if (tempData.some(a => a.i === val.i)) {
        if (radioValue === "single") {
          if (tempData.some(a => a.i === val.i)) {
            if (item.i === val.i) return ({ ...item, cls: itemStyle })
            else return item.seat_id === "" ? { ...item, cls: "seat empty-seat" } : { ...item, cls: "seat" }
          }
        }
        else if (radioValue === "multiple") {
          if (tempData.some(a => a.i === item.i)) return { ...item, cls: "seat selected-place" }
          else return item.seat_id === "" ? { ...item, cls: "seat empty-seat" } : { ...item, cls: "seat" }
        }
      }
      else {
        if (item.i === val.i) {
          return item.seat_id === "" ? { ...item, cls: "seat empty-seat" } : { ...item, cls: "seat" }
        }
        else return item
      }
    })
    // setselectedStack("All")
    const finalUpdatedLayout = updatedLayout.map(item => {
      if (selectedStack === "All") return item;
      else if (item.stack === selectedStack) {
        if (item.cls.includes("selected-place")) return { ...item, cls: item.cls };
        else return { ...item, cls: `${selectedStack} ${item.cls}` };
      }
      else return item;
    })
    setCurrentLayout(finalUpdatedLayout);
    // setCurrentLayout(updatedLayout);
  };

  const handleSelectStack = (value) => {
    setRadioValue('single')
    setSelectedPerson([])
    setselectedStack(value)
    const stackClasses = {
      php: 'php-bg',
      backend: 'cf-bg',
      frontend: 'react-bg'
    };
    const selecedStack = stackClasses[value] || "";
    const updatedLayout = currentLayout.map(item => {
      const clsMapping = [
        { condition: !item?.devName && !item.emptyArea && !item?.unchange, cls: 'available-seats' },
        { condition: item?.devName && item.stack === value && !item.emptyArea, cls: `seat ${selecedStack}` },
        { condition: true, cls: '' }
      ];
      const cls = clsMapping.find(mapping => mapping.condition)?.cls || 'seat';
      return { ...item, cls };
    });
    setCurrentLayout(updatedLayout.map(a => (a.seat_id === "") ? ({ ...a, cls: "seat empty-seat" }) : ({ ...a })));
    setSelectBoxGlow({ seatName: "", selectStatus: true });
  };

  const handleDeleteModalOk = () => {
    setIsDeleteModalOpen(false)
    setIsSubmit(true);
    setSelectBoxGlow({ ...selectBoxGlow, selectStatus: false });
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
    let updatedLayout = currentLayout.map((dev) => {
      if (dev.cls.includes('selected-place') && dev.devName) {
        return {
          ...dev,
          unOccupied: true,
          cls: "seat empty-seat",
          devId: "",
          devName: "",
          role: "",
          stack: "",
          imageUrl: "",
          seat_id: "",
          TL_id: ""
        };
      }
      return dev
    })
    let updatedUnoccoupied = currentLayout.map((val) => {
      if (val.cls.includes('selected-place')) {
        return {
          "devName": val.devName,
          "seat_id": val.seat_id,
          "role": val.role,
          "stack": val.stack,
          "devId": val.devId,
          "isFresher": val.isFresher,
          "TL_id": val.TL_id
        }
      }
    })
    updatedUnoccoupied = updatedUnoccoupied.filter((val) => val?.devId)
    setUnOccupiedPeople((prev) => [...prev, ...updatedUnoccoupied])
    setCurrentLayout(updatedLayout)
    api.info({
      message: `Users removed from the seat successfully`,
      placement: 'topRight',
    });
    setIsModalOpen(false);
    setSelectedPerson([]);
  }

  const onChange = (e) => {
    if(e){
      setRadioValue('single')
    } else {
      setRadioValue('multiple')
    }
  };

  const handleTagChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  }

  const handleUnoccupiedPeople = () => {
    setIsVisible(true);
    setOpen(true);
  }

  const handleMouseEnter = (e) => {
    setBadgeContent(true);
  };

  const handleMouseLeave = () => {
    setBadgeContent(false);
  };


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
          value={selectedStack}
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "8px", color: "white" }}>Show Intercom  <FontAwesomeIcon icon={faPhone} style={{ fontSize: "15px", color: "lightblue" }} />
          </span>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onClick={(e)=>setIsIntercomVisible(e)}
          />
        </div>
        {/* <Radio.Group onChange={onChange} value={radioValue}>
          <Space direction="vertical">
            <Radio value={'single'}><div style={{ color: "white" }}>Single</div></Radio>
            <Radio value={'multiple'}><div style={{ color: "white" }}>Multiple</div></Radio>
          </Space>
        </Radio.Group> */}
        <Switch
            checkedChildren={"single"}
            unCheckedChildren={"multiple"}
            defaultChecked
            onChange={onChange}
            value={radioValue=== "single" ? true: false}
          />
        {radioValue === "multiple" && selecetedPerson?.length > 1 && <Button type="primary"
          onClick={onHandleSelect}>Selected </Button>}
        <Button type="primary" onClick={onHandleComplete}>Complete </Button>
        <Button type="primary" onClick={handleUnoccupiedPeople} >UnOccupied Peoples </Button>

      </Header>
      <Content
        className='d-flex'
        style={{
          padding: '0 48px',
        }}
      >
        <div className='grid-parent-layout' id='parentLayout'>
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
              let offset_X;
              let offset_Y;
              if (val?.h === 3) {
                offset_X = 0
                offset_Y = -45
              } else if (val?.h === 2) {
                offset_X = 0
                offset_Y = -24
              } else {
                offset_X = 18
                offset_Y = -4
              }
              return <div
                title={val?.devName}
                onClick={() => { !val?.unchange && handleOpenSideSection(val); }}
                style={{ cursor: 'pointer' }}
                data-grid={{ x: val.x, y: val.y, w: val.w, h: val.h, }}
                key={val?.i}

                id={val?.i} // id to DOM scroll while select the seat

                //seat ${val.cls} ${val.cusClass} ${val.emptyArea ? 'walk-area' : 'dev-area'} 
                // className={`
                // seat 
                // ${val.cls} 
                // ${val.emptyArea ? 'walk-area':val.unchange && "unchange-cells"}
                // ${val.seat_id ==="" && "empty-seat"} 
                //  ${(selectBoxGlow.seatName === val?.i && selectBoxGlow.selectStatus) && "custom-box-glow"}  `}
                //(selecetedPerson.reduce((a,c)=>a||c.i ===val.i,false))

                // ${radioValue === "single" && (selecetedPerson.find(a => a.i === val.i)) && open && "selected-place"}
                // ${radioValue === "multiple" && (selecetedPerson.find(a => a.i === val.i)) && "selected-place"}
                className={`seat
                ${val.unchange && "walk-area"}
                ${(selectBoxGlow.seatName === val?.i && selectBoxGlow.selectStatus) && "custom-box-glow"} 
                ${val.cls}
                `}
              >
                {!val.unchange && val.extension_no && isIntercomVisible ?
                  <Badge
                    count={
                      <div
                        className="phone-icon-container"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        {badgeContent ? val.extension_no : <PhoneTwoTone className="phone-icon" />}
                      </div>
                    }
                    offset={[offset_X, offset_Y]} // Position adjustment
                  >
                    <span>{val.i} </span>
                  </Badge>
                  : val?.i}

              </div>
            })}

          </GridLayout >
        </div>
        {open ? <div className='secondElement'>
          < DrawerFn
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
            setSelectBoxGlow={setSelectBoxGlow}
            selectBoxGlow={selectBoxGlow}
            selectedStack={selectedStack}
          /></div > : null}
      </Content>
      <Modal footer={null} title="Remove Multiple User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className='mt-3 mb-3'>
          Are you sue you want to remove the Multiple developers to unoccupied Positons?
        </div>
        <div className='my-2 pb-2'>
          {currentLayout.filter(dev => dev.cls.includes("selected-place") && dev.devName).map((tag) => (
            <Tag
              key={tag}
              checked={selectedTags.includes(tag)}
              onChange={(checked) => handleTagChange(tag, checked)}
            >
              {tag.devName}
            </Tag>
          ))}
        </div>
        <Button onClick={handleRemoveMultiple}>
          Remove
        </Button>
      </Modal>
      <Modal title="Save Alert" open={isCompleteModalOpen} onOk={() => setIsCompleteModalOpen(false)} onCancel={() => setIsCompleteModalOpen(false)} okText="Yes" okType="primary">
        <div>
          Are you sure you want to save the changes?
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