// HeaderNoti.js
import { useEffect, useState } from 'react';
import useNotification from '../../hooks/useNotification';
import { Badge, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


const HeaderNoti = ({socket}) => {
  const [input, setInput] = useState('');
  //const { socket,  notifications, hasNewNotification, message, error, isConnected, sendMessage } = useNotification();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const { notifications, hasNewNotification} = useNotification()
  


  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      localStorage.setItem('noti_dot', JSON.stringify('false'))
    }
  };

  return (
    <Dropdown>

    <Dropdown.Toggle
      className='noti rounded-pill p-1 my-header-bg-icon mx-2 border-0'
      title='Notification'
    >
      <FontAwesomeIcon icon={faBell} className='text-primary-normal'/>
    </Dropdown.Toggle>

    <HeaderNoti/>
    <Dropdown.Menu className='shadow' style={{ right: 0, left: 'auto' }}>
      <div style={{ width: "200px", maxHeight: "200px" }} className='overflow-auto'>
        {
          notifications.map(noti =>
            <Dropdown.Item 
              key={noti.id}
              className='text-wrap fs-6 px-4 mx-0 d-inline-block text-truncate text-overflow-elli[sis' >
              <Link to='/detail/1' className='fs-6 text-color-black text-truncate'>
                <strong>{noti.message}</strong>
              </Link>
            </Dropdown.Item>
          )
        }
      </div>
      
  <Dropdown.Divider />
      <Link to='/notifications' className='fs-6 fw-normal m-2 pt-3 text-color-darker'>View all notifications {"   >"}</Link>
    </Dropdown.Menu>
  </Dropdown>
  );
};

export default HeaderNoti;
