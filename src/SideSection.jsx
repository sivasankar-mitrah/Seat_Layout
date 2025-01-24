import React, { useEffect, useRef, useState } from 'react'
import { Button, Flex, Form, Modal, Select, Table, Tag, Typography } from 'antd';
import Profile from './profileCard';
import UnOccupiedProfileCard from './unOccupiedProfileCard';
import { useNotification } from './common/notification';
import { CloseOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { Title } = Typography
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
        setIsVisible,
        setUnOccupiedPeople,
        unOccupiedPeople,
        setSelectBoxGlow,      // setState of the glow box 
        selectBoxGlow,       //State if the glow box while slecting
        selectedStack,
        radioValue,
        removeEmployee,
        handleAutomaticScroll
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
    const [devoption, setDevoption] = useState([]);
    const [isOccupiedModalOpen, setIsOccupiedModalOpen] = useState(false);
    const [updateOccupiedLayout, setUpdateOccupiedLayout] = useState({});
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 7,
    });
    const api = useNotification();

    const values = form.getFieldValue();

    useEffect(() => {
        return (() => {

            form.setFieldsValue({ currentEmployee: null })
        })

    }, [])

    useEffect(() => {
        if (!isVisible && selectedTag) {
            setSelectedTag(null)
            form.setFieldsValue({ UnOccupiedSeats: null })
            setSelectBoxGlow({ seatName: "", selectStatus: false });
        }
    }, [isVisible, selectedTag])

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };
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
                if (selectedStack !== "All" && selectedTag.stack === selectedStack) return {
                    ...value, cls: selectedStack, devName: selectedTag.devName, seat_id: value.i,
                    role: selectedTag.role, stack: selectedTag.stack, isFresher: selectedTag.isFresher, devId: selectedTag.devId, TL_id: selectedTag.TL_id
                }

                else return {
                    ...value, cls: "seat", devName: selectedTag.devName, seat_id: value.i,
                    role: selectedTag.role, stack: selectedTag.stack, isFresher: selectedTag.isFresher, devId: selectedTag.devId, TL_id: selectedTag.TL_id
                }
            }
            return value
        })


        form.setFieldsValue({ UnOccupiedSeats: null });
        setSelectedTag(null)
        setSelectBoxGlow({ seatName: "", selectStatus: true });
        setCurrentLayout(updatedCurrentLayout);
    }
    const handleOccupiedOk = () => {
        setCurrentLayout(updateOccupiedLayout.updatedLayout);
        setUnOccupiedPeople(updateOccupiedLayout.updatedUnOccupiedPeople);
        setIsOccupiedModalOpen(false)
    }

    const handleOccupiedCancel = () => {
        setPagination({ current: 1, pageSize: 7 })
        setIsOccupiedModalOpen(false)
    }

    const handleRandomOrder = (isSideSection = true) => {
        isSideSection && setIsOccupiedModalOpen(true);
        let updatedLayout = [...currentLayout];
        let updatedUnOccupiedPeoples = unOccupiedPeople
        if (!isSideSection) {
            updatedUnOccupiedPeoples = updateOccupiedLayout.randomObj
        }
        let updatedUnOccupiedPeople = [...updatedUnOccupiedPeoples].sort(() => Math.random() - 0.5);
        let randomObj = [];
        updatedLayout = updatedLayout.map((value) => {
            if (value.seat_id === "" && !value.emptyArea && updatedUnOccupiedPeople.length > 0) {
                const randomValue = updatedUnOccupiedPeople.pop();
                randomObj.push(
                    {
                        seat_id: value.i,
                        devName: randomValue.devName,
                        stack: randomValue.stack,
                        isFresher: randomValue.isFresher,
                        devId: randomValue.devId,
                        TL_id: randomValue.TL_id,
                        role: randomValue.role,
                        x: <div
                            className='text-danger fs-5 fw-bold'
                            onClick={() => handleRemoveRandomSeat(value.i)}
                            style={{ cursor: 'pointer' }}
                        >
                            x
                        </div>
                    });
                return {
                    ...value,
                    cls: "seat",
                    devName: randomValue.devName,
                    seat_id: value.i,
                    role: randomValue.role,
                    stack: randomValue.stack,
                    isFresher: randomValue.isFresher,
                    devId: randomValue.devId,
                    TL_id: randomValue.TL_id
                };
            }
            return value;
        });
        setUpdateOccupiedLayout({ updatedLayout, updatedUnOccupiedPeople, randomObj });
    };
    const handleRemoveRandomSeat = (seatId) => {
        setUpdateOccupiedLayout((prev) => {
            const filteredRandomObj = prev.randomObj.filter(item => item.seat_id !== seatId);
            const revertedPerson = prev.randomObj.find(item => item.seat_id === seatId);
            const updatedUnOccupiedPeople = [...prev.updatedUnOccupiedPeople, revertedPerson];

            const revertedLayout = prev.updatedLayout.map(item => {
                if (item.seat_id === seatId) {
                    return { ...item, seat_id: "", devName: "", devId: "", stack: "", cls: "empty-seat" };
                }
                return item;
            });

            return {
                updatedLayout: revertedLayout,
                updatedUnOccupiedPeople: updatedUnOccupiedPeople,
                randomObj: filteredRandomObj
            };
        });
    };


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
                    devName: "", seat_id: "", role: "", stack: "", devId: "", isFresher: "", TL_id: ""
                }
                else if (index === exitingEmployeePosition) return {
                    ...item,
                    cls: handleUpdatedDataCheck(currentLayout[newEmployeePosition]?.cls),
                    devName: currentLayout[newEmployeePosition]?.devName,
                    seat_id: item.i,
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
                    devName: "", seat_id: "", role: "", stack: "", devId: "", isFresher: "", TL_id: ""
                }
                else if (index === newEmployeePosition) return {
                    ...item,
                    cls: `${handleUpdatedDataCheck(currentLayout[exitingEmployeePosition]?.cls)} `,
                    devName: currentLayout[exitingEmployeePosition]?.devName,
                    seat_id: item.i,
                    role: currentLayout[exitingEmployeePosition]?.role,
                    stack: currentLayout[exitingEmployeePosition]?.stack,
                    devId: currentLayout[exitingEmployeePosition]?.devId,
                    isFresher: currentLayout[exitingEmployeePosition]?.isFresher,
                    TL_id: currentLayout[exitingEmployeePosition]?.TL_id
                }
                else return item
            }

            else {
                if (index === exitingEmployeePosition) {
                    return {
                        ...item,
                        cls: "empty-seat",
                        devName: "", seat_id: "", role: "", stack: "", devId: "", isFresher: "", TL_id: ""
                    }
                }
                else if (index === newEmployeePosition) {
                    setUnOccupiedPeople((prev) => [...prev,
                    {
                        TL_id: item.TL_id, devId: item.devId, devName: item.devName, isFresher: item.isFresher, role: item.role,
                        seat_id: item.seat_id, stack: item.stack
                    }]);

                    return {
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
                }
                else return item;
            }
        })
        setOpen(false)
        api.info({
            message: `Employee Moved Successfully`,
            placement: 'topRight',
        });
        setCurrentLayout(updatedData.map(item => (selectedStack !== "All" && item.stack === selectedStack) ? {
            ...item, cls: item.stack
        } : item));
        setEnableUnOccupiedViews([unoccupiedMemberData])
        setSelectedPerson([]);
    };

    const handlePlaceChange = () => {

        setIsDeleteModalOpen(true)
    }

    const columns = [
        {
            title: 'Available Seats',
            dataIndex: 'seat_id',
        },
        {
            title: "Developer's Name",
            dataIndex: 'devName',
        },
        {
            title: "Developer's Stack",
            dataIndex: 'stack',

            render: (tagvalue) => (
                <Tag key={tagvalue} className={
                    tagvalue === 'frontend' ? 'react-bg ' :
                        tagvalue === 'php' ? 'php-bg ' :
                            tagvalue === 'backend' ? 'cf-bg ' : ""
                }>
                    {tagvalue.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Remove",
            dataIndex: 'x',
        },
    ];

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
                message: `Employee Placed Successfully`,
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
        handleAutomaticScroll(val)
        // const posElement = document.getElementById(val).getBoundingClientRect();
        // const coordinate = { x: posElement.left, y: posElement.top }
        // document.getElementById("parentLayout").scrollLeft = (coordinate.x - 180);
    }

    const handleTagChange = (tag, checked) => {
        const nextSelectedTag = checked ? tag : null
        setSelectedTag(nextSelectedTag);
        setReadMore(true);
    };

    const handleMultipleStageColorTag = (data) => (["frontend", "php", "backend"].some(stack => stack.includes(data.stack))) && `${data.stack}`;//
    const handleMultipleDrawerUncheck = (data) => {
        const handleColorReplace = (data) => data.cls.replace("selected-place", "")

        setSelectedPerson((prev) => prev.filter(({ seat_id }) => seat_id !== data.seat_id))

        if (selectedStack !== "All" && data.stack === selectedStack) setCurrentLayout((prev) => prev.map((item) => (item.seat_id === data.seat_id) ? { ...item, cls: `${handleColorReplace(item)} ${selectedStack}` } : item))
        else setCurrentLayout((prev) => prev.map((item) => (item.seat_id === data.seat_id) ? { ...item, cls: `${handleColorReplace(item)} ` } : item))
    }


    const moveRow = (dragKey, hoverKey, isDrop) => {
        if (dragKey === hoverKey) return; // No-op if keys are the same

        if (!isDrop) {
            return; // Handle hover without state update
        }

        setUpdateOccupiedLayout((prevLayout) => {
            const updatedRandomObj = [...prevLayout.randomObj];

            // Find indices using unique keys
            const draggedIndex = updatedRandomObj.findIndex(
                (item) => item.seat_id === dragKey
            );
            const hoveredIndex = updatedRandomObj.findIndex(
                (item) => item.seat_id === hoverKey
            );

            if (draggedIndex === -1 || hoveredIndex === -1) return prevLayout; // Safety check

            // Rearrange the array
            // const [draggedRow] = updatedRandomObj.splice(draggedIndex, 1);
            // updatedRandomObj.splice(hoveredIndex, 0, draggedRow);

            let selected = updatedRandomObj[draggedIndex].seat_id
            let hovered = updatedRandomObj[hoveredIndex].seat_id

            const swapDataExceptSeatId = (updatedRandomObj, draggedIndex, hoveredIndex) => {
                const draggedItem = { ...updatedRandomObj[draggedIndex] };
                const hoveredItem = { ...updatedRandomObj[hoveredIndex] };

                const keysToSwap = Object.keys(draggedItem).filter((key) => key !== 'seat_id' && key !== 'x');

                keysToSwap.forEach((key) => {
                    const temp = draggedItem[key];
                    draggedItem[key] = hoveredItem[key];
                    hoveredItem[key] = temp;
                });

                updatedRandomObj[draggedIndex] = draggedItem;
                updatedRandomObj[hoveredIndex] = hoveredItem;

                return updatedRandomObj;
            };

            const swapSeatData = (updatedSeatLayout, selectedKey, hoveredKey) => {
                // Clone the array to avoid mutating the original state
                const updatedLayout = [...updatedSeatLayout];

                // Find the indices of the selected and hovered keys
                const selectedIndex = updatedLayout.findIndex(item => item.seat_id === selectedKey);
                const hoveredIndex = updatedLayout.findIndex(item => item.seat_id === hoveredKey);

                if (selectedIndex === -1 || hoveredIndex === -1) {
                    return updatedLayout;
                }

                // Extract the selected and hovered items
                const selectedItem = { ...updatedLayout[selectedIndex] };
                const hoveredItem = { ...updatedLayout[hoveredIndex] };

                // List of properties to swap
                const keysToSwap = ["devName", "role", "stack", "devId", "isFresher", "TL_id"];

                // Swap the values of the properties
                keysToSwap.forEach(key => {
                    const temp = selectedItem[key];
                    selectedItem[key] = hoveredItem[key];
                    hoveredItem[key] = temp;
                });

                // Update the array with the swapped items
                updatedLayout[selectedIndex] = selectedItem;
                updatedLayout[hoveredIndex] = hoveredItem;

                return updatedLayout;
            };


            let updatedrandomObj = swapDataExceptSeatId(updatedRandomObj, draggedIndex, hoveredIndex)

            let updatedSeatLayout = [...prevLayout.updatedLayout]

            let updatedSeat = swapSeatData(updatedSeatLayout, selected, hovered)

            return {
                ...prevLayout,
                updatedLayout: updatedSeat,
                randomObj: updatedrandomObj,
            };
        });
    };

    const DraggableBodyRow = ({ moveRow, className, style, index, ...restProps }) => {
        const ref = useRef();

        const [, drop] = useDrop({
            accept: "row",
            hover: (item) => {
                if (!ref.current) return;

                const dragKey = item.dataRowKey; // Key of the dragged row (original value)

                const hoverKey = restProps["data-row-key"]; // Key of the currently hovered row

                if (dragKey === hoverKey) return; // Avoid unnecessary actions

                // Trigger row movement logic but do not modify item.dataRowKey
                moveRow(dragKey, hoverKey, false); // False indicates it's not a drop yet
            },
            drop: (item) => {
                if (!ref.current) return;

                const dragKey = item.dataRowKey; // Final key of the dragged row
                const hoverKey = restProps["data-row-key"]; // Final key of the dropped row

                moveRow(dragKey, hoverKey, true); // Update state on drop
            },
        });

        const [{ isDragging }, drag] = useDrag({
            type: "row",
            item: { dataRowKey: restProps["data-row-key"], index }, // Attach unique key and index
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        drag(drop(ref));

        return (
            <tr
                ref={ref}
                style={{ ...style, opacity: isDragging ? 0 : 1 }}
                className={className}
                {...restProps}
            />
        );
    };
const sideSectionClose =() => {
    setIsVisible(false);
    setOpen(false);
    setSelectedPerson([])
    const updatedLayout = currentLayout.map((item) => {
        if (item.i === selecetedPerson[0].i) {
            return { ...item, cls: selecetedPerson[0].cls }
        }
        return item
    })
    setCurrentLayout(updatedLayout)
}

    return (
        <>
            {
                (radioValue === "single" || isVisible) ?
                    <div>
                        <Form

                            form={form}
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                            style={{ position: "fixed" }}
                        >
                            {!isVisible ? <>
                                <div style={{ display: "flex" }}>
                                    <div>
                                        <Form.Item
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
                                            <>
                                                <Button className='mx-2' onClick={handlePlaceChange} disabled={isChangeButtonVisible} type="primary">
                                                    Change
                                                </Button>
                                                {isSwapButtonVisible &&
                                                    <Button onClick={handleConfirmSwap} type="primary">
                                                        Swap
                                                    </Button>
                                                }</>
                                        </Form.Item>
                                    </div>
                                    <Button onClick={()=>sideSectionClose('single')} style={{ marginRight: '50px', fontSize: '1.2rem' }} type='warning'><CloseOutlined style={{ color: 'red' }} /></Button>
                                </div>

                            </> : null}
                            {isVisible && <>
                                <div style={{ display: "flex" }}>
                                    <Form.Item
                                        label={<Title level={4} type='danger'>Unoccupied Peoples</Title>}
                                        name="unOccupied"
                                        labelCol={{
                                            span: 24,
                                        }}
                                        wrapperCol={{
                                            span: 24,
                                        }}

                                    >
                                        <Flex gap={8} wrap align="center" style={{ maxHeight: unOccupiedPeople.length > 15 ? "400px" : "auto", overflow: "auto" }}>
                                            {unOccupiedPeople.filter((_, i) => (!!readMore && i < 15) || !readMore).map((tag, index) => (

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
                                            {unOccupiedPeople.length > 15 ?
                                                <Button color="primary" onClick={() => setReadMore(!readMore)} variant="link">
                                                    {readMore ? "Read More" : "Read Less"}
                                                </Button>
                                                : null}
                                        </Flex>
                                        <Button color="danger" className='mt-3' onClick={() => handleRandomOrder(true)} variant="solid">
                                            Random Order
                                        </Button>
                                    </Form.Item>
                                    <Button onClick={() => {
                                        setIsVisible(false);
                                        !selecetedPerson.length ? setOpen(false) : setOpen(true)
                                    }} style={{ marginRight: '50px', fontSize: '1.2rem' }} type='warning'><CloseOutlined style={{ color: 'red' }} /></Button>
                                </div>
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
                                        value={unOccupiedselectedSeat}
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
                        <Modal
                            title="Randomized Seat Allocation"
                            okText="Yes"
                            okType="primary"
                            footer={updateOccupiedLayout?.randomObj?.length ? [
                                <Button color="danger" variant="solid" onClick={() => handleRandomOrder(false)}>Reorder Again</Button>,
                                <Button key="submit" type="primary" onClick={handleOccupiedOk}>
                                    Yes
                                </Button>,
                                <Button key="back" onClick={handleOccupiedCancel}>
                                    Close
                                </Button>,
                            ] : null}
                            className='mh-75'
                            open={isOccupiedModalOpen} onOk={handleOccupiedOk} onCancel={handleOccupiedCancel}
                        >
                            {updateOccupiedLayout?.randomObj?.length ? <>
                                {/* <Table
                                    columns={columns}
                                    pagination={{ pageSize: 7 }}
                                    dataSource={updateOccupiedLayout?.randomObj}
                                /> */}
                                <DndProvider backend={HTML5Backend}>
                                    <Table
                                        columns={columns}
                                        dataSource={updateOccupiedLayout?.randomObj}
                                        pagination={pagination}
                                        onChange={handleTableChange}
                                        rowKey="seat_id"
                                        components={{
                                            body: {
                                                row: (props) => {
                                                    if (props.children && props.children[0] && props.children[0].props.children) {
                                                        if (props.children[0].props.children[0] === "Empty Seats") {
                                                            return <tr {...props} />;
                                                        }
                                                    }
                                                    // const index = props['data-row-key'] ? parseInt(props['data-row-key'].replace('s', '')) : null;
                                                    const index = props['data-row-key']
                                                    return <DraggableBodyRow {...props} moveRow={moveRow} index={index} />;
                                                },
                                            },
                                        }}

                                    />
                                </DndProvider>
                                {/* <Button type='primary' onClick={()=>handleRandomOrder(false)}>Reorder Again</Button> */}
                            </>
                                : "No Empty Seats"}
                        </Modal>
                    </div> :
                    <div style={{display:"flex", justifyContent:'space-evenly'}}>
                    <div className='multiple-drawer-parent'>
                        <h5>Selected Persons</h5>
                        <div className='multiple-drawer-grid'>
                            {selecetedPerson.map(person => {
                                return (
                                    <Tag key={person.devId}
                                        onClose={() => handleMultipleDrawerUncheck(person)}
                                        closeIcon={person.seat_id !== "" &&
                                            <CloseOutlined style={(person.stack === "backend" || person.stack === "php") ? { color: "white" } : { color: "black" }} />}
                                        className={`multiple-drawer-tags ${handleMultipleStageColorTag(person)}`}
                                        style={person.stack === "php" && { color: 'white' }}
                                    >{person.devName}
                                    </Tag>
                                )
                            })}
                        </div>
                        {radioValue === "multiple" && selecetedPerson?.length >= 1 && <Button type="primary"
                            style={{ marginTop: "30px", width: "fit-content", }}
                            onClick={() => removeEmployee(true)}>Remove Employee </Button>}
                    </div>
                    <Button  onClick={()=>sideSectionClose('multiple')} style={{ marginRight: '50px', fontSize: '1.2rem' }} type='warning'><CloseOutlined style={{color:'red'}}/></Button>
                    </div>
            }
        </>
    )
}