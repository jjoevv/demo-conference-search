import { useEffect, useState } from 'react'
import { Container, Button, Form, Col, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

import ChangePasswordModal from '../../components/Modals/ChangePasswordModal'

import useToken from '../../hooks/useToken'
import SuccessfulModal from '../../components/Modals/SuccessModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiamondTurnRight, faEdit, faLock } from '@fortawesome/free-solid-svg-icons'
const Account = () => {
  const { loading,user, updateProfile, getCurrentUser } = useAuth()
  const [profile, setProfile] = useState([])
  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const { token } = useToken()
  useEffect(() => {
    if (user) {
      setProfile([
        { title: "Name", infor: user.name, val: 'name', placeholder: 'username' },
        { title: "Address", infor: user.address, val: 'address', placeholder: 'your address' },
        { title: "Nationality", infor: user.nationality, val: 'nationality', placeholder: 'your nationality' },
      ])
    }
  }, [user, token])
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
    if (status) {
      setMessage(messageSuccess)
      setShowModalChangePassword(false)
      setShowModalSuccess(true)

    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = profile.reduce((acc, item) => {
      acc[item.val] = item.infor ?? '';
      return acc;
    }, {});
    // Gửi formData đến API tại đây
    const response = await updateProfile(formData)
    if (response) {
      setStatus(true)
      setMessage('Your information changed')
      getCurrentUser()
      // Đóng modal sau 3 giây
      setTimeout(() => {
        
        setMessage('')
      }, 2000);
    }
    setIsUpdated(false)
  };
  return (
    <Container className=' m-5 pt-5  overflow-x-hidden'>
      {
        user
        &&
        <>
          <div className='d-flex justify-content-between align-items-center'>
            <h4 className='mb-4'>Account</h4>
            {
              user.role === "admin" &&
              <Link to="/admin/dashboard" className='p-1 shadow-sm bg-beige-light border border-darkcyan-normal rounded text-darkcyan-normal d-flex align-items-center justify-content-center'>
                <span>{`Go to Dashboard `}</span> <FontAwesomeIcon icon={faDiamondTurnRight} className='mx-1' />
              </Link>
            }
          </div>
          <Form autoComplete='off'>
            <Form.Group as={Col} className="mb-3 mx-4 d-flex align-items-center">
              <Form.Label column sm="3">
                Email:
              </Form.Label>
              <Form.Control
                type="text"
                placeholder={user.email}
                name='email'
                onChange={handleChange}
                className='border-1 border-primary-normal w-25'
                disabled
              />
            </Form.Group>

            <Form.Group as={Col} className="mb-3 mx-4 d-flex align-items-center">
              <Form.Label column sm="3">
                Password:
              </Form.Label>
              <Form.Control
                placeholder='*********'
                type='password'
                className='rounded-2 p-1 text-center border-1 border-primary-normal w-25'
                onClick={handleOpenModal}
                title='Click to change password'
              />
            </Form.Group>
          </Form>



          <Button
          title='Click to change password'
            onClick={handleOpenModal}
            className='rounded-2 bg-red-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 mt-4'>
            <FontAwesomeIcon icon={faLock} className='me-2' />
            Change password
          </Button>

          {showModalSuccess && <SuccessfulModal message={message} show={showModalSuccess} handleClose={() => setShowModalSuccess(false)} />}
          {showModalChangePassword && <ChangePasswordModal show={showModalChangePassword} handleClose={() => setShowModalChangePassword(false)} handleShow={handleCheckStatus} />}
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
                        placeholder={item.infor !== ' ' ? item.infor : item.placeholder}
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

            <div className='d-flex align-items-center '>
              <Button
                type="submit"
                disabled={!isUpdated}
                className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-4 ms-3 '>
                <FontAwesomeIcon icon={faEdit} className='me-2' />
                {
                  loading ?
                  <Spinner size='sm'/>
                  :
                  'Update information'
                }
              </Button>
              {
                status && message !== '' && <p className="text-success mx-4">{message}</p>
              }
            </div>
          </Form>

        </>
      }
    </Container>
  )
}

export default Account