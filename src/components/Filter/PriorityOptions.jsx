import { useEffect, useState } from "react"
import useSearch from "../../hooks/useSearch"
import { capitalizeFirstLetter } from "../../utils/formatWord"
import useFilter from "../../hooks/useFilter"
import { Button } from "react-bootstrap"


const PriorityOptions = () => {
    const {optionsSelected} = useSearch()
    const {resultFilter, priorityKeywords, selectedKeywords, handleKeywordSelection, countMatchingConferences, getCountForSelectedKeyword} = useFilter()
    const [selected, setSelected] = useState([])
    const [keywordsCount, setKeywordsCount] = useState([])
    useEffect(()=>{
        const values = Object.values(priorityKeywords);
        setSelected(values);
    }, [priorityKeywords])

    useEffect(()=>{
        const keywordCount = countMatchingConferences(resultFilter, optionsSelected)
        setKeywordsCount(keywordCount)
    }, [optionsSelected, resultFilter])

    const renderOption = (key, option) => {
        const quantity = getCountForSelectedKeyword(keywordsCount, option)
        return (
            <>
            {`${capitalizeFirstLetter(key)}: ${capitalizeFirstLetter(option)} (${quantity})`} 
            </>
        )
    }
    return (
        <div className="w-100">
                <div className="d-flex align-items-start">
                {Object.keys(selectedKeywords).length > 0 && <><div className="text-nowrap my-1">Display priority by: </div></>}
                    
                    <div className=" d-flex align-items-center flex-wrap">
                        {Object.entries(selectedKeywords).map(([key, keywords]) => (
                            <>
                                {
                                    keywords.map((option, index) => (
                                        <Button 
                                            key={index} 
                                            onClick={()=>handleKeywordSelection(key, option)}
                                            className={`px-2 py-1 my-1 border text-teal-normal mx-2 rounded-2 
                                                        ${selected.includes(option) ? `bg-primary-light border-primary-normal` 
                                                        : `bg-white border-color-medium`}`}
                                            >
                                            {renderOption(key, option)}
                                        </Button>
                                    ))
                                }

                                {Object.keys(selectedKeywords).length > 1 && <>{`|`}</>}
                            </>
                        ))}
                    </div>
                </div>
        </div>
    )
}

export default PriorityOptions