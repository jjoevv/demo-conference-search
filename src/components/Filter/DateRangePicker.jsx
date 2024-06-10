import { useEffect, useRef, useState } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Dropdown, Image, ButtonGroup, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import useSearch from '../../hooks/useSearch';

import dateIcon from '../../assets/imgs/conf_date_light.png'
import { formatDate } from '../../utils/formatDate';
import { formatLabel } from '../../utils/formatWord';
import moment from 'moment';
const DateRangePicker = ({ label }) => {
  
  
  const today = moment().toDate();
  const endOfYear = moment().endOf('year')
  
  const { addKeywords } = useSearch()
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleToggleClick = () => {
    setShowDropdown(!showDropdown);
  };
  const handleStartDateChange = (date) => setStartDate(date);
  const handleEndDateChange = (date) => setEndDate(date);
  
  const handleApplyFilter = async () => {    
    let formatStart = moment().endOf('day').toDate()
    let formatEnd = moment().endOf('year').toDate()
    if(startDate){
      formatStart = startDate
    }
    if(endDate){
      formatEnd = endDate
    }
    
    const keywordFormat = `${formatLabel(label)}: from ${moment(formatStart).format("yyyy/MM/DD")} to ${moment(formatEnd).format("yyyy/MM/DD")}`         
    
    addKeywords(label, [keywordFormat])
    setStartDate(null)
    setEndDate(null)
    handleToggleClick()
  };
  return (
    <Dropdown ref={dropdownRef} className="w-100" show={showDropdown} onHide={() => setShowDropdown(false)}>
      <Dropdown.Toggle 
        onClick={handleToggleClick}
        className="w-100 d-flex justify-content-between align-items-center bg-white border-1 text-color-medium border-primary-normal" 
        id="dropdown-autoclose-true">
        <div className='d-flex align-items-center'>
          <Image src={dateIcon} width={18} className="me-2" />
          <span className="f5">yyyy/mm/dd</span>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className='px-2'>
        <div className="w-100 px-2 container">
          <Row>
            <Col xs={6}>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                dateFormat="yyyy/MM/dd"
                placeholderText="From"
                yearDropdownItemNumber={15}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                className='w-100'
                shouldCloseOnSelect
              />
            </Col>
            <Col xs={6}>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                dateFormat="yyyy/MM/dd"
                placeholderText="To"
                yearDropdownItemNumber={15}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                shouldCloseOnSelect
                className='w-100'
              />
            </Col>
          </Row>
        </div>
        <Dropdown.Divider />
        <ButtonGroup className='top-100 w-100 bg-white px-2 pb-2 m-2'>
          <Button
            onClick={() => setShowDropdown(false)}
            className='w-50 me-2 rounded-2 border-0 bg-secondary'>
            Cancel
          </Button>
          <Button className='w-50 rounded-2 border-0 bg-primary-normal' onClick={handleApplyFilter}>
            Apply
          </Button>
        </ButtonGroup>
      </Dropdown.Menu>
    </Dropdown>

  );
};

export default DateRangePicker;