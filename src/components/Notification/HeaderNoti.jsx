// HeaderNoti.js
import { useEffect, useState } from 'react';
import useNotification from '../../hooks/useNotification';
import { Badge, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';


const HeaderNoti = ({socket}) => {
  const [input, setInput] = useState('');
  //const { socket,  notifications, hasNewNotification, message, error, isConnected, sendMessage } = useNotification();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const { notifications, hasNewNotification} = useNotification()
  
  
  useEffect(()=>{
    if(hasNewNotification){
      localStorage.setItem('noti-dot', JSON.stringify('true'))
    }
  },[notifications])


  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      localStorage.setItem('noti_dot', JSON.stringify('false'))
    }
  };

  return (
    <div className="header">
      
    </div>
  );
};

export default HeaderNoti;
