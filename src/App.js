import React, { useEffect, useState } from 'react';
import GridLayout from 'react-grid-layout';
import { Button, Form, Layout, Select, Radio, Space, Modal, Drawer, Flex, Tag, InputNumber, Badge, Switch, Tooltip } from 'antd';
import { layouts } from './layouts';
import DrawerFn from './SideSection';
import { devList } from './devList';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNotification } from './common/notification';
import { CheckOutlined, CloseOutlined, DeleteOutlined, PhoneOutlined, PhoneTwoTone, UserDeleteOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';
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
  const [isIntercomVisible, setIsIntercomVisible] = useState(false);
  const [isTLlist, setIsTLlist] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedTL, setselectedTL] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isRemoveRangeModalOpen, setIsRemoveRangeModalOpen] = useState(false);
  const [rangeSelect, setRangeSelect] = useState({});
  const [rangeValue, setRangeValue] = useState({})

  console.log("rangeSelect", rangeValue);



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
    const employeeList = combinedArr.filter(item => item.devId && item.devId !== "").map((item) => ({ value: item.devId, label: item.devName }));
    setUnOccupiedPeople(remainingDevs);
    setCurrentLayout(combinedArr)
    setEmployeeList(employeeList)
    // setCurrentLayout(localStorage.getItem("seatLayout") ? JSON.parse(localStorage.getItem("seatLayout")) :combinedArr)
    setSelectedPerson([]);
  }, [])

  useEffect(() => {
    setOpen(currentLayout.some(item => item.cls.includes("selected-place")));
    const tllist = currentLayout.filter(item => item.devId && item.devId === item.TL_id).map((item) => ({ value: item.TL_id, label: item.devName }));
    const employeeList = currentLayout.filter(item => item.devId && item.devId !== "").map((item) => ({ value: item.devId, label: item.devName }));
    setEmployeeList(employeeList);
    setIsTLlist(tllist);
  }, [currentLayout])

  useEffect(() => {
    if (!open) setSelectBoxGlow({ seatName: "", selectStatus: true });
  }, [open])

  useEffect(() => {
    const value = selecetedPerson?.[0];
    if (radioValue === 'single' && value) {
      setSelectedPerson([value])
      setCurrentLayout(currentLayout.map(a => {
        if (a.i === value.i) return { ...a, cls: "seat selected-place" }
        else return (a.seat_id === "") ? { ...a, cls: "seat empty-seat" } : { ...a, cls: "seat" }
      }))
      setselectedStack("All");
    }

    if (radioValue === "single" && selecetedPerson.length !== 0) {
      form.setFieldsValue({ newEmployee: `${selecetedPerson[0]?.devName} - ${selecetedPerson[0]?.i}` });
      setDisplayStack([selecetedPerson[0]]);
    }
    else if (radioValue === "multiple" && selecetedPerson.length !== 0) {
      setSelectedPerson((prev) => prev.filter(item => item.seat_id !== ""));
      setCurrentLayout((prev) => prev.map(item => (item.seat_id === "") ? { ...item, cls: `empty-seat` } : item))
    }

  }, [radioValue])
  useEffect(() => {
    let employeeList
    if (selectedTL !== "" && selectedTL) employeeList = currentLayout.filter(item => item.devId && item.TL_id === selectedTL).map((item) => ({ value: item.devId, label: item.devName }));
    else employeeList = currentLayout.filter(item => item.devId).map((item) => ({ value: item.devId, label: item.devName }));
    setEmployeeList(employeeList);
  }, [selectedTL])

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
    setSelectedEmployee(null);
    setselectedTL(null);
  };

  const handleRemoveRangeModalOk = () => {
    const { startRange, endRange } = rangeSelect
    const startNumber = parseInt(startRange?.substring(1));
    const endNumber = parseInt(endRange?.substring(1));
    const updatedRemoveLayout = currentLayout.map((item) => {
      const seatNumber = parseInt(item?.seat_id?.substring(1));
      if (seatNumber >= startNumber && seatNumber <= endNumber) {
        setUnOccupiedPeople((prev) => [...prev, { ...item, i: null }])
        return {
          ...item,
          unOccupied: true,
          cls: "seat empty-seat",
          devId: "",
          devName: "",
          role: "",
          stack: "",
          imageUrl: "",
          TL_id: "",
          seat_id: ""
        };
      }
      return item

    })
    setCurrentLayout(updatedRemoveLayout)
    setIsRemoveRangeModalOpen(false)
    setRangeValue({})
    setRangeSelect({})
  }

  const handleRemoveRangeModalCancel = () => {
    setRangeValue({})
    setRangeSelect({})
    setIsRemoveRangeModalOpen(false)
  }

  const handleSelectTL = (value) => {
    let seat_no;
    const updated = currentLayout.map((item) => {
      if (value === item.devId) {
        seat_no = item.i
        return { ...item, cls: `${item.cls}  custom-box-glow-tl` }
      } else if (value === item.TL_id) {
        return { ...item, cls: `${item.cls} tl-group-color` }
      } else {
        return (item.seat_id === "") ? ({ ...item, cls: "seat empty-seat" }) : ({ ...item, cls: "seat" })
      }
    })
    setselectedStack("All");
    setselectedTL(value);
    setCurrentLayout(updated);
    setSelectedEmployee(null);
    handleAutomaticScroll(seat_no)
  }

  const handleDeleteTlSelected = () => {
    setselectedTL(null);
    const updatedLayout = currentLayout.map(item => {
      if (item.cls.includes("custom-box-glow-tl") || item.cls.includes("tl-group-color") || item.cls.includes("custom-box-glow-employee")) {
        if (item.cls.includes("custom-box-glow-tl")) return { ...item, cls: item.cls.replace("custom-box-glow-tl", "") }
        else if (item.cls.includes("tl-group-color")) return { ...item, cls: item.cls.replace("tl-group-color", "") }
        else return { ...item, cls: item.cls.replace("custom-box-glow-employee", "") }
      }
      else return item
    })
    setCurrentLayout(updatedLayout)
  }

  const handleEmployee = (value) => {
    let seat_no;
    const updated = currentLayout.map((item) => {
      if (value === item.devId) {
        seat_no = item.i
        return { ...item, cls: `${item.cls} custom-box-glow-employee` }
      }
      else if (item.cls.includes("custom-box-glow-employee")) return { ...item, cls: item.cls.replace("custom-box-glow-employee", "") }
      else return item
    })
    setselectedStack("All")
    setSelectedEmployee(value);
    setCurrentLayout(updated);
    handleAutomaticScroll(seat_no)
  }


  const handleSelectStack = (value) => {
    setselectedTL(null);
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
      message: `Employee removed from the seat successfully`,
      placement: 'topRight',
    });
    setIsModalOpen(false);
    setSelectedPerson([]);
  }
  const onRangeSelectChange = (value, type) => {
    setRangeSelect(prev => ({ ...prev, [type]: 's' + value }))
    setRangeValue(prev => ({ ...prev, [type]: value }))
  }

  const onChange = (value) => {
    if (value === "single") {
      setRadioValue('multiple')
    } else {
      setRadioValue('single')
    }
  };

  const handleTagChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  }

  const handleUnoccupiedPeople = () => {
    setSelectedEmployee(null)
    setselectedTL(null);
    setIsVisible(true);
    setOpen(true);
  }

  const handleMouseEnter = (e) => {
    setBadgeContent(true);
  };

  const handleMouseLeave = () => {
    setBadgeContent(false);
  };

  const handleComplete = () => {
    localStorage.setItem("seatLayout", JSON.stringify(currentLayout))
    setIsCompleteModalOpen(false)
  }

  const handleAutomaticScroll = (val) => {
    const targetElement = document.getElementById(val);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth", // Smooth scrolling animation
        block: "center",    // Scroll so the element is centered vertically
      });
    }
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
        <div className='header-imag-wrapper'>
          <img src='/assets/mitrah_logo.png' alt='mitrah' />
        </div>
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
        <div>
          <Select
            style={{
              width: 150,
            }}
            suffixIcon={selectedTL && <DeleteOutlined onClick={() => handleDeleteTlSelected()} />}
            className='ms-2'
            onChange={handleSelectTL}
            showSearch
            optionFilterProp="label"
            placeholder="Select TeamLeader"
            value={selectedTL}
            options={isTLlist}
          />

        </div>
        <Select
          style={{
            width: 150,
          }}
          className='ms-2'
          suffixIcon={<DeleteOutlined onClick={() => {
            setSelectedEmployee(null);
            const updatedLayout = currentLayout.map(item => (item.cls.includes("custom-box-glow-employee")) ? { ...item, cls: item.cls.replace("custom-box-glow-employee", "") } : item)
            setCurrentLayout(updatedLayout)
          }}
          />}
          onChange={handleEmployee}
          showSearch
          optionFilterProp="label"
          placeholder="Select Employee"
          value={selectedEmployee}
          options={employeeList}
        />
        <div className='icons-container'>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip placement="top" title={"Show Intercom"}>
              <span className='icon-wrapper'>
                <PhoneOutlined />
              </span>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                onClick={(e) => setIsIntercomVisible(e)}
              />
            </Tooltip>
          </div>
          <div className='icon-wrapper'>
            <Tooltip placement="top" title={radioValue === "multiple" ? "Multiple Select" : "Single Select"}>
              {radioValue === "multiple" ? <UsergroupAddOutlined onClick={() => onChange("multiple")} />
                : <UserOutlined onClick={() => onChange("single")} />}
            </Tooltip>
          </div>
          <Tooltip placement="top" title={"Complete"}>
            <CheckOutlined onClick={onHandleComplete} className='icon-wrapper' />
          </Tooltip>
          <Tooltip placement="top" title={"UnOccupied Employees"}>
            <UserDeleteOutlined className='icon-wrapper' onClick={handleUnoccupiedPeople} />
          </Tooltip>
        </div>
        <Button type="primary" onClick={() => setIsRemoveRangeModalOpen(true)}>Remove By Range</Button>

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
                onClick={() => { !val?.unchange && !(radioValue === "multiple" && val?.seat_id === "") && handleOpenSideSection(val); }}  ///modified
                style={((radioValue === "multiple" && val?.seat_id === "") || val?.unchange) ? { cursor: "not-allowed" } : { cursor: 'pointer' }}  ///modified
                data-grid={{ x: val.x, y: val.y, w: val.w, h: val.h, }}
                key={val?.i}

                id={val?.i} // id to DOM scroll while select the seat
                className={`seat
                ${val.unchange && "walk-area"}
                ${(selectBoxGlow.seatName === val?.i && selectBoxGlow.selectStatus) && "custom-box-glow"} 
                ${val.cls}
                `}
              >
                {val.extension_no && isIntercomVisible ?
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
                    <span style={(isIntercomVisible && selectedStack === "backend" && !val?.cls.includes("selected-seat") && val?.stack === "backend") ? { color: "white" } : {}}>{val.i} </span>
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
            radioValue={radioValue}  ///modified
            removeEmployee={setIsModalOpen} ///modified
            handleAutomaticScroll={handleAutomaticScroll}
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
      <Modal title="Save Alert" open={isCompleteModalOpen} onOk={handleComplete} onCancel={() => setIsCompleteModalOpen(false)} okText="Yes" okType="primary">
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
      <Modal
        title="Change User"
        open={isRemoveRangeModalOpen}
        onOk={handleRemoveRangeModalOk}
        onCancel={handleRemoveRangeModalCancel}
        okText="Yes"
        okType="primary"
      >
        <div>
          <InputNumber
            name='startRange'
            onChange={(e) => onRangeSelectChange(e, "startRange")}
            value={rangeValue.startRange}
          />
          <InputNumber
            name='endRange'
            className='m-2'
            onChange={(e) => onRangeSelectChange(e, "endRange")}
            value={rangeValue.endRange}
          />
          <div>
            Are you sure want to select the places?
          </div>
        </div>
      </Modal>
    </Layout >
  );
};

export default App;