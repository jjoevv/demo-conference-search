import { useEffect, useState } from "react"
import useSearch from "../../hooks/useSearch"
import { capitalizeFirstLetter } from "../../utils/formatWord"
import useFilter from "../../hooks/useFilter"
import { Button } from "react-bootstrap"


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
        <div>
      <div className="d-flex align-items-start">
        
      <span className="me-3 mt-1">{Object.keys(selectedKeywords).length > 0 && `Display priority by:` } </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.entries(selectedKeywords).map(([key, valueList]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', marginRight: '10px' }}>{capitalizeFirstLetter(key)}:</div>
              <div>
                {valueList.map((option, index) => (
                  <span key={index} style={{ marginRight: '5px' }}>
                     <Button
                            key={index}
                            onClick={() => handleKeywordSelection(key, option)}
                            className={`px-2 py-1 border text-teal-normal mx-2 rounded-2 
                            ${selected.includes(option) ? `bg-primary-light border-primary-normal`
                                    : `bg-white border-color-medium`}`}
                        >
                            {renderOption(key, option)}
                        </Button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
    

    )
}

export default PriorityOptions