import { useEffect, useState } from 'react'
import { Container, InputGroup, Button, Image, Form, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

import lockIcon from '../../assets/imgs/lock.png'
import editIcon from '../../assets/imgs/edit.png'
import ChangePasswordModal from '../../components/Modals/ChangePasswordModal'
import useLocalStorage from '../../hooks/useLocalStorage'
import useToken from '../../hooks/useToken'
import SuccessfulModal from '../../components/Modals/SuccessModal'
const Account = () => {
  const { updateProfile } = useAuth()
  const [profile, setProfile] = useState([])
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [message, setMessage] = useState('')
  const { user } = useLocalStorage()
  const { token } = useToken()
  useEffect(() => {
    if(user){
      setProfile([
        { title: "Name", infor: user.name, val: 'name', placeholder: 'username' },
        { title: "Phone", infor: user.phone, val: 'phone', placeholder: 'phone number' },
        { title: "Address", infor: user.address, val: 'address', placeholder: 'your address' },
        { title: "Nationality", infor: user.nationality, val: 'nationality', placeholder: 'your nationality' },
      ])
    }
  }, [user, token, ])
  //profile 
  const [isUpdated, setIsUpdated] = useState(false)

  //change password
  const [showModalChangePassword, setShowModalChangePassword] = useState(false);

  const handleOpenModal = () => setShowModalChangePassword(true);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevState) =>
      prevState.map((item) => (item.val === name ? { ...item, infor: value } : item))
    );
    setIsUpdated(true)
  };

  const handleCheckStatus = (status, messageSuccess) => {
    if(status){
      setMessage(messageSuccess)
      setShowModalChangePassword(false)
      setShowModalSuccess(true)
    
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = profile.reduce((acc, item) => {
      acc[item.val] = item.infor ?? '';
      return acc;
    }, {});
    // Gửi formData đến API tại đây
    updateProfile(formData)
    setIsUpdated(false)
  };
  return (
    <Container
      fluid
      className='pt-5' style={{ marginLeft: "350px", marginTop: "60px" }}>
      {
        user
        &&
        <>
          <div>
            <h4 className='mb-4'>Account</h4>
            {
              user.role === "admin" &&
              <Link to="/admin/dashboard">
                Go to Admin page
              </Link>
            }
          </div>
          <InputGroup className="mb-3 ms-4">
            <div className='me-5 pe-5 border-0 bg-transparent'>Email</div>
            {
              user === null
                ? <Form.Control className='border-1 w-100' />
                : <div id="basic-addon1" className='ms-5'>{user.email}</div>
            }

          </InputGroup>
          <InputGroup className="mx-3 mt-4">
            <div className='me-5 pe-5 border-0 bg-transparent'>Password</div>
            <input
              placeholder='*********'
              className='border-1 rounded-2 ms-4 p-1 text-center border-primary-normal'
              style={{ width: '200px'}}
            />
          </InputGroup>


          <Button
            onClick={handleOpenModal}
            className='rounded-2 bg-red-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
            <Image width={18} height={20} className='me-2' src={lockIcon} />
            Change password
          </Button>

          {showModalSuccess && <SuccessfulModal message={message} show={showModalSuccess} handleClose={()=>setShowModalSuccess(false)} />}
          {showModalChangePassword && <ChangePasswordModal show={showModalChangePassword} handleClose={setShowModalChangePassword} handleShow={handleCheckStatus}/>}
          <h4 className='mt-5 mb-4'>Personal Data</h4>
          <Form onSubmit={handleSubmit}>
            {
              profile.map((item, index) => (
                <div key={index}>
                  {
                    item.val !== 'license'
                    &&
                    <Form.Group as={Col} className="mb-3 mx-4 d-flex align-items-center">
                      <Form.Label column sm="3">
                        {item.title}:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={item.infor !== '' ? item.infor : item.placeholder}
                        name={item.val}
                        value={item.infor}
                        onChange={handleChange}
                        className='border-1 border-primary-normal'
                      />
                    </Form.Group>
                  }
                </div>
              ))
            }

            <Button
              type="submit"
              disabled={!isUpdated}
              className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
              <Image width={20} height={20} className='me-2' src={editIcon} />
              Update changes
            </Button>
          </Form>

        </>
      }
    </Container>
  )
}

export default Account