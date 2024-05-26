import { ButtonGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import Loading from '../Loading';

const DeleteModal = ({ show, onClose, onConfirm, modalTitle, message, status, loading, isConfirm, countdown }) => {
  
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className='text-center'>
        Delete
      </Modal.Header>
      <Modal.Body>
        <p className="fs-5 fw-bold">{`Are you sure want to delete?`}</p>
        <p>This action is permanent and cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        {
          isConfirm && status
            ?
            <>
            {status && (
              <div className = {status ? 'success' : 'danger'}>
                {message}
                {status && <div>Closing in {countdown} seconds...</div>}
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