
import { useState } from 'react';
import { Button, Carousel, Col, Image, Row } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom/dist';
import AddNewNote from './AddNewNote';

import ArrowIcon from './../../assets/imgs/next.png'
import moment from 'moment';
const ListNotesInModal = ({ show, showDetailModal, setShowDetailModal, setDetailNote, notesList, dateClicked, onDelete, onClose, onReloadList }) => {

  const [index, setIndex] = useState(0);
  const navigate = useNavigate()

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const handleMove = () => {
    // Xác định mục sẽ chuyển đến
    const nextIndex = index === 0 ? 1 : 0;
    setIndex(nextIndex);
  };


  const handleShowDetailModal = (note) => {
    setDetailNote(note)
    setShowDetailModal(!showDetailModal)
    onClose()
  }
  return (
    <Modal show={show} onHide={onClose} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title className='text-center w-100'>{`All events in ${moment(dateClicked).format('dddd, YYYY/MM/DD')}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} controls={false} interval={null}>

          <Carousel.Item>
            <div className='d-flex justify-content-between align-items-center my-1 ms-3'>
              <p className="text-primary-normal">{`${notesList.length} notes`}</p>
              <Button className='rounded-circle border-light bg-primary-normal fw-bold' onClick={handleMove}>+</Button>
            </div>
            {
              notesList.length > 0 ?
                <>

                  {
                    notesList.map((note, index) => (
                      <div className="d-flex justify-content-between border-0 border-top" key={index}>
                        <Button
                          onClick={() => handleShowDetailModal(note)}
                          className='w-100  border-0 text-start p-1 rounded mt-1 mb-2 ms-2 px-2 text-color-darker bg-transparent'
                          title='More information about this note'
                        >
                          <Row>
                            <Col xs={2} className='text-color-medium'>{`Date type: `}</Col>
                            <Col>{note.date_type}</Col>
                          </Row>
                          <Row>
                            <Col xs={2} className='text-color-medium'>
                              {`${note.subStyle === 'note-event' ? `Your note: ` : `Conference: `}`}
                            </Col>
                            <Col>{note.note}</Col>
                          </Row>
                        </Button>
                        <Button
                          className='border-0 bg-transparent '
                          onClick={() => navigate(`/detail/information/${note.conf_id}`)}
                          title='Click here to go detailed information page'
                          disabled={note.date_type === 'Personal note' ? true : false}>
                          <Image src={ArrowIcon} width={20} className='rounded-circle border' />
                        </Button>
                      </div>
                    ))
                  }

                </>
                :
                <><p>No notes existed</p></>
            }

          </Carousel.Item>

          <Carousel.Item>
            <div>
              <AddNewNote
                dateClicked={dateClicked}
                onClose={onClose}
                onBack={handleMove}
                onReloadList={onReloadList}
              />
            </div>
          </Carousel.Item>
        </Carousel>

      </Modal.Body>
    </Modal>
  )
}

export default ListNotesInModal