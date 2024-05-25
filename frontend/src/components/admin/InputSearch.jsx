import { useState } from 'react';
import { Form, InputGroup, Button, Image } from 'react-bootstrap';



function InputSearch() {
  const [keyword, setKeyword] = useState('');

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Xử lý khi nhấn phím Enter
    }
  };

  return (
    <InputGroup>
      <InputGroup.Text className='bg-transparent border-end-0'>
        <Image src/>
      </InputGroup.Text>
      <Form.Control
        className=' border-start-0'
        type="text"
        placeholder="Search keyword"
        value={keyword}
        onChange={handleInputChange}
        onKeyPress={handleEnterKeyPress}
      />
    </InputGroup>
  );
}

export default InputSearch;
