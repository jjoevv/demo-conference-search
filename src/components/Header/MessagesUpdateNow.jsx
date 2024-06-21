import React, { useEffect, useState } from 'react'
import useConference from '../../hooks/useConferences'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const MessagesUpdateNow = () => {
    const {messages} = useConference()
    const [popupheight, setPopupheight] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        const message_popup = document.getElementById('message-popup');
        setPopupheight(message_popup?.clientHeight)
    }, [messages])


    const handleNavigate = (id) => {
        navigate(`/detailed-information/${id}`)
        window.location.reload()
    }


    if (messages?.length === 0) {
        return null
    }

    return (
        <div >
            {
                messages?.map((message, index) => (
                    <div key={message?.id} id="message-popup"
                        className={`message-popup 
                            ${message?.status !== "completed" ? 'message-popup-success' : 'message-popup-failed'}`}
                        style={popupheight ? { top: `${popupheight * (index + 1)}px` } : {}}
                    >
                        <div className='message-name overflow-hidden fw-bold px-3'>
                            {`${message?.name} `}

                        </div>
                        <div className='d-inline-block'>
                            {
                                message?.status === "completed" ? 'has been updated.'
                                    :
                                    `cannot be crawled right now.`

                            }
                            {
                                message?.status === "completed" &&
                                <Button
                                    onClick={() => handleNavigate(message?.id)}
                                    className='text-decoration-underline bg-transparent border-0 p-0 ps-1'>Click to view details
                                </Button>
                            }
                        </div>



                    </div>
                ))
            }

        </div>
    )
}

export default MessagesUpdateNow