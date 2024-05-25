import React, { useEffect, useMemo, useState } from 'react'
import { Container, Form, Row, Col } from 'react-bootstrap'
import useSetting from '../../hooks/useSetting'
import useLocalStorage from '../../hooks/useLocalStorage'
import Loading from '../../components/Loading'


const updateCircle = [
  { id: '1', option: "Every 3 days" },
  { id: '2', option: "Everyday" },
  { id: '3', option: "Every 5 days" },
  { id: '4', option: "Every one week" },
]
const Setting = () => {
  const { settings, loading, getAllSetting, updateSetting } = useSetting()
  const { user } = useLocalStorage()
  const [selectedOption, setSelectedOption] = useState(3);
  const [switchValue, setSwitchValue] = useState(true);
  useEffect(() => {
    const res = getAllSetting()
    if (loading === false && res) {
      const dataUpdateCycleSetting = settings.find((item) => item.name === "DATA_UPDATE_CYCLE");
      if (dataUpdateCycleSetting) {
        setSelectedOption(dataUpdateCycleSetting.value);
      }
    }

  }, [user])

  useEffect(() => {
    getAllSetting()
  }, [])

  const handleChangeSelect = (e) => {
    updateSetting(e.target.name, true, e.target.value)
    setSelectedOption(e.target.value);
  };

  const handleChangeSwitch = (e) => {
    setSwitchValue(e.target.checked);
    updateSetting(e.target.name, e.target.checked, 0)
    getAllSetting()
  };


  const updateCircleOptions = [
    { id: '1', option: "Every 3 days", value: 3 },
    { id: '2', option: "Everyday", value: 1 },
    { id: '3', option: "Every 5 days", value: 5 },
    { id: '4', option: "Every one week", value: 7 },
  ];
  const sortedSettings = useMemo(() => {
    const dataUpdateCycleSetting = settings.find(setting => setting.name === "DATA_UPDATE_CYCLE");
    const otherSettings = settings.filter(setting => setting.name !== "DATA_UPDATE_CYCLE");
    return dataUpdateCycleSetting ? [dataUpdateCycleSetting, ...otherSettings] : settings;
}, [settings]);
  return (
    <Container
      fluid
      className='pt-5 overflow-hidden' style={{ marginLeft: "350px", marginTop: "60px" }}>
      <h4 className=''>Setting</h4>
      <h6 className='text-color-darker mb-2'>How would you like to recieve notifications?</h6>


      {
        loading ?
          <div className="w-75 text-center mt-4">
            <Loading onReload={getAllSetting} />
          </div>
          :
          <>

            {settings ?
              <>
                <Form>
                  {sortedSettings.map((setting, index) => (
                    <Form.Group key={setting.tid} className="w-100 my-2 ps-3 pe-5 d-flex align-items-center justify-content-space">
                      <Form.Label column sm="6" className='pe-5 me-5'>
                        <div className='fw-bold text-color-black'>{setting.label}</div>
                        <div className="text-color-medium">{setting.describe}</div>
                      </Form.Label>
                      {index === 0 ? (
                        <div>
                          <Form.Control
                            as="select"
                            id={setting.tid}
                            value={selectedOption}
                            name={setting.name}
                            onChange={handleChangeSelect}
                            className='ms-3'
                          >
                            {updateCircleOptions.map(option => (
                              <option key={option.id} value={option.value}>{option.option}</option>
                            ))}
                          </Form.Control>
                        </div>
                      ) : (
                        <Col sm="2" className='ms-3'>
                          <Form.Check
                            type="switch"
                            id={setting.tid}
                            checked={setting.status}
                            name={setting.name}
                            className={`custom-checkbox ${setting.value ? 'checked' : ''}`}
                            
                            onChange={handleChangeSwitch}
                            
                          />
                        </Col>
                      )}
                    </Form.Group>
                  ))}
                </Form>
              </>
              :
              <p>Something wrong! Please reload page</p>
            }
          </>
      }
    </Container>
  )
}

export default Setting