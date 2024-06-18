import { ButtonGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import Loading from '../Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const DeleteModal = ({ show, onClose, onConfirm, modalTitle, message, status, loading, isConfirm, countdown, onModalClick }) => {
  
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Body onClick={(e) => e.stopPropagation()}>
      <div className="d-flex justify-content-between align-items-center py-2 mb-3">
          <Modal.Title className='text-center w-100 text-danger ps-5'>Delete conference</Modal.Title>
          <Button variant="secondary" onClick={onClose} className='bg-transparent border-0'>
            <FontAwesomeIcon icon={faXmark} className='text-secondary fs-3' />
          </Button>
        </div>
        <p className="fs-5 fw-bold">{`Are you sure want to delete?`}</p>
        <p>This action is permanent and cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        {
          isConfirm && status
            ?
            <>
            {status && (
              <div className = {status ? 'text-success' : 'text-danger'}>
                {status && <div>
                <span className='text-success'>{message}</span> Closing in {countdown} seconds...</div>}
              </div>
        )}
            </>
            :
            <ButtonGroup className='w-100'>
              <Button className='bg-secondary border-light me-2 rounded' onClick={onClose}>
                Cancel
              </Button>
              <Button className='bg-red-normal border-danger ms-2  rounded' onClick={onConfirm}>
                {
                  loading
                    ?
                    <Loading />
                    :
                    'Delete'
                }
              </Button>
            </ButtonGroup>

        }
      </Modal.Footer>

    </Modal>
  )
}

export default DeleteModal