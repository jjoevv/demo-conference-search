//lấy dữ liệu từ danh sách để đưa vào dropdown
import { useEffect, useState } from 'react'
import useSearch from '../../hooks/useSearch'

import { capitalizeFirstLetter } from '../../utils/formatWord'
import Select, { components } from 'react-select'

import data from './options.json'
import useFilter from '../../hooks/useFilter'


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

const CustomOption = ({ innerProps, label, selectedOptions }) => (
    <div {...innerProps} className='d-flex align-items-center justify-content-start'>
        <input
            type="checkbox"
            checked={selectedOptions.includes(label)}
            onChange={() => null}
            className='ms-2 me-1'
        />
        <span
            className={`fs-6 p-2 ${selectedOptions.includes(label) ? 'text-skyblue-dark' : 'text-color-black'}`}
        >
            {capitalizeFirstLetter(label)}
        </span>
    </div>
);
const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = 1;
    const overflow = getValue()
      .slice(0, -maxToShow)
      .map((x) => x.label);
  
    return index === getValue().length - maxToShow ? (
        `+ ${overflow.length+1} option${overflow.length !== 1 ? "s" : ""} selected`
    ) : null;
  };

const Options = ({ label }) => {
    const { optionsSelected, filterOptions, getOptionsFilter, addKeywords } = useSearch()
    const [options, setOptions] = useState([])

    const handleOptionChange = async (item) => {
        addKeywords(label, [item[item.length-1].label])
    }

    useEffect(() => {
        const staticValue = ["location", "type", "category"]

        if (staticValue.includes(label)) {

            setOptions(data[label])
            getOptionsFilter(label, data[label])
        }
        else {
            let transformedOptions = []
            if (filterOptions[label]) {
                transformedOptions = filterOptions[label].map((item) => ({
                    value: item,
                    label: item,
                }));
            }
            setOptions(transformedOptions)
        }

    }, []);

    return (
        <div>
            <Select
                isMulti={true}
                options={options}
                value={optionsSelected[label].map(value => ({ value, label: value }))}
                hideSelectedOptions={false}
                isClearable={false}
                components={{ Option: props => <CustomOption {...props} selectedOptions={optionsSelected[label]} /> , MultiValue }}
                onChange={handleOptionChange}
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
