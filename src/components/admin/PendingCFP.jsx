import React, { useRef, useState } from 'react'
import TableRender from './TableRender'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import moment from 'moment'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import DeleteModal from '../Modals/DeleteModal'
import { useNavigate } from 'react-router-dom'
import usePost from '../../hooks/usePost'

const PendingCFPs = ({conferences}) => {
    const scrollPositions = useRef({});
    const [showDeleteConf, setShowDelete] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const { loading, deletePost, getPostedConferences } = usePost()
  
  const [countdown, setCountdown] = useState(3);
  const [isConfirm, setIsConfirm] = useState(false)
  const [confDel, setConfDel] = useState(null)
  const navigate = useNavigate()
  const handleChooseDelete = (conf) => {
    setConfDel(conf)
    setShowDelete(true)
  }

  const handleDeletePost = async (e) => {
    e.preventDefault();    
    setIsConfirm(true)
    const result = await deletePost(confDel.id);
    setStatus(result.status);
    setMessage(result.message);
    if (result.status) {
      getPostedConferences()
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(countdownInterval);
            handleClose();
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000); // Giảm mỗi 1 giây
    }
  }
  
  const handleClose = () => {
    setShowDelete(false);
    setStatus(null);
    setMessage('');
    setCountdown(3);
  };
  const handleChooseCfp = async (conf) => {
    // Lưu vị trí cuộn hiện tại trước khi cập nhật URL
    scrollPositions.current[window.location.pathname + window.location.search] = window.scrollY;
    // Cập nhật URL với trang mới
    const newUrl = new URL(window.location);
    window.history.pushState({}, '', newUrl);

    navigate(`/admin/dashboard/cfp/${conf.id}`)
  }


  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        Cell: ({ row }) => (
          <div className='position-sticky'>{row.index + 1}</div>
        ),
        id: 'index',
        width: 40,
        disableResizing: true
      },
      {
        Header: 'Name',
        accessor: 'information.name',
        width: 400
      },
      {
        Header: 'Acronym',
        accessor: 'information.acronym',
        width: 100,
        disableResizing: true
      },
      {
        Header: 'Source',
        accessor: 'information.source',
        width: 100,
        disableResizing: true
      },
      {
        Header: 'Rank',
        accessor: 'information.rank',
        width: 150,
        disableResizing: true
      },
      {
        Header: 'Field of Research',
        accessor: 'information.fieldOfResearch[0]',
        width: 200
      },
      {
        Header: 'Location',
        accessor: 'organizations[0].location',
        width: 200
      },
      {
        Header: 'Type',
        accessor: (row) => {
          const newOrganizations = row.organizations.filter(org => org.status === 'new');
          if (newOrganizations.length > 0) {
            return capitalizeFirstLetter(newOrganizations[0].type);
          } else {
            return ''; // Hoặc giá trị mặc định khác nếu không có tổ chức nào có status là "new"
          }
        },
        width: 100,
        disableResizing: true
      },
      // Định nghĩa cột "Conference date"
      {
        Header: 'Conference date',
        accessor: (row) => {
          const newOrganizations = row.organizations.filter(org => org.status === 'new');
          if (newOrganizations.length > 0) {
            const startDate = newOrganizations[0].start_date;
            const endDate = newOrganizations[0].end_date;
            return endDate ? `${moment(startDate).format('YYYY/MM/DD')} - ${moment(endDate).format('YYYY/MM/DD')}` : startDate;
          } else {
            return ''; // Hoặc giá trị mặc định khác nếu không có tổ chức nào có status là "new"
          }
        },
        id: 'conference_date',
        width: 200
      },

      {
        Header: 'Action',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className='fixed-column p-0 d-flex align-items-center justify-content-center'>
            <Button className='bg-transparent  p-0 mx-2 my-0 border-0 action-btn tb-icon-view  '
              onClick={() => handleChooseCfp(row.original)}
              title='View CFP'
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='text-primary-normal action-icon' />
              </Button>

            <Button className='bg-transparent border-0 p-0  my-0 action-btn tb-icon-delete ' 
            onClick={() => handleChooseDelete(row.original)}>
              <FontAwesomeIcon icon={faTrash} className='text-danger action-icon' />
            </Button>


          </div>
        ),
        disableResizing: true,
      },

    ],
    []
  );
  return (
    <div>
         {showDeleteConf &&
          <DeleteModal
            show={showDeleteConf}
            onClose={() => setShowDelete(!showDeleteConf)}
            onConfirm={handleDeletePost}
            modalTitle={'conference'}
            message={message}
            status={status}
            loading={loading}
            countdown={countdown}
            isConfirm={isConfirm}
          />}
    <TableRender data={conferences} columns={columns} />
    </div>
  )
}

export default PendingCFPs