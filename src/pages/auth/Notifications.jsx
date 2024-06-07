import { useEffect, useState } from 'react'
import { Button, Container, Row } from 'react-bootstrap'
import useNotification from '../../hooks/useNotification'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../../hooks/useLocalStorage'
import Loading from '../../components/Loading'
import ReactPaginate from 'react-paginate'
import useConference from '../../hooks/useConferences'
const Notifications = () => {
  const { user } = useLocalStorage()
  const {handleGetOne} = useConference()
  const { loading, notifications, getAllNotifications } = useNotification()
  const [currentPage, setCurrentPage] = useState(0);
  const [notificationsPerPage] = useState(7);
  const navigate = useNavigate()

  useEffect(() => {
    getAllNotifications()
  }, [])

  useEffect(() => {
    if (!notifications) {
      getAllNotifications()
    }
  }, [user])

  const makeDateBold = (dateStr) => {
    return `<strong>${moment(dateStr).format('YYYY/MM/DD')}</strong>`;
  };
  // Tính toán index của thông báo đầu tiên và cuối cùng của mỗi trang
  const indexOfLastNotification = (currentPage + 1) * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const splitNotificationMessage = (message) => {
    const parts = message.split('. ');
    const firstPart = parts[0];
    const secondPart = parts.slice(1).join('. '); // Nối lại các phần còn lại, phòng trường hợp thông báo có nhiều hơn một dấu chấm
    const secondPartWithBoldDate = secondPart.replace(/"\d+\/\d+\/\d+"/g, makeDateBold); // In đậm ngày
    return { firstPart, secondPart: secondPartWithBoldDate };
  };


  const handleViewMore = async (id) => {
    await handleGetOne(id)
    navigate(`/detailed-information/${id}`)
  }
  return (
    <Container
      fluid
      className='pt-5  px-5' style={{ marginLeft: "350px", marginTop: "60px" }}>
      <h4 className='mb-4'>Notification</h4>
      <h5>All notifications here</h5>

      {
        loading
          ?
          <>
            <Loading onReload={getAllNotifications} />
          </>
          :
          <>
            {
              currentNotifications.map((noti, index) => {
                const { firstPart, secondPart } = splitNotificationMessage(noti.message);
                return (
                  <Row key={index} className='p-4 bg-skyblue-light rounded my-4 me-3 noti-wrapper'>
                    <span className='fw-semibold text-color-black fs-5'>{firstPart}</span>
                    <div className='fs-5 text-yellow' dangerouslySetInnerHTML={{ __html: secondPart }}></div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className='text-color-medium'>
                        {`Updated in ${moment(noti.ctime).format('YYYY/MM/DD HH:mm')}`}
                      </div>
                      <Button
                        disabled={noti.Follow.CallForPaperCfpId !== 'null' ? false : true}
                        onClick={() => handleViewMore(noti.Follow.CallForPaperCfpId)}
                        className="d-flex justify-content-end bg-transparent text-teal-normal text-decoration-underline border-0 btn-noti-more"
                        title='Go to detailed information page'
                      >
                        {
                          noti.Follow.CallForPaperCfpId !== 'null'
                            ?
                            `More details >`
                            :
                            `You've unfollowed this conference.`
                        }
                      </Button>
                    </div>
                  </Row>
                )
              })
            }

            <ReactPaginate
              pageCount={Math.ceil(notifications.length / notificationsPerPage)}
              pageRangeDisplayed={5}
              marginPagesDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName="justify-content-center pagination"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              activeClassName="active"
              disabledClassName="disabled"
              breakLabel="..."
              nextLabel=">"
              previousLabel="<"
            />
          </>
      }
    </Container>
  )
}

export default Notifications