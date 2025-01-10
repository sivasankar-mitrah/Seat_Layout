import React, { useEffect, useState } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { layouts } from './layouts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Layout, Select, Input, Radio, Space, Modal } from 'antd';
import DrawerFn from './SideSection';
import { } from 'antd';
import { devList } from './devList';
const App = () => {
  const { Header, Content, } = Layout;
  const [open, setOpen] = useState(false);
  const [currentLayout, setCurrentLayout] = useState([]);
  const [selecetedPerson, setSelectedPerson] = useState([]);
  const [enableUnOccupiedViews, setEnableUnOccupiedViews] = useState([])
  const [radioValue, setRadioValue] = useState('single');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
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

  }, [])

  // const handleOpenSideSection = (val) => {
  //   console.log('valasdfasdas', val)
  //   let tempData = [...selecetedPerson]
  //   console.log('masdinasdiansd', selecetedPerson, tempData)
  //   if (tempData.some(obj => obj.devId === val.devId)) {
  //     console.log('testtttttttif')
  //     tempData = tempData.filter(seat => seat.devId !== val.devId);
  //   } else {
  //     console.log('elseeeeeeeee')
  //     if (radioValue === "single") {
  //       tempData = [{ ...val }]
  //       form.setFieldsValue({
  //         newEmployee: `${val.devName} - ${val.i}`,
  //       });
  //       setOpen(true);

  //     } else {
  //       tempData = [...selecetedPerson, val]
  //     }
  //   }
  //   let sample = currentLayout.map(item => {
  //     console.log('itemitemitem', item)
  //     let match = tempData.find(dataItem => dataItem.devId === item.devId);
  //     if (match) {
  //       item.cls = "selected-place"
  //     } else if (item?.devName && !item?.emptyArea || item?.unchange) {
  //       item.cls = "dev-area"
  //     } else if (item?.emptyArea) {
  //       item.cls = "walk-area"
  //     } else {

  //       item.cls = "available-seats"
  //     }

  //     return item;
  //   });
  //   console.log('afterLoopimg', tempData)
  //   setCurrentLayout(sample)
  //   setSelectedPerson(tempData)


  // }

  const { Option, OptGroup } = Select;

  const groupedOptions = [
    {
      label: 'UnOcuupied',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'orange', label: 'Orange' }
      ]
    },
    {
      label: 'Occupied',
      options: [
        { value: 'carrot', label: 'Carrot' },
        { value: 'broccoli', label: 'Broccoli' },
        { value: 'spinach', label: 'Spinach' }
      ]
    },
   
  ];
console.log('testttt')
  const handleOpenSideSection = (val) => {
    let tempData = [...selecetedPerson];
    const isPersonSelected = tempData.some(person => person.devId === val.devId);
    if (isPersonSelected) {
      tempData = tempData.filter(person => person.devId !== val.devId);
    } else {
      if (radioValue === 'single') {
        tempData = [{ ...val }];
        form.setFieldsValue({
          newEmployee: `${val.devName} - ${val.i}`,
        });
        // setOpen(true);
      } else {
        tempData.push(val);
      }
    }
    const updatedLayout = currentLayout.map(item => {
      const match = tempData.find(dataItem => dataItem.devId === item.devId);
      const clsMapping = [
        { condition: match, cls: 'selected-place' },
        { condition: item?.devName && !item?.emptyArea || item?.unchange, cls: 'dev-area' },
        { condition: item?.emptyArea, cls: 'walk-area' },
        { condition: true, cls: 'available-seats' }
      ];
      item.cls = clsMapping.find(mapping => mapping.condition)?.cls;
      return item;
    });
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
  console.log('selectedPersonasdasd', selecetedPerson)
  console.log('dfjbdkasfjdkf', currentLayout)
  // const handleSelectStack = (value) => {
  //   let selecedStack = ""
  //   switch (value) {
  //     case 'php':
  //       selecedStack = 'php-bg'
  //       break;
  //     case 'backend':
  //       selecedStack = 'cf-bg'
  //       break;
  //     case 'frontend':
  //       selecedStack = 'react-bg'
  //       break;
  //     default:
  //       selecedStack = ""
  //   }
  //   console.log('valuevaluevalue', value)
  //   console.log('selecedStackselecedStack', selecedStack)
  //   let data = currentLayout.map((item, index) => {
  //     if (item?.devName && item.stack === value && !item.emptyArea) {
  //       return { ...item, cls: `${item.cls} ${selecedStack} ` }
  //     } else if (!item?.devName && !item.emptyArea) {
  //       return { ...item, cls: 'available-seats ' }
  //     } else {
  //       return { ...item, cls: '' }
  //     }

  //   })
  //   setCurrentLayout(data)
  //   console.log(`selected ${value}`);
  // };
  const HandleComplete = () => {
    setIsModalOpen(true);
    // setOpen(false)
    // let data = currentLayout.map((item, index) => {
    //   return { ...item, cls: '' }

    // })
    // setCurrentLayout(data)
  }
  const handleRemoveMultiple = () => {
    console.log('testtttt', selecetedPerson)
    console.log('currenrererer', currentLayout)
  }
  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setRadioValue(e.target.value);
  };
  console.log('setCurrentLayoutsetCurrentLayout', currentLayout)
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
          ]}
        />
        <Radio.Group onChange={onChange} value={radioValue}>
          <Space direction="vertical">
            <Radio value={'single'}><div style={{ color: "white" }}>Single</div></Radio>
            <Radio value={'multiple'}><div style={{ color: "white" }}>Multiple</div></Radio>
          </Space>
        </Radio.Group>
        {radioValue === "multiple" && selecetedPerson?.length > 1 && <Button type="primary" onClick={HandleComplete}>Selected </Button>}
        <Button type="primary" onClick={HandleComplete}>Complete </Button>
        <Button type="primary" >UnOccupied Peoples </Button>

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
          form={form}
          setEnableUnOccupiedViews={setEnableUnOccupiedViews}
          enableUnOccupiedViews={enableUnOccupiedViews}
        /></div > : null
        }
      </Content>
      <Modal footer={null} title="RemoveMultiple User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div>
          Are you sue you want to remove the Multiple developers to unoccupied Positons
        </div>
        <Button onClick={() => { handleRemoveMultiple() }}>
          Remove Multiple
        </Button>
        <Select defaultValue="apple" style={{ width: 200 }}>
          {groupedOptions.map(group => (
            <OptGroup key={group.label} label={group.label}>
              {group.options.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </OptGroup>
          ))}
        </Select>
      </Modal>
    </Layout >
  );
};

export default App;
