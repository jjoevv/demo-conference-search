import React, { useState, useEffect } from 'react'
import { Container, ButtonGroup, Button,  Row, Col } from 'react-bootstrap'

import InputSearch from '../../components/admin/InputSearch'
import useConference from '../../hooks/useConferences'
import { sortConferences } from '../../utils/sortConferences'
import Loading from '../../components/Loading'
import TableRender from '../../components/admin/TableRender'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import useSearch from '../../hooks/useSearch'
import { checkExistValue } from '../../utils/checkFetchedResults'
import useFilter from '../../hooks/useFilter'
import { useNavigate } from 'react-router-dom'
import useAdmin from '../../hooks/useAdmin'
const Users = () => {
  const navigate = useNavigate()
  const { optionsSelected} = useSearch()
  const {
    priorityKeywords, 
    filterConferences, 
    }= useFilter()

  const {  conferences, selectOptionSort } = useConference()
  const {loading:loadingUsers, users, getAllUsers, getUserById} = useAdmin()
  const [displayUsers, setDisplayedUsers] = useState([])

  useEffect(() => {
    if(users.length === 0 || !users){
      getAllUsers()
    }
    setDisplayedUsers(users)
  }, [users])

  useEffect(()=>{
    const isApliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    
    if(isApliedFilter){

      const filterResult = filterConferences(users, optionsSelected)
      setDisplayedUsers(filterResult)
    }
    else {
      setDisplayedUsers(users)
    }
    
  }, [optionsSelected, users, priorityKeywords])


  useEffect(() => {
    if (selectOptionSort === "Random") {
        setDisplayedUsers(conferences)
    }
    else {
        const sortedConferences = sortConferences(selectOptionSort, [...conferences])
        setDisplayedUsers(sortedConferences)
    }
}, [selectOptionSort])



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
    <Container
    fluid  className='pt-5 mt-5 px-5 ms-5  bg-light overflow-y-auto my-sidebar-content'>


      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Users management</h4>
        <ButtonGroup>
          
        </ButtonGroup>
      </div>

      <div className='p-3 bg-white rounded'>
        <span className='fw-semibold text-color-medium'>Common</span>
        <div className="pb-3 border-bottom border-primary-light">

          <Row>
            <Col>
              <label className='me-2'>Total users:</label>
              <span className='me-2 fw-semibold'>{users.length}</span>
            </Col>
        
          </Row>

        </div>

        <Row md={4} className='justify-content-end my-2 mb-3'>
          <Col><InputSearch /></Col>
        
          <Col md='auto'>
       
          </Col>
        </Row>
        
        
        {
          loadingUsers ?
          <div className="my-4">
            <Loading/>
          </div>
          :
          <TableRender data={users} columns={columns}/>
        }

      </div>
      
    </Container>
  )
}

export default Users