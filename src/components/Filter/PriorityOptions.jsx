import { useEffect, useState } from "react"
import useSearch from "../../hooks/useSearch"
import { capitalizeFirstLetter } from "../../utils/formatWord"
import useFilter from "../../hooks/useFilter"
import { Button, Col, Row } from "react-bootstrap"


const PriorityOptions = () => {
    const { optionsSelected } = useSearch()
    const { resultFilter, priorityKeywords, selectedKeywords, handleKeywordSelection, countMatchingConferences, getCountForSelectedKeyword } = useFilter()
    const [selected, setSelected] = useState([])
    const [keywordsCount, setKeywordsCount] = useState([])
    
    useEffect(() => {
        const values = Object.values(priorityKeywords);
        setSelected(values);
    }, [priorityKeywords])

    useEffect(() => {
        const keywordCount = countMatchingConferences(resultFilter, optionsSelected)
        setKeywordsCount(keywordCount)
    }, [optionsSelected, resultFilter])

    const renderOption = (key, option) => {
        const quantity = getCountForSelectedKeyword(keywordsCount, option, key)
        return (
            <>
                {`${capitalizeFirstLetter(option)} (${quantity})`}
            </>
        )
    }
    return (
      <Row className="d-flex align-items-start w-100 justify-content-center">
        
      <Col sm={2} className="p-0">{Object.keys(selectedKeywords).length > 0 && `Display priority by:` } </Col>
        <Col className="d-flex flex-column w-100 p-0">
          {Object.entries(selectedKeywords).map(([key, valueList]) => (
            <Row key={key} className="w-100 align-items-start my-2">
              <Col sm={1} style={{ fontWeight: 'bold', marginRight: '10px' }}>{capitalizeFirstLetter(key)}:</Col>
              <Col className="">
                {valueList.map((option, index) => (
                  <span key={index} style={{ marginRight: '5px' }}>
                     <Button
                            key={index}
                            onClick={() => handleKeywordSelection(key, option)}
                            className={`px-2 py-1 border text-teal-normal mx-2 my-1 rounded-2 text-nowrap
                            ${selected.includes(option) ? `bg-primary-light border-primary-normal`
                                    : `bg-white border-color-medium`}`}
                        >
                            {renderOption(key, option)}
                        </Button>
                  </span>
                ))}
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
    
    

    )
}

export default PriorityOptions