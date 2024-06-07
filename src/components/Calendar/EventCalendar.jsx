import  { useState, useEffect } from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useNote from '../../hooks/useNote';
import useFollow from '../../hooks/useFollow';
import './customcalendar.css'
import ListNotesInModal from './ListNotesInModal';
import { formatDate } from '../../utils/formatDate';
import DetailInforNoteModal from './DetailInforNoteModal';
import useLocalStorage from '../../hooks/useLocalStorage';

moment.updateLocale('en', {
    week: {
        dow: 1, // Thứ hai là ngày đầu tiên trong tuần
    },
});

const localizer = momentLocalizer(moment);

function EventCalendar() {
    const {user} = useLocalStorage()
    const { notes, getAllNotes, updateNote, deleteNote } = useNote()
    const { listFollowed, getListFollowedConferences } = useFollow()

    const [showListModal, setShowListModal] = useState(false)
    const [dateClicked, setDateClicked] = useState('')
    const [existEvents, setExistEvents] = useState([]);

    //detailed modal
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [detailNote, setDetailNote] = useState(null)
    useEffect(() => {
        getAllNotes()
      }, [])
    
      useEffect(() => {
        if (!notes) {
          getAllNotes()
        }
      }, [user])


    const handleDateClick = (event) => {
        const dateEvents = notes.filter((note) => moment(note.start_date).isSame(event.start, 'day'));
        
        setExistEvents(dateEvents)
        
    };

    const handleSelectEvent = (event) => {
        const formated = formatDate(event.start_date)
        setDetailNote(event)      
        setDateClicked(formated)
        setShowDetailModal(!showDetailModal)
        
    }
    const handleSelectSlot = (slotinfo) => {        
        const formated = formatDate(slotinfo.start)
        const dateEvents = notes.filter((note) => moment(note.start_date).isSame(slotinfo.start, 'day'));
        
        setExistEvents(dateEvents)
        setDateClicked(formated)
        setShowListModal(!showListModal)
    }

    const customEventPropGetter = (event) => {
        return { className: event.subStyle };
    };

    const renderEventContent = (event) => {
        return (
            <div
                className={`event-cell text-color-black text-start mx-2 fs-7 m-0 d-flex flex-column ${event.subStyle}`}
                onClick={handleDateClick}>
                <span>{event.event.date_type}</span>
                <span className=''>{event.event.acronym}</span>
            </div>
        );
    };
    return (
        <div className="mb-3">
            <Calendar
                defaultView={Views.MONTH}
                localizer={localizer}
                events={notes}
                startAccessor="start_date"
                endAccessor="end_date"
                style={{ height: 600 }}
                eventPropGetter={customEventPropGetter}
                components={{
                    event: renderEventContent,
                }}
                popup={true}
                selectable
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
            />

            {
                showListModal &&
                <ListNotesInModal
                    show={showListModal}
                    notesList={existEvents}
                    dateClicked={dateClicked}
                    onDelete={deleteNote}
                    onClose={()=>setShowListModal(false)}
                    showDetailModal={showDetailModal}
                    setShowDetailModal={setShowDetailModal}
                    setDetailNote={setDetailNote}
                    onReloadList={getAllNotes}
                />
            }

            {
                showDetailModal &&
                <DetailInforNoteModal
                    show={showDetailModal}
                    onClose={()=>setShowDetailModal(false)}
                    note={detailNote}
                    onDelete={deleteNote}
                    onUpdate={updateNote}
                    onReloadList={getAllNotes}
                />
            }
        </div>
    );
}

export default EventCalendar;