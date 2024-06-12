import React, { useEffect, useState } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import useAdmin from '../../hooks/useAdmin'

const ButtonGroupActive = ({ conference }) => {
    const { activePost, deactivePost, getPendingConfById } = useAdmin()
    const [loadingActive, setLoadingActive] = useState(false);
    const [loadingDeactive, setLoadingDeactive] = useState(false);
    const [status, setStatus] = useState(null); // null, 'success', 'error'
    const [message, setMessage] = useState('');
    const [isApproved, setApproved] = useState(false)
    const [isRejected, setRejected] = useState(false)
    const [loadingConf, setLoadingConf] = useState(true)

    const [displayConf, setDisplayConf] = useState(null)
    useEffect(()=>{
        setDisplayConf(conference)
    }, [conference])
    useEffect(() => {
        const fetchData = async () => {
            await getPendingConfById(conference.id)
            setLoadingConf(false)
        }
        fetchData()
        setTimeout(() => {
            setMessage('');
            setStatus(false);
        }, 5000); // Hide message after 5 seconds
    }, [status]);

    const handleApprove = async () => {
        setLoadingActive(true);
        setStatus(null);

        try {
            const response = await activePost(conference.id)
            
             setLoadingActive(false);
            setStatus(response.status)
            setMessage(response.message || 'Something went wrong!')
            setApproved(true)
            setRejected(false)
        } catch (error) {
            setStatus('error');
            setMessage('Network error');
        }

    };


    const handleReject = async () => {
        setLoadingDeactive(true);
        setStatus(null);

        try {
            const response = await deactivePost(conference.id)
            setStatus(response.status)
            setStatus(response.status)
            setMessage(response.message || 'Something went wrong!')
            setRejected(true)
            setApproved(false)
        } catch (error) {
            setStatus('error');
            setMessage('Network error');
        }

        setLoadingDeactive(false);
    };
    return (
        <div className="d-flex justify-content-start align-items-center" style={{ paddingLeft: "300px" }}>
        {
            (displayConf || !loadingConf) && (
                <>
                    {
                        displayConf?.information.status ? (
                            <Button
                                onClick={handleReject}
                                className='ms-5 me-3 px-4 bg-teal-normal'
                            >
                                {isRejected ? (
                                    'Deactive'
                                ) : (
                                    <>
                                        {loadingDeactive ? (
                                            <Spinner size='sm' />
                                        ) : (
                                            <>
                                                {status && isRejected ? 'Approve' : 'Deactive'}
                                            </>
                                        )}
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleApprove}
                                className='ms-5 me-3 px-4 bg-darkcyan-normal'
                            >
                                {!isApproved ? (
                                    'Active'
                                ) : (
                                    <>
                                        {loadingActive ? (
                                            <Spinner size='sm' />
                                        ) : (
                                            <>
                                                {status && isApproved ? 'Approve' : 'Deactive'}
                                            </>
                                        )}
                                    </>
                                )}
                            </Button>
                        )
                    }
    
                    <Button
                        disabled={displayConf?.information.status}
                        className="ms-3 px-4 bg-red-normal border-ligth"
                        onClick={handleReject}
                    >
                        Reject
                    </Button>
                </>
            )
        }
        <div className='ms-5'>
            {status && isApproved && message !== '' && (
                <div className="mt-2 text-success">
                    {message}
                </div>
            )}
            {status && isRejected && message !== '' && (
                <div className="mt-2 text-danger">
                    {message}
                </div>
            )}
        </div>
    </div>
    
    )
}

export default ButtonGroupActive