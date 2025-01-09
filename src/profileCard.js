import { Avatar } from "antd"
import { UserOutlined } from '@ant-design/icons';

function Profile({ values, show }) {
    console.log("values", values)
    return (
        <>

            <div className='profile'>
                <Avatar shape="square" size={60} icon={<UserOutlined />} />
                <div className='displayDetails'>
                    <p>{values.newEmployee}</p>
                    <p>{show[0]?.stack}</p>
                </div>
            </div>
        </>
    )
}

export default Profile;