import { Stack, Form, InputGroup, Button, Image, Container, Row, Col } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";

import DateRangePicker from "./DateRangePicker";
import AdvancedFilter from "./AdvancedFilter";

import downIcon from '../../assets/imgs/down.png'
import FilterSelected from "./FilterSelected";
import useSearch from "../../hooks/useSearch";
import Options from "./Options";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import useFilter from "../../hooks/useFilter";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const Filter = () => {
  const {loading:loadingOption, addKeywords, optionsSelected} = useSearch()
  const {loading} = useFilter()
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [showIsAvailableAdvancedFilter, setShowIsAvailableAdvancedFilter] = useState(false);
  const [searchInput, setSearchInput] = useState("")  
  const {t} = useTranslation()

  

  useEffect(() => {
    if (loading) {
      document.body.style.cursor='wait'
    } else {
      {document.body.style.cursor='default';}
    }
    return () => {
      {document.body.style.cursor='default';}
    };
}, [loading]);


  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleApplySearch = async () => {
    if(searchInput!==''){
        addKeywords("search", [searchInput])
    }
  }
  const handleEnterSearch = (e) => {
    if (e.key === 'Enter') {
      handleApplySearch();
    }
  }

  useEffect(()=>{
    if(loadingOption){
      setShowIsAvailableAdvancedFilter(false)
    }
    else setShowIsAvailableAdvancedFilter(true)
  }, [loadingOption])
  return (
    <Container className="bg-white shadow rounded-4 px-5 pb-4 mb-5">
      <div className="d-flex align-items-center mb-1 pt-3">
        <FontAwesomeIcon icon={faFilter} className="text-color-black fs-5 me-2"/>
        <h4 className="mt-2">{t('filter')}</h4>
      </div>
      
      <Stack direction="horizontal" className="align-items-center">

        <Row direction="horizontal" gap={3} className="w-100 d-flex justify-content-center">
          <Col xs={4}>
            <span className="fw-bold text-color-black">{t('what_are_you_looking_for')}</span>
            <InputGroup className=" border-0 align-items-center d-flex">
              <InputGroup.Text className="border-0 bg-blue-light">
                <FontAwesomeIcon icon={faSearch} className="fs-4"/>
              </InputGroup.Text>
              <Form.Control
                placeholder={t('search_placeholder')}
                className="border-0 bg-blue-light"
                type="text"
                value={searchInput}
                name="searchInput"
                onChange={handleSearchChange}
                onKeyDown={handleEnterSearch}
              />
              <Button 
                onClick={handleApplySearch}
                className="bg-primary-light text-primary-normal fw-bold border-0"
                disabled={searchInput !== '' ? false : true}
                title={t('apply_filter_tooltip')}
              >
                {t('search_button')}
              </Button>
            </InputGroup>
          </Col>

          <Col>
            <span className="fw-bold text-color-black">{t('location')}</span>
            <Options label="location" />
          </Col>

          <Col>
            <span className="fw-bold text-color-black">{t('submission_date')}</span>
            <DateRangePicker label="submissionDate" />
          </Col>

          <Col>
            <span className="fw-bold text-color-black">{t('conference_date')}</span>
            <DateRangePicker label="conferenceDate" />
          </Col>
        </Row>
      </Stack>
      <Button 
        disabled={!showIsAvailableAdvancedFilter}
        onClick={()=>setShowAdvancedFilter(!showAdvancedFilter)}
        className="bg-white border-0 text-primary-normal p-0 fw-bold my-3 btn-show-advanced">
          {t('show_more_advanced_search')}
        <Image src={downIcon} width={15}
        className={showAdvancedFilter ? "ms-2 rotate-180" : 'ms-2'}/>
      </Button>
      
      {showAdvancedFilter && <AdvancedFilter/>}  
      <div className="filter-selected overflow-hidden">{optionsSelected && <FilterSelected/>}  </div>

    </Container>
  );
};

export default Filter;