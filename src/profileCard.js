import { useState } from "react";
import { Avatar, Flex, Modal } from "antd";
import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useNotification } from './common/notification';

function Profile({ values, show, currentLayout, setCurrentLayout, setUnOccupiedPeople, setOpen, setSelectedPerson }) {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const api = useNotification();

    const handleConfirmDelete = () => {
        setIsModalOpen(true);
    }

    const handleOk = () => {
        setIsModalOpen(false);
        handleRemove();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleRemove = () => {
        const updatedLayout = currentLayout.map(item => {
            if (item.devId === show[0]?.devId) {
                setUnOccupiedPeople((prev) => [...prev, { ...item, i: null }])
                setOpen(false);
                setSelectedPerson([]);
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
            return item;
        });

        setCurrentLayout(updatedLayout);
        api.info({
            message: `${show[0].devName} removed from the seat successfully`,
            placement: 'topRight',
        });
    };

    return (
        <>
            <Flex justify="between" align="start" gap={100}>
                <div className='profile'>
                    <Avatar shape="square" size={60} icon={<UserOutlined />} />
                    <div className='displayDetails'>
                        <p>{values.newEmployee}</p>
                        <p>{show && show[0]?.stack}</p>
                    </div>
                </div>
                {/* Call handleRemove on click */}
                <DeleteOutlined
                    style={{ fontSize: '20px', color: 'red' }}
                    title="Remove"
                    onClick={handleConfirmDelete}
                />
            </Flex>
            <Modal
                title="Delete User"
                okText="Yes"
                okType="primary"
                open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
            >
                <div>
                    Are you sure you want to Remove the User?
                </div>
            </Modal >
        </>
    );
}

export default Profile;