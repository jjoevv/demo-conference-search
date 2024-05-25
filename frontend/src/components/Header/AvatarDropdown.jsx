import React from 'react'
import { Button, Dropdown, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import avatarIcon from '../../assets/imgs/avatar.png'
import settingIcon from '../../assets/imgs/setting.png'
import logoutIcon from '../../assets/imgs/logout.png'
import useAuth from '../../hooks/useAuth'
const menu = [
    {path: 'account', title: 'Account', icon: avatarIcon},
    {path: 'setting', title: 'Setting', icon: settingIcon},
]
const AvatarDropdown = () => {
    const {handleLogout} = useAuth()
  return (
    <Dropdown>
        <Dropdown.Toggle className='noti rounded-pill my-header-bg-icon mx-1 border-0 d-flex align-items-center'>
                <Image src={avatarIcon} width={40} height={34} className=' text-center m-auto' />
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ right: 0, left: 'auto' }}> 
            {menu.map((item)=>(
                <Dropdown.Item key={item.path}>
                    <Link to={item.path} className='text-color-black'>
                        <Image width={20} className='me-2' src={item.icon}/>
                    {item.title}
                    </Link>
                </Dropdown.Item>
            ))}
            <Dropdown.Item onClick={handleLogout}>
                <Image width={20} className='me-2' src={logoutIcon}/>
                Logout
            </Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
  )
}

export default AvatarDropdown