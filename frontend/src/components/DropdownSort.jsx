import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export const DropdownSort = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
  };
  return (
    <Dropdown>
      <Dropdown.Toggle className='bg-transparent border-primary-light'>
        <span className='fw-semibold'>Sort by:</span> {selectedOption || 'Random'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {
          options
          &&
          <>
            {options.map(option => (
              <Dropdown.Item key={option} onClick={() => handleSelect(option)}>
                {option}
              </Dropdown.Item>
            ))}
          </>
        }
      </Dropdown.Menu>
    </Dropdown>
  )
}
