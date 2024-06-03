

import { Button, Image } from 'react-bootstrap'

import deleteIcon from "../../assets/imgs/del.png";
import RedDeleteIcon from "../../assets/imgs/redDel.png";
import useSearch from "../../hooks/useSearch";
import { findKeyByKeyword, getUniqueConferences,  } from "../../utils/checkFetchedResults";

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../utils/formatWord';

const FilterSelected = () => {
  const { deleteKeyword, clearKeywords, optionsSelected, getKeyword } = useSearch()
  
  const [keywordsSelected, setKeywordsSelected] = useState(null)
  const [total, setTotal] = useState(0)
  const {pathname} = useLocation()
  useEffect(()=>{
    const uniqueValues = getUniqueConferences(optionsSelected)
    setKeywordsSelected(uniqueValues)
    setTotal(uniqueValues.length)
  }, [optionsSelected])
  
  const handleDeletekeyword = (keyword) => {
    deleteKeyword(findKeyByKeyword(optionsSelected, keyword),keyword)
  }
  const handleClearKeyword = () => {
    clearKeywords()
  }
  return (
    <>
      {
        keywordsSelected !== null && total > 0
          ?
          <div className="d-flex flex-wrap border-1 border border-light-subtle p-3 my-3 me-4 rounded-3">
            
            {keywordsSelected.map((keyword, index) => (
              <Button
                onClick={() => handleDeletekeyword(keyword)}
                key={index}
                className="fs-6 text-color-black py-1 px-2 fw-bold border bg-transparent border-secondary rounded-pill d me-3 mb-3  d-flex align-items-center ">
                { capitalizeFirstLetter(keyword)}
                 
                  <Image width={20} src={deleteIcon} alt="" className="ms-1" />
              </Button>
              ))}
            <Button
              onClick={()=>handleClearKeyword()}
              className="fs-6 py-1 px-2 fw-bold border border-danger bg-white text-red-normal rounded-pill d me-3 mb-3  d-flex align-items-center">

              Reset All
              <Image width={20} src={RedDeleteIcon} alt="" className="ms-1" />
            </Button>
          </div>
          :
          <></>

      }
    </>

  );
};

export default FilterSelected;