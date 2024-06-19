import { faFile, faFileArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import usePost from '../../../hooks/usePost'
import AddConference from '../../Modals/AddConference'
import SuccessfulModal from '../../Modals/SuccessModal'
import useImport from '../../../hooks/useImport'
import ImportModalFile from './ImportModalFile'

const ModalImport = ({show, onHide}) => {
    const {showImportModal, setShowImportModal, setOptionShowImportModal} = useImport()
    const [showAddForm, setShowAddForm] = useState(false)
  const { getPostedConferences } = usePost()
  const [showSuccess, setShowSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const handleCheckStatus = (status, messageSuccess) => {
    setMessage(messageSuccess)
    if (status) {
      setShowAddForm(false);
      setShowSuccess(true)

    }
  }

  const handleClosePost = () => setShowAddForm(false);
  const handleShowPost = () => setShowAddForm(true);

  return (
    <Modal show={show}  onHide={onHide} >
    <Modal.Header closeButton className='border-0'>    
    </Modal.Header>
    <Modal.Body className='pb-5'>
    <AddConference show={showAddForm} handleClose={handleClosePost} handleCheckStatus={handleCheckStatus} onReloadList={getPostedConferences} />
      {showSuccess && <SuccessfulModal message={message} show={showSuccess} handleClosePost={() => setShowSuccess(false)} />}
      {showImportModal &&  <ImportModalFile show={showImportModal} onHide={()=>setShowImportModal(false)}/>}
      <div className="text-center text-teal-dark h4 fw-bold">
        IMPORT CONFERENCE
      </div>
      <div className="d-flex justify-content-center align-items-center p-5">
        <Button
        onClick={handleShowPost}
         className='text-center p-5 rounded border-teal-light shadow-sm bg-skyblue-light mx-3'
            style={{minWidth: "160px", minHeight: "200px"}}>
            <FontAwesomeIcon icon={faFile} className='h1 text-skyblue-dark'/>
            <div className='text-skyblue-dark'>Post a conference</div>
        </Button>
        <Button
        onClick={()=>setShowImportModal(true)}
         className='text-center p-5 rounded border-teal-light shadow-sm bg-skyblue-light mx-3'
        style={{minWidth: "160px", minHeight: "200px", maxHeight: '200px'}}>
            <FontAwesomeIcon icon={faFileArrowUp} className='h1 text-skyblue-dark'/>
            <div className='text-skyblue-dark'>Import a file of conferences</div>
        </Button>
      </div>

      <div className="text-center text-darkcyan-normal">
        Choose an option to add new conference details 
      </div>
      <div className="text-center text-darkcyan-normal">
      or import multiple conferences from a file.
      </div>
    </Modal.Body>
    </Modal>
  )
}

export default ModalImport