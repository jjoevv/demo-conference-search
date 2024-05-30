import React, { useEffect, useState } from 'react'
import { Button, Form, InputGroup, Row } from 'react-bootstrap'
import Select from 'react-select'
import useSearch from '../../hooks/useSearch'
import { getUniqueConferences } from '../../utils/checkFetchedResults'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import useFilter from '../../hooks/useFilter'

// Custom Control component to hide selected values
const CustomControl = ({ children, ...props }) => {
    return (
      <div {...props}>
        {children[0]} {/* Only render the input element, not the selected values */}
      </div>
    );
  };

const Filter = () => {
    const [isFilter, setIsFilter] = useState(false)
    const {optionsFilter,
          selectOptionFilter,
          inputValue,
          handleChangeOptions, 
          handleInputFilterChange,
          searchInput,
      } = useFilter()


        useEffect(()=>{

        }, [selectOptionFilter])

        const CustomOption = ({ innerProps, label, isSelected }) => (
            <div {...innerProps} className='d-flex align-items-center text-center '>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={()=>null}
                    className='m-2'
                />
                <label 
                className={`fs-6 p-2 ${isSelected ? 'text-skyblue-dark' : 'text-color-black'}`}
                >
                    {label}
                </label>
            </div>
        );
      // Custom MenuList component to add a button at the bottom
const CustomMenuList = (props) => {
    return (
      <div>
          {props.children}
          <div className='text-center mt-3'>
            <Button className='bg-transparent text-skyblue-dark border-0' onClick={() => setIsFilter(!isFilter)}>Done</Button>
          </div>
      </div>
    );
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchInput(inputValue);
    }
  };
  const [menuIsOpen, setMenuIsOpen] = useState(true);

  return (
    <InputGroup className='mx-3 d-flex'>
                {
                    !isFilter ?
                    <Button className='bg-transparent border text-color-black' onClick={()=>setIsFilter(!isFilter)}>
                        <FontAwesomeIcon icon={faFilter} className='me-2'/>
                        More filter
                    </Button>
                    :
                <Select
                    isMulti
                    options={optionsFilter}
                    value={selectOptionFilter}
                    menuIsOpen={menuIsOpen}
                    onMenuOpen={() => setMenuIsOpen(true)} 
                    onMenuClose={() => setMenuIsOpen(false)}
                    onChange={handleChangeOptions}
                    placeholder='Filter by...'
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    controlShouldRenderValue={false}
                    components={{
                        Option: CustomOption,
                        MenuList: CustomMenuList,
                    }}
                    styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: '#b2cbcb',
                          width: 'auto', // Thiết lập chiều rộng tự động
                          minWidth: '200px',
                        }),
                      }}
                />
                }
                <Form.Control 
                    value={inputValue}
                    placeholder='Search in result...'
                    onChange={(e)=>handleInputFilterChange(e)}
                    className='border-1 border-teal-normal'
                    onKeyDown={handleKeyPress}
                />
              <Button 
              onClick={()=>searchInput(inputValue)}
              className='bg-transparent border-1 border-teal-normal'
              >
                <FontAwesomeIcon icon={faSearch} className='text-color-black'/>
              </Button>
    </InputGroup>
  )
}

export default Filter