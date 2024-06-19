import React, { useRef, useState } from 'react'
import TableRender from './TableRender'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import moment from 'moment'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import DeleteModal from '../Modals/DeleteModal'
import { useNavigate } from 'react-router-dom'
import usePost from '../../hooks/usePost'
import useAdmin from '../../hooks/useAdmin'

const AllUsers = ({ conferences }) => {
  const scrollPositions = useRef({});
  const [showDeleteConf, setShowDelete] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const { loading, deletePost, getPostedConferences } = usePost()
  const {users, getUserById} = useAdmin()
  const navigate = useNavigate()

  const handleChooseUser = async (id) => {
    await getUserById(id)
    navigate(`/admin/users_management/userdetail/${id}`)
  }


  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({row})=>(
          <div className='fixed-column p-0 d-flex align-items-center justify-content-center'>
          <Button className='bg-transparent  p-0 mx-2 my-0 border-0 action-btn tb-icon-view  '
            onClick={() => handleChooseUser(row.original.id)}
            title='View user'
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='text-primary-normal action-icon' />
            </Button>
        </div>
        ),
        id: 'index',
        width: 50,
        disableResizing: true
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Nationality",
        accessor: "nationality",
      },
       
    ],
    []
);
  return (
    <div>
    
      <TableRender data={users} columns={columns} />
    </div>
  )
}

export default AllUsers