import React, { useEffect, useMemo, useState } from 'react'
import { Button, Form, Input, } from 'antd';
import { Select } from 'antd';
import { devList } from './devList';
import { Radio } from 'antd';
export default function DrawerFn({ form, selecetedPerson, currentLayout, setCurrentLayout, setOpen, setEnableUnOccupiedViews, enableUnOccupiedViews }) {
    const [unOccupiedPeople, setUnOccupiedPeople] = useState([])
    const [placeForunOccupiedPeople, setPlaceForUnOccupiedPeople] = useState([])
    const [selectedUnOccupiedValue, setSelectedUnOccupiedValue] = useState(null);
    const [selectedSeatmethod, setSelectedSeatMethod] = useState('avail');

    console.log('selectedUnOccupiedValueselectedUnOccupiedValue', currentLayout);

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setSelectedSeatMethod(e.target.value);
        let constructedData = []
        if (e.target.value === "avail") {
            constructedData = currentLayout.filter((item) => item.unOccupied).map((val, dev) => {
                return { ...val, label: ` ${val.i}`, value: `${val.i}` }
            })
            console.log('asdasdasdas', constructedData)
            console.log('asdasdasdas', constructedData)

        } else {
            constructedData = getAllPlaces()

        }
        console.log('constructedData', constructedData)
        setPlaceForUnOccupiedPeople(constructedData)
    };
    const handleChange = (value) => {
        setSelectedUnOccupiedValue(value); // Update the state with the selected value
        console.log('Selectedvalue', value); // Log the selected value
    };
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
    const onFinish = (values) => {
        let tempData = currentLayout
        let exitingEmployeePositionIdx = values.newEmployee.split(' - ')[1]
        const newEmployeePosition = tempData.findIndex(emp => emp.i === values?.currentEmployee);
        const exitingEmployeePosition = tempData.findIndex(emp => emp.i === exitingEmployeePositionIdx);

        let { devName, role, stack, devId } = tempData[newEmployeePosition];
        let unoccupiedMemberData = { devName, role, stack, value: devId, label: devName };
        if (newEmployeePosition !== -1) {
            tempData[newEmployeePosition] = {
                ...selecetedPerson,
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
                devName: "",
                role: "developer",
                cls: "available-seats"
            };
        }
        setCurrentLayout(tempData)
        console.log('unoccupiedMemberDataunoccupiedMemberData', unoccupiedMemberData)
        setEnableUnOccupiedViews([unoccupiedMemberData])
        // setOpen(false)
    };
    console.log('enableUnOccupiedViews', enableUnOccupiedViews)

    const getAllPlaces = () => {
        return currentLayout.filter((item) => !item?.unchange)?.map((val, dev) => {
            return { ...val, label: `${val.devName} - ${val.i}`, value: `${val.i}` }
        })
    }
    useEffect(() => {
        console.log('55555555555555555', devList?.length);
        let data2 = getAllPlaces()
        let tempData = currentLayout.filter((item) => item.unOccupied).map((val, dev) => {
            return { ...val, label: ` ${val.i}`, value: `${val.i}` }
        })
        setPlaceForUnOccupiedPeople(tempData)
        setUnOccupiedPeople(data2)
    }, [])
    const handlePlaceChange = () => {

    }
    console.log('++++++ selecetedPersonselecetedPerson', selecetedPerson)
    return (
        <div>
            <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
            >
                {!enableUnOccupiedViews?.length ? <><Form.Item
                    label="New Employee"
                    name="newEmployee"
                    labelCol={{
                        span: 24,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                >
                    <Input disabled />
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
                            options={unOccupiedPeople}
                        />
                    </Form.Item> </> : <>
                    <Form.Item
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
                    </Form.Item>
                    {selectedUnOccupiedValue?.length ? <> <Form.Item> <Radio.Group onChange={onChange} value={selectedSeatmethod}>
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
                        </Form.Item></> : null}


                </>}

                <Form.Item className='d-flex justify-content-center mt-4'>
                    <Button onClick={handlePlaceChange} type="primary" htmlType="submit">
                        Change
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
