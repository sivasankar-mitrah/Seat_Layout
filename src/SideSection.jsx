import React, { useEffect, useState } from 'react'
import { Button, Flex, Form, Modal, Select, Tag } from 'antd';
import Profile from './profileCard';
import UnOccupiedProfileCard from './unOccupiedProfileCard';
import { useNotification } from './common/notification';
// import { devList } from './devList';

// const groupedOptions = [
//     {
//         label: 'UnOcuupied',
//         options: [
//             { value: 'apple', label: 'Apple' },
//             { value: 'banana', label: 'Banana' },
//             { value: 'orange', label: 'Orange' }
//         ]
//     },
//     {
//         label: 'Occupied',
//         options: [
//             { value: 'carrot', label: 'Carrot' },
//             { value: 'broccoli', label: 'Broccoli' },
//             { value: 'spinach', label: 'Spinach' }
//         ]
//     },
// ];

export default function DrawerFn
    ({
        form,
        isSubmit,
        setIsSubmit,
        setIsDeleteModalOpen,
        selecetedPerson,
        setSelectedPerson,
        currentLayout,
        setCurrentLayout,
        setOpen,
        setEnableUnOccupiedViews,
        enableUnOccupiedViews,
        show,
        isVisible,
        setUnOccupiedPeople,
        unOccupiedPeople
    }) {

    const [placeForunOccupiedPeople, setPlaceForUnOccupiedPeople] = useState([])
    const [placeForOccupiedPeople, setPlaceForOccupiedPeople] = useState([])
    const [isChangeButtonVisible, setIsButtonVisible] = useState(true);
    const [selectedCurrentEmployee, setSelectedCurrentEmployee] = useState({})
    const [isSwapButtonVisible, setIsSwapButtonVisible] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [selectedUnOccupiedValue, setSelectedUnOccupiedValue] = useState(null);
    // const [selectedSeatmethod, setSelectedSeatMethod] = useState('avail');
    const api = useNotification();

    const values = form.getFieldValue();

    console.log("values", values);
    useEffect(() => {
        return (() => {

            form.setFieldsValue({ currentEmployee: null })
        })

    }, [])

    useEffect(() => {
        if (isSubmit) {
            form.submit()
            // onFinish()
            setIsSubmit(false)
        }
    }, [isSubmit])

    useEffect(() => {
        let tempData = currentLayout.filter((item) => item.unOccupied && item.i !== selecetedPerson?.[0]?.i).map((val) => {
            return { ...val, label: ` ${val.i}`, value: `${val.i}` }
        })
        let occupiedData = currentLayout.filter((item) => !item.unOccupied && !item.unchange && item.i !== selecetedPerson?.[0]?.i).map((val) => {

            return { ...val, label: `${val.devName} - ${val.i}`, value: `${val.i}` }
        })
        if (selecetedPerson[0]?.unOccupied) {
            tempData = []
        }

        setPlaceForUnOccupiedPeople(tempData)
        setPlaceForOccupiedPeople(occupiedData);
        // let data2 = getAllPlaces();
        // setUnOccupiedPeople(data2)
    }, [selecetedPerson])

    useEffect(() => {
        if (selecetedPerson[0]?.i) {
            if (selectedCurrentEmployee?.i) {
                if (!(selectedCurrentEmployee?.unOccupied === true) && !(selecetedPerson[0]?.unOccupied === true)) {
                    setIsSwapButtonVisible(true)
                } else {
                    setIsSwapButtonVisible(false)
                }
            } else {
                setIsSwapButtonVisible(false)
            }
        } else {
            setIsSwapButtonVisible(false)
        }
    }, [selecetedPerson])

    const handleConfirmSwap = () => {
        setIsModalOpen(true);
    }

    const handleOk = () => {
        setIsModalOpen(false);
        handleSwapChange();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // const getAllPlaces = () => {
    //     return currentLayout.filter((item) => !item?.unchange)?.map((val, dev) => {
    //         return { ...val, label: `${val.devName} - ${val.i}`, value: `${val.i}` }
    //     })
    // }

    const onFinish = (values) => {
        console.log("valuessssssssss", values);
        
        let tempData = currentLayout
        let exitingEmployeePositionIdx = values.newEmployee.split(' - ')[1]
        const newEmployeePosition = tempData.findIndex(emp => emp.i === values?.currentEmployee);
        const exitingEmployeePosition = tempData.findIndex(emp => emp.i === exitingEmployeePositionIdx);

        let { devName, role, stack, devId } = tempData[newEmployeePosition];
        let unoccupiedMemberData = { devName, role, stack, value: devId, label: devName };
        let newEmployeeDevID = tempData[newEmployeePosition].devId
        console.log("tempData[newEmployeePosition]", tempData[newEmployeePosition]);
        console.log("tempData[exitingEmployeePosition]", tempData[exitingEmployeePosition]);

        if (!(selecetedPerson[0]?.unOccupied)) {
            if (newEmployeePosition !== -1) {
                tempData[newEmployeePosition] = {
                    ...selecetedPerson[0],
                    i: values?.currentEmployee,
                    x: tempData[newEmployeePosition].x,
                    y: tempData[newEmployeePosition].y,
                    h: tempData[newEmployeePosition].h,
                    w: tempData[newEmployeePosition].w,
                };
            }
            if (exitingEmployeePosition !== -1) {
                tempData[exitingEmployeePosition] = {
                    i: exitingEmployeePositionIdx,
                    x: tempData[exitingEmployeePosition].x,
                    y: tempData[exitingEmployeePosition].y,
                    h: tempData[exitingEmployeePosition].h,
                    w: tempData[exitingEmployeePosition].w,
                    devName: tempData[exitingEmployeePosition].devName,
                    stack: tempData[exitingEmployeePosition].stack,
                    role: "developer",
                    cls: "available-seats",
                    unOccupied: true,
                    devId: newEmployeeDevID
                };
            }
        } else {
            console.log("selecetedPerson[0] 678", selecetedPerson[0]);
            if (exitingEmployeePosition !== -1) {
                tempData[exitingEmployeePosition] = {
                    i: exitingEmployeePositionIdx,
                    x: tempData[exitingEmployeePosition].x,
                    y: tempData[exitingEmployeePosition].y,
                    h: tempData[exitingEmployeePosition].h,
                    w: tempData[exitingEmployeePosition].w,
                    cls: tempData[newEmployeePosition].cls,
                    devId: tempData[newEmployeePosition].devId,
                    devName: tempData[newEmployeePosition].devName,
                    role: tempData[newEmployeePosition].role,
                    stack: tempData[newEmployeePosition].stack,
                    unOccupied: tempData[newEmployeePosition].unOccupied,
                };
            }

            if (newEmployeePosition !== -1) {
                tempData[newEmployeePosition] = {
                    ...selecetedPerson[0],
                    i: values?.currentEmployee,
                    x: tempData[newEmployeePosition].x,
                    y: tempData[newEmployeePosition].y,
                    h: tempData[newEmployeePosition].h,
                    w: tempData[newEmployeePosition].w,
                };
            }

        }

        setCurrentLayout(tempData)
        setEnableUnOccupiedViews([unoccupiedMemberData])
        setOpen(false)
        setSelectedPerson([]);
    };

    const handlePlaceChange = () => {
        setIsDeleteModalOpen(true)
    }

    // const handleSelectChange = (val) => {
    //     setIsButtonVisible(false)
    // }

    const handleSwapChange = () => {
        if (selecetedPerson[0]?.i && selectedCurrentEmployee?.i) {
            let tempData = currentLayout
            const selectedIndex = tempData.findIndex(emp => emp.i === selecetedPerson[0]?.i);
            const selectedCurrentIndex = tempData.findIndex(emp => emp.i === selectedCurrentEmployee?.i);

            if (selectedIndex !== -1) {
                tempData[selectedIndex] = {
                    ...selecetedPerson[0],
                    // i: selectedCurrentEmployee.i,
                    devName: selectedCurrentEmployee.devName,
                    role: selectedCurrentEmployee.role,
                    stack: selectedCurrentEmployee.stack,
                    devId: selectedCurrentEmployee.devId
                };
            }
            if (selectedCurrentIndex !== -1) {
                tempData[selectedCurrentIndex] = {
                    ...selectedCurrentEmployee,
                    // i: selecetedPerson[0].i,
                    devName: selecetedPerson[0].devName,
                    role: selecetedPerson[0].role,
                    stack: selecetedPerson[0].stack,
                    devId: selecetedPerson[0].devId
                };
            }
            setCurrentLayout([...tempData]);
            api.info({
                message: `Swap Done Successfully`,
                placement: 'topRight',
            });
        }
    }

    const handleOccupuiedChange = (val) => {
        let changedSelection = currentLayout?.filter((item) => item?.i === val)[0]
        setSelectedCurrentEmployee(changedSelection)
        setIsButtonVisible(false)
        if (!(changedSelection?.unOccupied === true) && !(selecetedPerson[0]?.unOccupied === true)) {
            setIsSwapButtonVisible(true)
        } else {
            setIsSwapButtonVisible(false)
        }
    }

    const handleTagChange = (tag, checked) => {
        const nextSelectedTag = checked ? tag : null
        setSelectedTag(nextSelectedTag);
    };



    return (
        <div>
            <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
                style={{ position: "fixed" }}
            >
                {!isVisible ? <><Form.Item
                    label={!(selecetedPerson[0]?.unOccupied) ? "Employee Selected" : `Seat Selected - ${selecetedPerson[0]?.i}`}
                    name="newEmployee"
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                >
                    {/* <Input disabled /> */}
                    {!(selecetedPerson[0]?.unOccupied) && <Profile
                        values={values}
                        show={show}
                        currentLayout={currentLayout}
                        setCurrentLayout={setCurrentLayout}
                        setUnOccupiedPeople={setUnOccupiedPeople}
                        setSelectedPerson={setSelectedPerson}
                        setOpen={setOpen} />}
                </Form.Item>
                    <Form.Item
                        label="Current Employee"
                        name="currentEmployee"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Select
                            className='ms-2'
                            showSearch
                            placeholder="Select New Employee"
                            options={[
                                {
                                    label: <span>UnOccupied</span>,
                                    title: 'un-occupied',
                                    options: placeForunOccupiedPeople,
                                },
                                {
                                    label: <span>Occupied</span>,
                                    title: 'ocupied',
                                    options: placeForOccupiedPeople,
                                },
                            ]}
                            onChange={handleOccupuiedChange}
                        />
                    </Form.Item>
                    <Form.Item className='d-flex justify-content-center mt-4'>
                        <Button className='mx-2' onClick={handlePlaceChange} disabled={isChangeButtonVisible} type="primary">
                            Change
                        </Button>
                        {isSwapButtonVisible &&
                            <Button onClick={handleConfirmSwap} type="primary">
                                Swap
                            </Button>
                        }
                    </Form.Item>
                </> : <>
                    {/* <Form.Item
                        label="UnOccupied Persons"
                        name="unoccupiedPersons"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                    >
                        <Select
                            className='ms-2'
                            showSearch
                            placeholder="Select UnOccupiedEmployee"
                            options={enableUnOccupiedViews}
                            onChange={handleChange}
                        />
                    </Form.Item> */}
                    {/* {selectedUnOccupiedValue?.length ? <> <Form.Item> <Radio.Group onChange={onChange} value={selectedSeatmethod}>
                        <Radio value={'avail'}>Select Available Places</Radio>
                        <Radio value={'exist'}>Select ExistingPlace</Radio>
                    </Radio.Group></Form.Item>   <Form.Item
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        label="Select place for UnOccupied Persons"
                        name="UnOccupiedPersonPlace"
                        className='d-flex flex-column'
                    >
                            <Select
                                className='ms-2'
                                showSearch
                                placeholder="Select New Employee"
                                options={placeForunOccupiedPeople}
                            />
                        </Form.Item></> : null} */}
                </>}
                {isVisible && <>
                    <Form.Item
                        label="Unoccupied Peoples"
                        name="newEmployee"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                    >
                        <Flex gap={4} wrap align="center">
                            {unOccupiedPeople.map((tag) => (
                                <Tag.CheckableTag
                                    className={
                                        tag.stack === 'frontend' ? 'react-bg' :
                                            tag.stack === 'php' ? 'php-bg' :
                                                tag.stack === 'backend' ? 'cf-bg' : ""
                                    }
                                    key={tag}
                                    checked={selectedTag === tag}
                                    onChange={(checked) => handleTagChange(tag, checked)}
                                >
                                    {tag.devName}
                                </Tag.CheckableTag>
                            ))}
                        </Flex>
                    </Form.Item>
                </>}
                {console.log(`SideSection.jsx 315 selectedTag---->`, selectedTag?.length)}
                {selectedTag ? <>
                    <UnOccupiedProfileCard values={selectedTag} />
                    <Form.Item
                        label="Current Employee"
                        name="currentEmployee"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Select
                            className='ms-2'
                            showSearch
                            placeholder="Select New Employee"
                            options={[
                                {
                                    label: <span>UnOccupied</span>,
                                    title: 'un-occupied',
                                    options: placeForunOccupiedPeople,
                                }
                            ]}
                            onChange={handleOccupuiedChange}
                        />
                    </Form.Item>
                    <Form.Item className='d-flex justify-content-center mt-4'>
                        <Button className='mx-2' onClick={handlePlaceChange} disabled={isChangeButtonVisible} type="primary">
                            Change
                        </Button>
                    </Form.Item>
                </> : null}
            </Form>
            <Modal
                title="Swap User"
                okText="Yes"
                okType="primary"
                open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
            >
                <div>
                    Are you sure you want to Swap the User?
                </div>
            </Modal>
        </div>
    )
}