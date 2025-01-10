import { Avatar } from "antd"
import { UserOutlined } from '@ant-design/icons';

function UnOccupiedProfileCard({values}) {
    console.log("values", values)
    return (
        <div className='profile'>
            <Avatar shape="square" size={60} icon={<UserOutlined />} />
            <div className='displayDetails'>
                <p>{values.devName}</p>
                <p>{values?.stack}</p>
            </div>
        </div>
    )
}

export default UnOccupiedProfileCard;