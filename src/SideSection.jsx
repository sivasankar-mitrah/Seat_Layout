import React, { useEffect, useState } from 'react'
import { Button, Flex, Form, Modal, Select, Tag } from 'antd';
import Profile from './profileCard';
import UnOccupiedProfileCard from './unOccupiedProfileCard';
import { useNotification } from './common/notification';


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
        unOccupiedPeople,
        setSelectBoxGlow,      // setState of the glow box 
        selectBoxGlow       //State if the glow box while slecting
    }) {

    const [placeForunOccupiedPeople, setPlaceForUnOccupiedPeople] = useState([])
    const [placeForOccupiedPeople, setPlaceForOccupiedPeople] = useState([])
    const [isChangeButtonVisible, setIsButtonVisible] = useState(true);
    const [selectedCurrentEmployee, setSelectedCurrentEmployee] = useState({})
    const [isSwapButtonVisible, setIsSwapButtonVisible] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [placeForunOccupiedSeats, setPlaceForUnOccupiedSeats] = useState([])
    const [unOccupiedselectedSeat, setUnOccupiedselectedSeat] = useState("")
    const [readMore, setReadMore] = useState(true);
    const [devoption, setDevoption] = useState([])
    const api = useNotification();

    const values = form.getFieldValue();

    useEffect(() => {
        return (() => {

            form.setFieldsValue({ currentEmployee: null })
        })

    }, [])

    useEffect(() => {
        let updatedOption = [
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
        ]

        if (!selecetedPerson[0]?.seat_id) {
            updatedOption = updatedOption.filter((val) => val.title === 'ocupied')
        }

        setDevoption(updatedOption)
    }, [placeForOccupiedPeople, placeForunOccupiedPeople])

    useEffect(() => {
        if (isSubmit) {
            form.submit()
            setIsSubmit(false)
        }
    }, [isSubmit])

    useEffect(() => {
        let tempData = currentLayout.filter((item) => !item.seat_id && item.i !== selecetedPerson?.[0]?.i && !item.unchange).map((val) => {
            return { ...val, label: ` ${val.i}`, value: `${val.i}` }
        })
        let occupiedData = currentLayout.filter((item) => item.seat_id && !item.unchange && item.i !== selecetedPerson?.[0]?.i).map((val) => {

            return { ...val, label: `${val.devName} - ${val.i}`, value: `${val.i}` }
        })
        if (!(selecetedPerson[0]?.seat_id)) {
            tempData = []
        }

        let seatData = currentLayout.filter(data => data.devId === "" && !data.emptyArea
        ).map((val) => {
            return { ...val, label: ` ${val.i}`, value: `${val.i}` }
        })

        setPlaceForUnOccupiedSeats(seatData)

        setPlaceForUnOccupiedPeople(tempData)
        setPlaceForOccupiedPeople(occupiedData);
    }, [selecetedPerson])

    useEffect(() => {
        if (selecetedPerson[0]?.i) {
            if (selectedCurrentEmployee?.i) {
                if ((selectedCurrentEmployee?.seat_id) && selecetedPerson[0]?.seat_id) {
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
    }, [selecetedPerson, selectedCurrentEmployee])

    const handleUnOccupiedSeatSelect = (val) => {
        setUnOccupiedselectedSeat(val)
        setSelectBoxGlow({ selectStatus: true, seatName: val });
    }

    const handleSetOccupuiedSeatChange = () => {
        const seatIndex = currentLayout.findIndex(item => item.i === unOccupiedselectedSeat)
        setUnOccupiedPeople(prev => prev.filter((value) => value.devId !== selectedTag.devId))
        const updatedCurrentLayout = currentLayout.map((value, index) => {
            if (index === seatIndex) {
                return { ...value, cls: "seat", devName: selectedTag.devName, seat_id: value.i, role: selectedTag.role, stack: selectedTag.stack, isFresher: selectedTag.isFresher, devId: selectedTag.devId, TL_id: selectedTag.TL_id }
            }
            return value
        })
        form.setFieldsValue({ UnOccupiedSeats: null });
        setSelectBoxGlow({ seatName: "", selectStatus: true });
        setCurrentLayout(updatedCurrentLayout);
    }

    const handleConfirmSwap = () => {
        setIsModalOpen(true);
    }

    const handleOk = () => {
        setSelectBoxGlow({ ...selectBoxGlow, selectStatus: false }); //setState of the glowbox status to false to stop the glow while clicking the change button    
        setIsModalOpen(false);
        handleSwapChange();
        setOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = (values) => {
        let tempData = currentLayout
        let exitingEmployeePositionIdx = values.newEmployee.split(' - ')[1]
        const newEmployeePosition = tempData.findIndex(emp => emp.i === values?.currentEmployee);
        const exitingEmployeePosition = tempData.findIndex(emp => emp.i === exitingEmployeePositionIdx);

        let { devName, role, stack, devId } = tempData[newEmployeePosition];
        let unoccupiedMemberData = { devName, role, stack, value: devId, label: devName };

        const handleUpdatedDataCheck = (data) => data.replace("selected-place", "")

        const updatedData = tempData.map((item, index) => {
            if (tempData[exitingEmployeePosition].seat_id === "") {
                if (index === newEmployeePosition) return {
                    ...item,
                    cls: handleUpdatedDataCheck(currentLayout[exitingEmployeePosition]?.cls),
                    devName: currentLayout[exitingEmployeePosition]?.devName,
                    seat_id: currentLayout[exitingEmployeePosition]?.seat_id,
                    role: currentLayout[exitingEmployeePosition]?.role,
                    stack: currentLayout[exitingEmployeePosition]?.stack,
                    devId: currentLayout[exitingEmployeePosition]?.devId,
                    isFresher: currentLayout[exitingEmployeePosition]?.isFresher,
                    TL_id: currentLayout[exitingEmployeePosition]?.TL_id
                }
                else if (index === exitingEmployeePosition) return {
                    ...item,
                    cls: handleUpdatedDataCheck(currentLayout[newEmployeePosition]?.cls),
                    devName: currentLayout[newEmployeePosition]?.devName,
                    seat_id: currentLayout[newEmployeePosition]?.seat_id,
                    role: currentLayout[newEmployeePosition]?.role,
                    stack: currentLayout[newEmployeePosition]?.stack,
                    devId: currentLayout[newEmployeePosition]?.devId,
                    isFresher: currentLayout[newEmployeePosition]?.isFresher,
                    TL_id: currentLayout[newEmployeePosition]?.TL_id
                }
                else return item
            }
            else if (tempData[newEmployeePosition].seat_id === "") {
                if (index === exitingEmployeePosition) return {
                    ...item,
                    cls: handleUpdatedDataCheck(currentLayout[newEmployeePosition]?.cls),
                    devName: currentLayout[newEmployeePosition]?.devName,
                    seat_id: currentLayout[newEmployeePosition]?.seat_id,
                    role: currentLayout[newEmployeePosition]?.role,
                    stack: currentLayout[newEmployeePosition]?.stack,
                    devId: currentLayout[newEmployeePosition]?.devId,
                    isFresher: currentLayout[newEmployeePosition]?.isFresher,
                    TL_id: currentLayout[newEmployeePosition]?.TL_id
                }
                else if (index === newEmployeePosition) return {
                    ...item,
                    cls: `${handleUpdatedDataCheck(currentLayout[exitingEmployeePosition]?.cls)} `,
                    devName: currentLayout[exitingEmployeePosition]?.devName,
                    seat_id: currentLayout[exitingEmployeePosition]?.seat_id,
                    role: currentLayout[exitingEmployeePosition]?.role,
                    stack: currentLayout[exitingEmployeePosition]?.stack,
                    devId: currentLayout[exitingEmployeePosition]?.devId,
                    isFresher: currentLayout[exitingEmployeePosition]?.isFresher,
                    TL_id: currentLayout[exitingEmployeePosition]?.TL_id
                }
                else return item
            }

        })
        setOpen(false)
        setCurrentLayout([...updatedData]);
        setEnableUnOccupiedViews([unoccupiedMemberData])
        setSelectedPerson([]);
    };

    const handlePlaceChange = () => {

        setIsDeleteModalOpen(true)
    }

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
                    devId: selectedCurrentEmployee.devId,
                    TL_id: selectedCurrentEmployee.TL_id

                };
            }
            if (selectedCurrentIndex !== -1) {
                tempData[selectedCurrentIndex] = {
                    ...selectedCurrentEmployee,
                    // i: selecetedPerson[0].i,
                    devName: selecetedPerson[0].devName,
                    role: selecetedPerson[0].role,
                    stack: selecetedPerson[0].stack,
                    devId: selecetedPerson[0].devId,
                    TL_id: selecetedPerson[0].TL_id
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
        setSelectBoxGlow({ selectStatus: true, seatName: val });  // seting the status to true and seatname as the selected seat name

        const posElement = document.getElementById(val).getBoundingClientRect();
        const coordinate = { x: posElement.left, y: posElement.top }
        document.getElementById("parentLayout").scrollLeft = (coordinate.x - 180);
    }

    const handleTagChange = (tag, checked) => {
        const nextSelectedTag = checked ? tag : null
        setSelectedTag(nextSelectedTag);
        setReadMore(true);
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
                    label={(selecetedPerson[0]?.seat_id) ? "Employee Selected" : `Seat ${selecetedPerson[0]?.i} is currently available!`}
                    name="newEmployee"
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                >
                    {/* <Input disabled /> */}
                    {(selecetedPerson[0]?.seat_id) !== "" && <Profile
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
                            options={devoption}
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
                </> : null}
                {isVisible && <>
                    <Form.Item
                        label="Unoccupied Peoples"
                        name="unOccupied"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                    >
                        <Flex gap={8} wrap align="center">
                            {unOccupiedPeople.filter((_, i) => (!!readMore && i < 5) || !readMore).map((tag, index) => (
                                <Tag.CheckableTag
                                    className={
                                        tag.stack === 'frontend' ? 'react-bg ' :
                                            tag.stack === 'php' ? 'php-bg ' :
                                                tag.stack === 'backend' ? 'cf-bg ' : ""
                                    }
                                    key={index}
                                    checked={selectedTag === tag}
                                    onChange={(checked) => handleTagChange(tag, checked)}
                                >
                                    {tag.devName}
                                </Tag.CheckableTag>
                            ))}
                            <Button color="primary" onClick={() => setReadMore(!readMore)} variant="link">
                                {readMore ? "Read More" : "Read Less"}
                            </Button>
                        </Flex>
                        <Button color="danger" variant="solid" className='mt-3'>
                            Random Order
                        </Button>
                    </Form.Item>
                </>}
                {isVisible && selectedTag ? <>
                    <UnOccupiedProfileCard values={selectedTag} />
                    <Form.Item
                        label="UnOccupied Seats"
                        name="UnOccupiedSeats"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 22,
                        }}
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Select
                            className='ms-2'
                            showSearch
                            placeholder="Select Seat"
                            options={[
                                {
                                    label: <span>UnOccupied Seats</span>,
                                    title: 'un-occupied',
                                    options: placeForunOccupiedSeats,
                                }
                            ]}
                            onChange={handleUnOccupiedSeatSelect}
                        />
                    </Form.Item>
                    <Form.Item className='d-flex justify-content-center mt-4'>
                        <Button className='mx-2' onClick={handleSetOccupuiedSeatChange} type="primary">
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