import useNote from '../../hooks/useNote'
import { isUpcoming } from '../../utils/sortConferences'
import { Card, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faLocationPin } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import useConference from '../../hooks/useConferences';

const UpcomingNote = () => {
    const {handleGetOne} = useConference()
    const { notes } = useNote()
    const checkRenderEnddate = (start, end) => {
        return end !== null && start !== null && start !== end
    }
    const daysUntilTargetDate = (targetDate) => {
        const today = new Date();
        const daysDifference = Math.floor((new Date(targetDate) - today) / (1000 * 60 * 60 * 24));
        return daysDifference;
    }
    const navigate = useNavigate()

    const handleNavigateUpcomingConference = async (id) => {
        await handleGetOne(id)
        navigate(`/detailed-information/${id}`)
    }

    const sortedNotes = [...notes].sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        return dateA - dateB;
    });

    
    return (
        <div>
            <h5 className='text-danger mt-3'>Upcoming event</h5>
            <div className='d-flex overflow-x-auto overflow-y-hidden'>

                {
                    notes &&
                    <>
                        {
                            sortedNotes.map((note) => (
                                <>
                                    {
                                        isUpcoming(note.start_date) &&

                                        <Card key={note.id} className='rounded-2 m-2' style={{ width: "200px", minWidth: "320px" }}>
                                            <Card.Body className='pb-0'>
                                                <div className='d-flex flex-column'>
                                                    <span className='fw-semibold text-teal-normal fs-6'>{`${note.date_type}`}</span>
                                                    <span className='text-truncate d-inline-block '>
                                                        {
                                                            `${note.subStyle === 'note-event' 
                                                                ? `Your note: ${note.note}` : `Conference: ${note.acronym}`} `
                                                        }
                                                    </span>
                                                </div>
                                                <p className='text-color-black m-0'>
                                                    {
                                                        note.location !== null && note.location !== '' &&

                                                        <>
                                                            <FontAwesomeIcon icon={faLocationPin} className='text-teal-normal' />
                                                            {` ${note.location}`}
                                                        </>
                                                    }

                                                </p>
                                                <div>
                                                    <p className="text-color-medium m-0">Date event:
                                                    <p>
                                                        {checkRenderEnddate(note.start_date, note.end_date) ?
                                                            <>
                                                                <div className="">
                                                                    <span className="text-color-black fw-bold">
                                                                        {moment(note.start_date).format('ddd, YYYY/MM/DD')}
                                                                    </span>
                                                                    <span>{` to `}</span>
                                                                    <span className="text-color-black fw-bold">
                                                                        {moment(note.end_date).format('ddd, YYYY/MM/DD')}
                                                                    </span>
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                                {
                                                                    note.start_date !== null
                                                                    &&
                                                                    <div className="d-flex flex-column">
                                                                        <span className="text-color-black fw-bold">
                                                                            {moment(note.start_date).format('dddd, YYYY/MM/DD')}
                                                                        </span>
                                                                    </div>
                                                                }
                                                            </>
                                                        }
                                                    </p>
                                                    </p>
                                                    

                                                </div>
                                                

                                            </Card.Body>
                                            <Card.Footer className=' bg-skyblue-light d-flex justify-content-between align-items-center'>
                                                <>
                                                    {
                                                        note.start_date !== null &&
                                                        <p className='text-darkcyan-normal fw-semibold m-0'>
                                                            <FontAwesomeIcon icon={faClock} />
                                                            {` ${daysUntilTargetDate(note.start_date)} days left`}
                                                        </p>
                                                    }
                                                </>
                                                {
                                                    note.conf_id !== null &&
                                                    <Button
                                                        onClick={() => handleNavigateUpcomingConference(note.conf_id)}
                                                        className=' bg-transparent border-0 text-decoration-underline text-skyblue-dark p-0 btn-noti-more'
                                                        title='Click here for more details'
                                                    >
                                                        {`More details >`}
                                                    </Button>
                                                }
                                            </Card.Footer>
                                        </Card>
                                    }
                                </>
                            ))
                        }
                    </>
                }
            </div>
        </div>
    )
}

export default UpcomingNote