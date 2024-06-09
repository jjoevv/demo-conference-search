import React, { useEffect, useMemo, useState } from 'react'
import { Container, Form, Row, Col, Spinner } from 'react-bootstrap'
import useSetting from '../../hooks/useSetting'
import useLocalStorage from '../../hooks/useLocalStorage'
import Loading from '../../components/Loading'

const updateCircleOptions = [
  { id: '1', option: "Every 3 days", value: 3 },
  { id: '2', option: "Everyday", value: 1 },
  { id: '3', option: "Every 5 days", value: 5 },
  { id: '4', option: "Every one week", value: 7 },
];

const Setting = () => {
  const { settings, loading, getAllSetting, updateSetting } = useSetting()
  const [displaySetting, setDisplaySetting] = useState([])
  const { user } = useLocalStorage()
  const [selectedOption, setSelectedOption] = useState(3);
  const [switchValue, setSwitchValue] = useState(true);

  useEffect(() => {
   if(!settings){
    getAllSetting()
   }
  }, [user])

  useEffect(() => {
    getAllSetting()
  }, [])

  useEffect(()=>{
    setDisplaySetting(settings)
  },[settings])


  const handleChangeSelect = (e) => {
    updateSetting(e.target.name, true, e.target.value)
    setSelectedOption(e.target.value);
  };

  const handleChangeSwitch = async (e, tid) => {
    setSwitchValue(tid);
    const res = await updateSetting(e.target.name, e.target.checked, 0)
    getAllSetting()
  };


  const order = ["AUTO_ADD_EVENT_TO_SCHEDULE", "CHANGE_AND_UPDATE", "YOUR_UPCOMING_EVENT", "DATA_UPDATE_CYCLE", "CANCELLED_EVENT"];

  return (  
    <Container
      fluid
      className='pt-5 overflow-hidden' style={{ marginLeft: "350px", marginTop: "60px" }}>
      <h4 className=''>Setting</h4>
      <h6 className='text-color-darker mb-2'>How would you like to recieve notifications?</h6>


      {settings ?
              <>
                <Form>
                {order.map((name, index) => {
    const setting = settings[name];
    if (setting.name === 'DATA_UPDATE_CYCLE' || setting.name === 'CANCELLED_EVENT') return null;

    return (
        <Form.Group key={setting.tid} className="w-100 my-2 ps-3 pe-5 d-flex align-items-center justify-content-space">
            <Form.Label column sm="6" className='pe-5 me-5'>
                <div className='fw-bold text-color-black'>{setting.label}</div>
                <div className="text-color-medium">{setting.describe}</div>
            </Form.Label>
            <Col sm="2" className='ms-3'>
                {switchValue === setting.tid && loading ? (
                    <Spinner animation="border" size="sm" className="text-teal-normal"/>
                ) : (
                    <Form.Check
                        type="switch"
                        id={setting.tid}
                        checked={setting.status}
                        name={setting.name}
                        className={` ${setting.value ? 'checked' : ''}`}                          
                        onChange={(e)=>handleChangeSwitch(e, setting.tid)}
                    />
                )}
            </Col>
        </Form.Group>
    );
})}

                </Form>
              </>
              :
              <p>Something wrong! Please reload page</p>
            }
    </Container>
  )
}

export default Setting