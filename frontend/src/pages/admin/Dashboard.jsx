import { useState, useEffect } from 'react'
import { Container, ButtonGroup, Button, Image, Row, Col } from 'react-bootstrap'

import InputSearch from '../../components/admin/InputSearch'
import Filter from '../../components/admin/Filter'
import SortBy from '../../components/admin/SortBy'
import useConference from '../../hooks/useConferences'
import EditIcon from '../../assets/imgs/edit.png'
import Table from '../../components/TableComponent/Table'
import TableContent from '../../components/TableComponent/TableContent'
import { sortConferences } from '../../utils/sortConferences'
import { DropdownSort } from '../../components/DropdownSort'
const Dashboard = () => {
  const [showFilter, setShowFilter] = useState(false)
  const { conferences, handleGetList } = useConference()
  const [fetchCount, setFetchCount] = useState(0);
  const [selectedValue, setSelectedValue] = useState('');
  const [copiedConferences, setcopiedConferences] = useState([])
  const [displayConferences, setDisplayedConferences] = useState([])
  useEffect(() => {
    if (fetchCount < 3) {
      handleGetList(1, 10)
      setDisplayedConferences([...conferences])
        setcopiedConferences([...conferences])
      // Tăng giá trị fetchCount sau khi fetch
      setFetchCount(fetchCount + 1);
    }
  }, [conferences, handleGetList])

  const headers = ["ConferenceID", "Name", "Acronym", "Source", "Rank", "Field of Research", "Location", "Type", "Conference date", "Crawl date", "Update date"];
  const accessors = ['cfp_id', 'name', 'acronym', 'source', 'rank', 'fieldOfResearch', 'location', 'type', 'conf_date', 'createdAt', 'updatedAt'];
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
  const handleDropdownSelect = (value) => {
    setSelectedValue(value);
    if(value === "Random"){
        sortConferences(value, displayConferences )             
        setDisplayedConferences([...copiedConferences])
    }
    else {
        sortConferences(value, displayConferences)
    }
    
  };
  return (
    <Container
      fluid
      className='pt-5 bg-light' style={{ paddingLeft: "350px" }}>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Dashboard</h4>
        <ButtonGroup>
          <Button className='bg-white text-color-black fw-medium d-flex align-items-center border border-0'>
            <Image src className='p-2' />
            Export file
          </Button>
          <Button className='bg-white text-color-black fw-medium d-flex align-items-center border border-0'>
            <Image src className='p-2' />
            Setting
          </Button>
        </ButtonGroup>
      </div>

      <div className='p-3 bg-white rounded'>
        <span className='fw-semibold text-color-medium'>Common</span>
        <div className="pb-3 border-bottom border-primary-light">

          <Row>
            <Col>
              <label className='me-2'>Crawled web pages:</label>
              <span className='me-2 fw-semibold'>2000</span>
            </Col>
            <Col>
              <label className='me-2'>Recent data crawling time:</label>
              <span className='me-2 fw-semibold'>2000</span>
            </Col>
            <Col>
              <label className='me-2'>Data crawling cycle:</label>
              <span className='me-2 fw-semibold'>Every 3 days</span>
            </Col>
          </Row>

          <Row>
            <Col>
              <label className='me-2'>Crawled conferences:</label>
              <span className='me-2 fw-semibold'>2000</span>
            </Col>
            <Col>
              <label className='me-2'>Success rate of the crawl process:</label>
              <span className='me-2 fw-semibold'>2000</span>
            </Col>
            <Col></Col>
          </Row>
        </div>

        <Row md={4} className='justify-content-end my-2'>
          <Col><InputSearch /></Col>
          <Col md='auto'>
            <Button
              className='bg-white text-color-black rounded-1'
              onClick={() => setShowFilter(!showFilter)}
            >
              <Image src className='me-2' />
              Filter
            </Button>
          </Col>
          <Col md='auto'>
          <DropdownSort
        options={["Random", "Upcoming", "Name A->Z", "Latest"]}
        onSelect={handleDropdownSelect}
    />
          </Col>
        </Row>
        {showFilter && <Filter />}
        <Table
          data={displayConferences}
          headers={headers}
          minCellWidth={150}
          scroll={true}
          tableContent={<TableContent data={displayConferences} accessors={accessors} />}
        />
      </div>
    </Container>
  )
}

export default Dashboard