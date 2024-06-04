// HeaderNoti.js
import { useEffect, useState } from 'react';
import useNotification from '../../hooks/useNotification';
import { Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCircle } from '@fortawesome/free-solid-svg-icons';
import {  useNavigate } from 'react-router-dom';
import useLocalStorage from '../../hooks/useLocalStorage';
import useConference from '../../hooks/useConferences';


const HeaderNoti = () => {
  const {handleGetOne} = useConference()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {user} = useLocalStorage()
  const { notifications, getNoticationById, getAllNotifications} = useNotification()
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    getAllNotifications()
  }, [])

  useEffect(() => {
    if (!notifications) {
      getAllNotifications()
    }
  }, [user])

  useEffect(() => {
    const hasUnreadNotifications = notifications.some(notification => !notification.read_status);
    setHasNewNotification(hasUnreadNotifications)
    
  }, [notifications]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickMessage = async (noti) => {
    await handleGetOne(noti.Follow.CallForPaperCfpId)
    await getNoticationById([noti])
    navigate(`/detailed-information/${noti.Follow.CallForPaperCfpId}`)
  }
  const handleViewAll = async () => {
    setDropdownOpen(!dropdownOpen);
    const unreadNotifications = notifications.filter(notification => !notification.read_status);
    
    await getNoticationById(unreadNotifications)
    navigate(user ? '/user/notifications' : 'login')
  }
  const splitNotificationMessage = (message) => {
    const parts = message.split('. ');
    const firstPart = parts[0];
    const secondPart = parts.slice(1).join('. '); // Nối lại các phần còn lại, phòng trường hợp thông báo có nhiều hơn một dấu chấm
   
    return { firstPart, secondPart };
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
      {hasNewNotification && <FontAwesomeIcon icon={faCircle} className='text-danger mt-3' style={{height: "10px", textAlign:"end"}}/>}
    </Dropdown.Toggle>

    <Dropdown.Menu className='shadow' style={{ right: 0, left: 'auto' }}>
      <div style={{ width: "300px", maxHeight: "400px" }} className='overflow-auto'>
        {
          notifications ? 
          <>
          {
          notifications.map((noti, index) =>
            {
              const { firstPart, secondPart } = splitNotificationMessage(noti.message);
              return (
                <Dropdown.Item 
              key={index}
              className='text-wrap fs-6'
              onClick={()=>handleClickMessage(noti)}
              >
              <div className='d-flex'>
                <div className='me-2 '>
                  <FontAwesomeIcon icon={faCircle}  style={{height: "8px"}} className={`${noti.read_status ? `text-teal-normal` : `text-danger`}`}/>
                </div>
                <div>
                  <div className={`${noti.read_status ? `text-secondary `: `text-color-black`}`}>
                    <div className='fw-bold fs-6 notification-message'>{firstPart}</div>
                    <span className='fs-6 notification-message'>{secondPart}</span>
                  </div>
                </div>
              </div>
            </Dropdown.Item>
              )
            }
          )
        }
          </>
          :
          <><p>No notifications </p></>
        }
      </div>
      
  <Dropdown.Divider />
      <Button onClick={handleViewAll} className='fs-6 fw-normal text-center w-100 text-color-darker bg-transparent border-0'>View all notifications {"  >"}</Button>
    </Dropdown.Menu>
  </Dropdown>
  );
};

export default HeaderNoti;
