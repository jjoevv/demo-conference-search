import { Stack, Form, InputGroup, Button, Image, Container, Row, Col, Spinner } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";

import DateRangePicker from "./DateRangePicker";
import AdvancedFilter from "./AdvancedFilter";

import filterIcon from '../../assets/imgs/filter.png'
import searchIcon from '../../assets/imgs/search.png'
import downIcon from '../../assets/imgs/down.png'
import FilterSelected from "./FilterSelected";
import useSearch from "../../hooks/useSearch";
import Options from "./Options";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";

const Search = ({onApply, onDelete, onClearAll, loading}) => {
  const {sendFilter, addKeywords, clearKeywords, optionsSelected} = useSearch()
  
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [searchInput, setSearchInput] = useState("")  
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(()=>{
    clearKeywords()    
    onClearAll()
  }, [pathname])


  const tooltipRef = useRef(null);
 

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleApplySearch = async () => {
    if(searchInput!==''){
      const maxRecords = await sendFilter('search', searchInput)
        const keyword = `${searchInput} (${maxRecords})`
        addKeywords("search", [keyword])
        onApply("search", searchInput)
    }
  }
  const handleEnterSearch = (e) => {
    if (e.key === 'Enter') {
      handleApplySearch();
    }
  }

  return (
    <Container className="bg-white shadow rounded-4 px-5 pb-4 mb-5">
      <div className="d-flex align-items-center mb-1 pt-3">
        <FontAwesomeIcon icon={faSearch} className="text-color-black fs-5 me-2"/>
        <h4 className="mt-2">Searching</h4>
      </div>
      <Stack>
        <span className="fw-bold text-color-black">What are you looking for?</span>
        <InputGroup className="mt-2 mb-3 border-0 w-50">
          <InputGroup.Text className="border-0 bg-blue-light pe-0">
            <Image src={searchIcon} width={20} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search for location, conference name, acronym, etc"
            className="border-0 bg-blue-light"
            type="text"
            value={searchInput}
            name="searchInput"
            onChange={handleSearchChange}
            onKeyDown={handleEnterSearch}
          />
          {/*Button Search */}
          
          <Button 
              ref={tooltipRef}
              onClick={handleApplySearch}
              className="bg-primary-light text-primary-normal fw-bold border-0"
              disabled ={ searchInput!=='' ? false : true}
              title="Click here to apply filter"
              >Search 
              </Button>

        </InputGroup>
      </Stack>

      {/*Filer dropdown */}

      <Row direction="horizontal" gap={3} className="w-100  d-flex justify-content-center">
        <Col>
          <span className="fw-bold text-color-black">Category</span>
          <Options label={"category"} onApply={onApply}/>
        </Col>
        <Col >
          <span className="fw-bold text-color-black">Location</span>
          <Options label={"location"} onApply={onApply}/>
        </Col>
        <Col>
          <span className="fw-bold text-color-black">Submission date</span>
          <DateRangePicker label={"submissionDate"} onApply={onApply}/>
        </Col>
        <Col>
          <span className="fw-bold text-color-blackcolor-black">Conference date</span>
          <DateRangePicker label={"conferenceDate"} onApply={onApply}/>
        </Col>
        
      </Row>
      <Button 
      onClick={()=>setShowAdvancedFilter(!showAdvancedFilter)}
      className="bg-white border-0 text-primary-normal p-0 fw-bold my-3">
        Show more advanced search
        <Image src={downIcon} width={15}
        className={showAdvancedFilter ? "ms-2 rotate-180" : 'ms-2'}/>
      </Button>
      
      {showAdvancedFilter && <AdvancedFilter onApply={onApply}/>}
      
     {
      loading && 
      <div className="text-center mt-4">
      <Spinner/>  
      </div>
     }
      
      {optionsSelected && <FilterSelected onDelete={onDelete} onClearAll={onClearAll}/>}  
    </Container>
  );
};

export default Search;