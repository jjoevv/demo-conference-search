//lấy dữ liệu từ danh sách để đưa vào dropdown
import { useEffect, useState } from 'react'
import useSearch from '../../hooks/useSearch'

import { capitalizeFirstLetter } from '../../utils/formatWord'
import Select from 'react-select'

import data from './options.json'
import countries from '../../data/countries.json'
const customStyles = {
    menuPortal: (provided) => ({
        ...provided,
        zIndex: 9999, // Đặt giá trị z-index cao để luôn nằm trên các thành phần khác
    }),
    control: (provided, state) => ({
        ...provided,
        cursor: 'pointer',
        border: '1px solid #4EB1A4', // Điều chỉnh màu và độ dày của border khi focus
        borderRadius: '4px', // Điều chỉnh độ cong của góc
        boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(76, 139, 245, 0.25)' : null, // Hiệu ứng boxShadow khi focus
        '&:hover': {
            border: '1px solid #469E92', // Điều chỉnh màu và độ dày của border khi hover
        },
    }),
    option: (provided, state) => ({
        ...provided,
        background: state.isFocused ? 'lightgray' : 'white',
        color: state.isFocused ? 'black' : 'gray',
        cursor: 'pointer',
        '&:hover': {
            background: 'lightgray', // Điều chỉnh màu nền khi hover
            color: 'black', // Điều chỉnh màu chữ khi hover
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        display: 'none'
    })
};

const CustomOption = (props) => {
    const { innerProps, label, isSelected, isFocused } = props;
    return (
        <div 
            {...innerProps} 
            className={`d-flex align-items-center justify-content-start ${isFocused ? 'custom-hover' : ''}`}
            style={{ 
                backgroundColor: isFocused ? '#eaf9f3' : isSelected ? '#bcedd8' : 'white', 
                
                cursor: 'pointer' 
            }}
        >
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => null}
                className='ms-2 me-1'
            />
            <span className={`fs-6 p-2 ${isSelected ? 'text-skyblue-dark' : 'text-color-black'}`}>
                {capitalizeFirstLetter(label)}
            </span>
        </div>
    );
};
const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = 1;
    const overflow = getValue()
      .slice(0, -maxToShow)
      .map((x) => x.label);
  
    return index === getValue().length - maxToShow ? (
        `+ ${overflow.length+1} option${overflow.length !== 0 ? "s" : ""}   `
    ) : null;
  };

const Options = ({ label }) => {
    const { optionsSelected, filterOptions, getOptionsFilter, addKeywords, deleteKeyword } = useSearch()
    const [options, setOptions] = useState([])
    const [selectedOptions, setSelectedOptions] = useState([])
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const staticValue = ["type", "category"];

    if (staticValue.includes(label)) {
        setOptions(data[label]);
        getOptionsFilter(label, data[label]);
    } else {
        let transformedOptions = [];

        if (label === 'location') {
            const transformedOptions = Object.keys(countries).map(countryCode => ({
                value: countryCode,
                label: countries[countryCode].country_name
            }));
            setOptions(transformedOptions);
        } else {
            if (filterOptions[label]) {
                transformedOptions = filterOptions[label].map((item) => ({
                    value: item,
                    label: item,
                }));
            }
            setOptions(transformedOptions);
        }
    }
    }, []);


    const handleOptionChange = async (items) => {
        setSelectedOptions(items)
        const itemsValues = items.map(item => item.value);
        const removedOptions = optionsSelected[label].map(value => ({ value, label: value })).filter(option => !itemsValues.includes(option.value));

        if (removedOptions.length <= 0) {
            addKeywords(label, [items[items.length-1].label])
        } 
        else {
            deleteKeyword(label, removedOptions[0].label)
        }
    
    }
    const filterOption = (option, searchInput) => {
        const filteredOptions = filterOptionsBySearchTerm(searchInput);
        return filteredOptions.some(filteredOption => filteredOption.value === option.value);
    };
    

    const filterOptionsBySearchTerm = (searchInput) => {
        const searchTermLower = searchInput.toLowerCase();

        const keyMatch = Object.fromEntries(
            Object.entries(countries).filter(([key, value]) => {
                return key.toLowerCase().includes(searchTermLower) || searchTermLower.includes(key.toLowerCase());
            })
        );
        const valueMatch = Object.entries(countries).filter(([key, value]) => {
            return Object.values(value).some(val => {
                if (typeof val === 'string') {
                    return val.toLowerCase().includes(searchTermLower);
                }
                return false;
            });
        }).map(([key, value]) => ({
            value: key,
            label: `${value.country_name}`,
        }));

        return valueMatch
    };
    // Hàm xử lý thay đổi khi người dùng nhập vào ô tìm kiếm
    const handleInputChange = (newValue) => {
        setSearchTerm(newValue);    
    }

    return (
        <div>
             <Select
            isMulti={true}
            options={options}
            value={optionsSelected[label].map(value => ({ value, label: value }))}
            hideSelectedOptions={false}
            isClearable={false}
            components={{ Option: props => <CustomOption {...props} selectedOptions={optionsSelected[label]} />, MultiValue }}
            onChange={handleOptionChange}
            onInputChange={label === 'location' ? handleInputChange : null}
            filterOption={label === 'location' ? filterOption : null}
            closeMenuOnSelect={true}
            styles={customStyles}
            placeholder="All"
            menuPortalTarget={document.body}
            menuPosition="fixed"
        />
        </div>

    )
}

export default Options
