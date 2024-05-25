//lấy dữ liệu từ danh sách để đưa vào dropdown
import React, { useEffect, useState } from 'react'
import useSearch from '../../hooks/useSearch'
import { Dropdown, Form, InputGroup, Image, ButtonGroup, Button } from 'react-bootstrap'

import searchIcon from '../../assets/imgs/search.png'
import useConference from '../../hooks/useConferences'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import Select from 'react-select'
import { useLocation } from 'react-router-dom'
const category = ["Conference", "Journal"]
const owner = ["Admin", "User"]
const customStyles = {
    container: (provided, state) => ({
        ...provided,        
        borderBottom: '1px solid #ccc',
        borderBottomColor: 'gray',
      }),
      control: (provided, state) => ({
        ...provided,
        boxShadow: state.isFocused ? '0 0 0 1px lightgray' : null,
        '&:hover': {
          
        }
      }),
    option: (provided, state) => ({
        ...provided,
        background: state.isFocused ? '#C2F1EB' : 'white',
        cursor: 'pointer',
        '&:hover': {
            background: 'lightgray', // Điều chỉnh màu nền khi hover
            color: 'black', // Điều chỉnh màu chữ khi hover
        },
    }),
};
const CustomOption = ({ innerProps, label, isSelected }) => (
    <div {...innerProps} className='d-flex align-items-start'>
        <input
            type="checkbox"
            checked={isSelected}
            onChange={() => { }}
            className='m-2'
        />
        <label style={{ fontWeight: isSelected ? 'bold' : 'normal' }} className='fs-6'>{label}</label>
    </div>
);
const DropdownOptions = ({ label, placeholder }) => {
    const { filterOptions } = useConference()
    const [tranformOptions, setTranformOptions] = useState([])
    const { addKeywords, sendFilter } = useSearch()
    const [statename, setStateName] = useState('')
    const location = useLocation();
    const pathname = location.pathname;
    useEffect(()=>{
      if(pathname === '/' || pathname === '/home'){
        setStateName('optionsSelected')
      }
      else setStateName('filterOptionsAuth')
    }, [pathname])
    const handleOptionChange = (item) => {
        const selectedValues = item.map(option => option.label);
        addKeywords(statename, label, selectedValues)
        sendFilter(label, selectedValues)
    };
    useEffect(() => {
        console.log('dropdown', {label, placeholder, filterOptions})
        let transformedState = []
        if (filterOptions !== null) {
            if (label === 'category') {
                transformedState = category.map((item, index) => ({
                    value: index + 1,
                    label: item,
                }));
            } 
            else if (label === 'owner') {
                transformedState = category.map((item, index) => ({
                    value: index + 1,
                    label: item,
                }));
            } else if (filterOptions[label]) {
                transformedState = filterOptions[label].map((item, index) => ({
                    value: index + 1,
                    label: capitalizeFirstLetter(item),
                }));
            }

        }
        setTranformOptions(transformedState);
    }, [filterOptions, label, category]);


    return (
        <div>
            <Select
                isMulti={true}                
                options={tranformOptions}
                value
                components={{ Option: CustomOption }}
                onChange={handleOptionChange}
                closeMenuOnSelect={false}
                styles={customStyles}
                placeholder={placeholder}
                
            />
        </div>

    )
}

export default DropdownOptions
