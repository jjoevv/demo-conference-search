import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';


function SuccessfulModal({ message, show, handleClose }) {

  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    if (show) {
      const timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);

      // Đóng modal sau 3 giây
      setTimeout(() => {
        handleClose()
        setCountdown(2); // Reset thời gian đếm ngược
      }, 2000);

      // Hủy bỏ timer khi component unmount
      return () => {
        clearInterval(timer);
      };
    }
  }, []);

  const handleCloseSuccessModal = () => {
    setCountdown(2); // Reset thời gian đếm ngược
  };

  return (
    <div>
      <Modal show={show} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton className='border-0'>
          <Modal.Title className='text-success text-center w-100'>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span className='text-success'> {message}</span>
        </Modal.Body>
        <Modal.Footer>

          {show && <p>Auto closing in {countdown} seconds</p>}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SuccessfulModal;
