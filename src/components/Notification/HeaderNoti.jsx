// HeaderNoti.js
import { useEffect, useState } from 'react';
import useNotification from '../../hooks/useNotification';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


const HeaderNoti = () => {
  //const { socket,  notifications, hasNewNotification, message, error, isConnected, sendMessage } = useNotification();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const { notifications} = useNotification()
  const [displayNotis, setDisplayNotis] = useState([])
  const [hasNewNotification, setHasNewNotification] = useState(false);
  useEffect(() => {
    const notiDot = JSON.parse(localStorage.getItem('noti_dot'));
    setHasNewNotification(notiDot);
    if(notifications > 0){
      setDisplayNotis(notifications)
    }
    else {
      const storedNoti = JSON.parse(localStorage.getItem('notis'));
      if(storedNoti){
        setDisplayNotis(storedNoti)
      }
    }
  }, [notifications]);

  const toggleDropdown = () => {
    if (dropdownOpen) {
      localStorage.setItem('noti_dot', JSON.stringify(false));
      setHasNewNotification(false);
    }
    setDropdownOpen(!dropdownOpen);
  };


  return (
    <Dropdown 
    isOpen={dropdownOpen}
    onClick={toggleDropdown}>

    <Dropdown.Toggle
      className='noti rounded-pill p-1 my-header-bg-icon mx-2 border-0 text-center d-flex align-items-center'
      title='Notification'
    >
      
      <FontAwesomeIcon icon={faBell} className='text-primary-normal fs-4'/>
      {hasNewNotification && <FontAwesomeIcon icon={faCircle} className='text-danger' style={{height: "10px", textAlign:"end"}}/>}
    </Dropdown.Toggle>

    <Dropdown.Menu className='shadow' style={{ right: 0, left: 'auto' }}>
      <div style={{ width: "300px", maxHeight: "200px" }} className='overflow-auto'>
        {
          displayNotis.map((noti, index) =>
            <Dropdown.Item 
              key={index}
              className='text-wrap fs-6 px-4 mx-0 d-inline-block text-truncate text-overflow-elli[sis' >
              <Link to={noti.conf_id ? `/detailed-information/${noti.conf_id}` : '/'} className='fs-6 text-color-black text-truncate'>
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
