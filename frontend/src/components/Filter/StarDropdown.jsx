import Reac, { useEffect, useState } from 'react'
import { Dropdown, InputGroup, Form, ButtonGroup, Button, Image } from 'react-bootstrap'

import useSearch from '../../hooks/useSearch'

import starIcon from '../../assets/imgs/star.png'
import unstarIcon from '../../assets/imgs/unstar.png'

import Select from 'react-select'
const rating = [1, 2, 3, 4, 5]
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #4EB1A4', // Điều chỉnh màu và độ dày của border khi focus
    borderRadius: '4px', // Điều chỉnh độ cong của góc
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(76, 139, 245, 0.25)' : null, // Hiệu ứng boxShadow khi focus
    '&:hover': {
      border: '2px solid #4c8bf5', // Điều chỉnh màu và độ dày của border khi hover
    },
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isFocused ? 'lightgray !important' : 'white !important',
    color: state.isFocused ? 'black !important' : 'gray !important',
    cursor: 'pointer', // Thay đổi kiểu con trỏ khi hover
  }),
};
const CustomOption = ({ innerProps, label, isSelected }) => {
  const renderStars = (numStars) => {
    const stars = [];
    for (let i = 1; i <= numStars; i++) {
      stars.push(<Image key={i} src={starIcon} width={16} className='mx-1' />);
    }
    for (let i = numStars + 1; i <= 5; i++) {
      stars.push(<Image key={i} src={unstarIcon} width={16} className='mx-1' />);
    }
    return stars;
  };

  return (
    <div {...innerProps} className='d-flex align-items-start'>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => { }}
        className='m-2'
      />
      <label style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
        {renderStars(label)}
      </label>
    </div>
  );
}

const StarDropdown = ({ label, onApply }) => {
  const { filterOptions, addKeywords, sendFilter, getQuantity } = useSearch()
  const [tranformOptions, setTranformOptions] = useState([])

  useEffect(() => {
    let transformedState = []
    if (filterOptions !== null) {
      transformedState = rating.map((item, index) => ({
        value: index + 1,
        label: item,
      }));

    }
    setTranformOptions(transformedState);
  }, []);
  const handleOptionChange = async (item) => {

    const rating = item[0].value
    const formatKeyword = `Rating from ${rating}*`
    const quantity = await sendFilter(label, rating)
    const keyword = `${formatKeyword} (${quantity})`
    addKeywords(label,[keyword] )
    let strRating = `${rating}`
    onApply(label, strRating)
  };
  return (
    <div>
      <Select
        styles={customStyles}
        isMulti={true}
        options={tranformOptions}
        value
        components={{ Option: CustomOption }}
        onChange={handleOptionChange}
        closeMenuOnSelect={true}
        placeholder="All"
      />
    </div>
  )
}

export default StarDropdown