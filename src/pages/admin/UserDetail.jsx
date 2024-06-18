import { faAddressCard, faArrowRightToBracket, faEnvelope, faPhone, faUser, faUserXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import useAdmin from '../../hooks/useAdmin'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../components/Loading'
import usePageNavigation from '../../hooks/usePageNavigation'



const UserDetail = () => {
  const { loading: loadingUsers, userAccount, users, getAllUsers, getUserById } = useAdmin()
  const navigate = useNavigate()
  const {previousPath} = usePageNavigation()
  const id = useParams()
  useEffect(() => {
    if(users.length === 0 || !users){
      getAllUsers()
    }
  }, [users])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchData = async () => {
      await getAllUsers(id.id);
      getUserById(id.id)

    }
    if (!userAccount || id.id !== userAccount.id || users.length === 0 || !users) {
      fetchData()
    }
  }, [id, userAccount])

  return (
    <Container className=' m-5 pt-5  overflow-x-hidden'>

      <div className="d-flex justify-content-between align-items-center mb-3 content">
        <h4>User information</h4>
      </div>
      {
        loadingUsers
          ?
          <div className="my-3">
            <Loading />
          </div>
          :
          <>
            <div className="d-flex justify-content-end">
            {
                  (previousPath && previousPath.includes('dashboard')) ?
<                 Button className='bg-teal-normal align-item' onClick={() => navigate('/admin/dashboard')}>
                  <FontAwesomeIcon icon={faArrowRightToBracket} className='mx-1 rotate-180' />
                  Back to Dashboard
                </Button>
                :
                <Button className='bg-teal-normal' onClick={()=>navigate('/admin/users_management')}>
                <FontAwesomeIcon icon={faArrowRightToBracket} className='mx-1 rotate-180'/>
                Back to Users Management
                </Button>
                }
          
          </div>
            {
              userAccount
              &&
              <>
                <Row className='m-3'>
                  <Col className='border rounded-1 p-3 m-2'>
                    <div className='d-flex align-items-center mb-2'>
                      <FontAwesomeIcon icon={faEnvelope} className='text-primary-normal me-2 fs-5' />
                      <span className='text-color-medium'>Email:</span>
                    </div>
                    <span className='ms-4 text-color-black'>{userAccount.email}</span>
                  </Col>
                  <Col className='border rounded-1 p-3 m-2'>
                    <div className='d-flex align-items-center mb-2'>
                      <FontAwesomeIcon icon={faUser} className='text-primary-normal me-2 fs-5' />
                      <span className='text-color-medium'>Username:</span>
                    </div>
                    <span className='ms-4 text-color-black'>{userAccount.name}</span>
                  </Col>
                </Row>
                <Row className='m-3'>
                  <Col className='border rounded-1 p-3 m-2'>
                    <div className='d-flex align-items-center mb-2'>
                      <FontAwesomeIcon icon={faPhone} className='text-primary-normal me-2 fs-5' />
                      Phone:
                    </div>
                    <span className='ms-4 text-color-black'>{userAccount.phone}</span>
                  </Col>
                  <Col className='border rounded-1 p-3 m-2'>
                    <div className='d-flex align-items-center mb-2'>
                      <FontAwesomeIcon icon={faAddressCard} className='text-primary-normal me-2 fs-5' />
                      Address/Nationality:
                    </div>
                    <span className='ms-4 text-color-black'>
                      {
                        userAccount.address && userAccount.nationality ?
                         `${userAccount.address} / ${userAccount.nationality}`
                        :
                        userAccount.address ? userAccount.address :
                        userAccount.nationality 

                      }
                    </span>
                  </Col>
                </Row>
              </>
            }
          </>
      }
{
  /**
   * 
   * 
   * <footer className='fixed-bottom mt-4 w-100 bg-primary-light py-3' style={{ paddingLeft: "10px" }}>
        <Button style={{ marginLeft: "320px" }} className=' bg-blue-dark'>
          <FontAwesomeIcon icon={faUserXmark} className='me-2 ' />
          Block user
        </Button>
      </footer>
   */
}
      
    </Container>
  )
}

export default UserDetail