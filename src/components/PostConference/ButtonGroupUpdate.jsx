import React, { useState } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import DeleteModal from '../Modals/DeleteModal'


import usePost from '../../hooks/usePost'
import ModalUpdateConf from '../UpdatePost.jsx/ModalUpdateConf'
const ButtonGroupUpdate = ({conference}) => {
    const [showUpdateConf, setShowUpdate] = useState(false)
    const [showDeleteConf, setShowDelete] = useState(false)
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState(false)
    const {loading, deletePost, getPostedConferences} = usePost()

    const [countdown, setCountdown] = useState(3);
    const [isConfirm, setIsConfirm] = useState(false)
    const handleClose = () => {
        setShowDelete(false);
        setStatus(null);
        setMessage('');
        setCountdown(3);
      };

    const handleDeletePost = async () => {
        setIsConfirm(true)
        const result = await deletePost(conference.id);
        setStatus(result.status);
        setMessage(result.message);
        if (result.status) {
          getPostedConferences()
          const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => {
              if (prevCountdown === 2) {
                clearInterval(countdownInterval);
                handleClose();
              }
              return prevCountdown - 1;
            });
          }, 3000);
        }
    }

    return (
        <>
            {showDeleteConf && 
            <DeleteModal 
            show={showDeleteConf} 
            onClose={()=>setShowDelete(!showDeleteConf)}
            onConfirm={handleDeletePost}
            modalTitle = {'conference'}
            message={message}
            status={status}
            loading={loading}
            countdown={countdown}
            isConfirm={isConfirm}
            />}

            {showUpdateConf && 
            <ModalUpdateConf 
                conference={conference}
                show={showUpdateConf}    
                onClose={()=>setShowUpdate(!showUpdateConf)}
                onUpdatePost={getPostedConferences}
            />}
            
            <ButtonGroup className='text-end'>
                <Button 
                onClick={()=>setShowUpdate(true)}
                className='bg-teal-normal border-0 rounded mx-2 px-3' >
                    Update
                </Button>
                <Button 
                    onClick={()=>setShowDelete(!showDeleteConf)}
                    className='bg-danger border-0 rounded mx-2 px-3'>
                    Delete
                </Button>
            </ButtonGroup>
        </>
    )
}

export default ButtonGroupUpdate