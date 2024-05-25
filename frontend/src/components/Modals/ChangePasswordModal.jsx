import React, { useEffect, useState } from 'react'
import {Modal, Form, Button, Col} from 'react-bootstrap'
import useAuth from '../../hooks/useAuth';
const ChangePasswordModal = ({ show, handleClose, handleShow }) => {
    const { changePassword} = useAuth()
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(false)
    const [isMatch, setMatch] = useState(true)
    const [isClickedChange, setClickedChange] = useState(false)
  const handleChangePassword = async () => {
    
    setClickedChange(true)
    if (oldPassword === '') {
      setMessage('Please enter your password');
      setMatch(false)
    }
    else if (newPassword !== confirmNewPassword) {
      setMessage('The new password does not match the old one.');
      setMatch(false)
    } 
    else if (newPassword === oldPassword) {
      setMessage(`The new password cannot be the same as the old password.`);
      setMatch(false)
    }
    else {
      const responseData = await changePassword(oldPassword, newPassword)
      setStatus(responseData.status)
      if(responseData.status) {        
      // Thực hiện xử lý thay đổi mật khẩu ở đây
        setStatus(true)
          setMatch(true)      
          setMessage('')  
          handleShow(true, responseData.message)
        }
        else {        
        setMatch(true)      
        setMessage('')
        setStatus(false)
        setMessage(responseData.message)
      }
    }
  };


  useEffect(()=>{
    setMessage('')
  },[oldPassword, newPassword, confirmNewPassword])
  
    
    return (
      <Modal 
        show={show} 
        onHide={handleClose}
        size='lg'
        centered
        >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100 fw-bold text-color-black">Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='px-5'>
            <Form.Group as={Col} className="my-4 d-flex align-items-center">
              <Form.Label column sm="4">Current password:</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                autoComplete='off'
                className={isClickedChange && ((oldPassword === '') || !status) ? 'border border-danger' : 'border-blue-normal'}

                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} className="my-4 d-flex align-items-center">
              <Form.Label column sm="4">New password:</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                autoComplete='off'
                className='border-blue-normal'
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} className="my-4 d-flex align-items-center">
              <Form.Label column sm="4">Confirm new password:</Form.Label>
              <Form.Control
                type="password"
                value={confirmNewPassword}
                autoComplete='off'
                className={!isClickedChange && ((confirmNewPassword !== '') || !status) ? 'border-blue-normal' : 'border border-danger'}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </Form.Group>
            {message && <p className='text-danger text-center  '>{message}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            Change Password
          </Button>
        </Modal.Footer>
       
      </Modal>
    );
  };

export default ChangePasswordModal