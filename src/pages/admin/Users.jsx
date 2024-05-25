import { useState, useEffect } from 'react'
import { Container, ButtonGroup, Button, Image, Row, Col } from 'react-bootstrap'

import InputSearch from '../../components/admin/InputSearch'
import Filter from '../../components/admin/Filter'
import SortBy from '../../components/admin/SortBy'
import useConference from '../../hooks/useConferences'
import EditIcon from '../../assets/imgs/edit.png'
import Table from '../../components/TableComponent/Table'
import TableContent from '../../components/TableComponent/TableContent'
const Users = () => {
  const [showFilter, setShowFilter] = useState(false)
  const {conferences, } = useConference()
  const [fetchCount, setFetchCount] = useState(0);
  useEffect(()=>{
    if (fetchCount < 3) {            
      //handleGetList(1, 10)
      // Tăng giá trị fetchCount sau khi fetch
      setFetchCount(fetchCount + 1);
    }
    }, [conferences, ])

  const fixedcolumns = [
    {
      Header: 'Actions', // Tiêu đề của cột đầu tiên
      accessor: 'actions', // Trường dữ liệu tương ứng (không cần thiết)
      Cell: ({ row }) => ( // Sử dụng Cell để tạo nút button
        <div>
          <button onClick={() => handleEdit(row)} className='bg-transparent border-0 p-0 mx-1'>
            <Image src={EditIcon} width={16} height={16} onClick={() => handleEdit(row)}/>
          </button>
          <button onClick={() => handleDelete(row)} className='bg-transparent border-0 p-0 mx-1'>
          <Image src={EditIcon} width={16} height={16}/>
          </button>
        </div>
      ),
    },
  {
    Header: 'Owner',
    accessor: 'owner',
  },
  {
    Header: 'Status',
    accessor: 'status',
  },
];
const headers = ["ConferenceID", "Name", "Category", "Acronym", "Source", "Rank", "Field of Research", "Location", "Type", "Conference date", "Crawl date", "Update date"];
const accessors = [ '_id',  'name',  'category',  'acronym',  'source', 'rank',  'fieldOfResearch',  'location',  'type',  'date',  'createdAt',  'updatedAt'];
const tableHeaders = [
  "Items",
  "Order #",
  "Amount",
  "Status",
  "Delivery Driver"
];
  const status = [
    { status: 'Complete', owner: 'Admin' },
    { status: 'Partial', owner: 'Admin' },
    { status: 'Approval', owner: 'User' },
    { status: 'Complete', owner: 'User' },
    { status: 'Partial', owner: 'Admin' },
    { status: 'Approval', owner: 'User' },
    { status: 'Complete', owner: 'Admin' },
    { status: 'Partial', owner: 'User' },
    { status: 'Approval', owner: 'Admin' },
    { status: 'Complete', owner: 'User' },
  ];
  
  const handleEdit = (row) => {
    // Code xử lý khi nhấn nút Edit
    alert('edit')
  };

  // Hàm xử lý khi nhấn nút Delete
  const handleDelete = (row) => {
    // Code xử lý khi nhấn nút Delete
    alert('delete')

  };
  return (
    <Container
    fluid
      className='pt-5 bg-light' style={{ paddingLeft: "350px" }}>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Users managemnet</h4>
        <ButtonGroup>
          <Button className='bg-white text-color-black fw-medium d-flex align-items-center border border-0'>
            <Image src className='p-2' />
            Export file
          </Button>
          
        </ButtonGroup>
      </div>

      <div className='p-3 bg-white rounded'>
        <span className='fw-semibold text-color-medium'>Common</span>
        <div className="pb-3 border-bottom border-primary-light">
          
            <Row>
              <Col xs={6} md={4}>
                <label className='me-2'>Total users:</label>
                <span className='me-2 fw-semibold'>2000</span>
              </Col>
              <Col xs={12} md={8}>
                <label className='me-2'>Organizers {`(Users that can post conferences)`}</label>
                <span className='me-2 fw-semibold'>2000</span>
              </Col>
            </Row>

            <Row>
              <Col>
                <label className='me-2'>Locked accounts:</label>
                <span className='me-2 fw-semibold'>2000</span>
              </Col>
              <Col></Col>
            </Row>
        </div>
      
    <Row md={4} className='justify-content-end my-2'>
        <Col><InputSearch/></Col>
        <Col md='auto'>
        <Button
          className='bg-white text-color-black rounded-1'
          onClick={()=>setShowFilter(!showFilter)}
          >
          <Image src className='me-2'/>
          Filter
        </Button>
        </Col>
        <Col md='auto'><SortBy/></Col>
      </Row>
      {showFilter && <Filter/>}
      <Table
      data={conferences}
      headers={headers}
      minCellWidth={150}
      tableContent={<TableContent data={conferences} accessors={accessors}/>}
    />   
      </div>
    </Container>
  )
}

export default Users