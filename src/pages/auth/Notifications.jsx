import React, { useEffect, useState } from 'react'
import { Button, Container, Row } from 'react-bootstrap'
import useNotification from '../../hooks/useNotification'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
const Notifications = () => {
  const { notifications} = useNotification()
  const [displayNotis, setDisplayNotis] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    
    console.log({notifications})
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

  const makeDateBold = (dateStr) => {
    return `<strong>${moment(dateStr).format('YYYY/MM/DD')}</strong>`;
  };

  const splitNotificationMessage = (message) => {
  const parts = message.split('. ');
  const firstPart = parts[0];
  const secondPart = parts.slice(1).join('. '); // Nối lại các phần còn lại, phòng trường hợp thông báo có nhiều hơn một dấu chấm
  const secondPartWithBoldDate = secondPart.replace(/"\d+\/\d+\/\d+"/g, makeDateBold); // In đậm ngày
  return { firstPart, secondPart: secondPartWithBoldDate };
};
  return (
    <Container
      fluid
      className='pt-5  px-5' style={{marginLeft: "350px", marginTop: "60px" }}>
      <h4 className='mb-4'>Notification</h4>
      <h5>All notifications here</h5>


      {
        displayNotis.map((noti, index)=>{
          const { firstPart, secondPart } = splitNotificationMessage(noti.message);
          return (
            <Row key={index} className='p-4 bg-skyblue-light rounded my-4 me-3'>
              <span className='fw-semibold text-color-black fs-5'>{firstPart}</span>
              <div className='fs-5 text-teal-normal' dangerouslySetInnerHTML={{__html: secondPart}}></div>

              <Button 
                disabled={noti.conf_id !== 'null' ? true : false}
                onClick={()=>navigate(`/detailed-information/${noti.conf_id}`)}
                className="d-flex justify-content-end bg-transparent text-teal-normal text-decoration-underline border-0 btn-noti-more"
                title='Go to detailed information page'
                >
                {
                  noti.conf_id !== 'null'
                  ?
                  `You've unfollowed this conference.`       
                  :
                  `More information >`   
                }
              </Button>
            </Row>
          )
        })
      }
    </Container>
  )
}

export default Notifications