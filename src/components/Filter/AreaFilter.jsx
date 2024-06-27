import { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'

import useSearch from '../../hooks/useSearch'

import starIcon from '../../assets/imgs/star.png'
import unstarIcon from '../../assets/imgs/unstar.png'

import Select from 'react-select'
import { useTranslation } from 'react-i18next'
import useAuth from '../../hooks/useAuth'
import useAreaFilter from '../../hooks/useAreaFilter'
import useLocalStorage from '../../hooks/useLocalStorage'

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
};
const MultiValue = ({ index, getValue, ...props }) => {
  const { t, i18n } = useTranslation();
  const maxToShow = 1;
  const overflow = getValue()
    .slice(0, -maxToShow)
    .map((x) => x.label);

  return index === getValue().length - maxToShow ? (
    <div className='text-nowrap'>
      {`+ ${overflow.length + 1} ${t('option')}${overflow.length !== 0 && i18n.language === 'en' ? "s" : ""}`}
    </div>
  ) : null;
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
        {label}
      </span>
    </div>
  );
};

const AreaFilter = () => {
  const { user } = useLocalStorage()
  const { checkForCountryInText, setUserLocation, handleNavigateAccount, handleNavigateLogin } = useAreaFilter()
  const { filterOptions, optionsSelected, addKeywords, deleteKeyword, getOptionsFilter } = useSearch()
  const [options, setOptions] = useState([])
  const { t } = useTranslation()

  useEffect(() => {
    const fetchOption = async () => {
      await getOptionsFilter('region')
    }
    fetchOption()
  }, [user])

  useEffect(() => {

    let transformedState = []

    if (filterOptions['region']) {
      transformedState = filterOptions['region']
        .map((item) => ({
          value: item,
          label: item,
        }));
    }

    setOptions(transformedState);
  }, [filterOptions]);
  
  const handleOptionChange = async (items) => {
    const option = items[0].value
    const itemsValues = items.map(item => item.value);
          const removedOptions = optionsSelected['region'].map(value => ({ value, label: value })).filter(option => !itemsValues.includes(option.value));

        if (removedOptions.length <= 0) {
          const addItem = [items[items.length-1].label]
          
          if (addItem[0] === 'Local' || addItem[0] === 'National') {
            
            if (user) {
              const checkAddress = checkForCountryInText(user.address)
              const checkNationality = checkForCountryInText(user.nationality)
              const check = checkAddress || checkNationality
              
              if (check !== '') {
                setUserLocation(check)
                addKeywords('region', addItem)
              }
              else {
                handleNavigateAccount()
              }
            }
            else {
              handleNavigateLogin()
            }
            //addKeywords(label,[formatKeyword] )
          } else addKeywords('region', addItem)
            
        } 
        else {
            deleteKeyword('region', removedOptions[0].label)
        }
    

  }
    return (
      <div>
        <Select
          isMulti
          styles={customStyles}
          value={optionsSelected['region']?.map(value => ({ value, label: value }))}
          components={{ Option: props => <CustomOption {...props} selectedOptions={optionsSelected['region']} />, MultiValue }}
          options={options}
          onChange={handleOptionChange}
          closeMenuOnSelect={true}
          placeholder={t('all')}
          menuPortalTarget={document.body}
          menuPosition='fixed'
        />
      </div>
    )
  }

  export default AreaFilter