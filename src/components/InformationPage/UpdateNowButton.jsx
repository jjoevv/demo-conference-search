
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useConference from '../../hooks/useConferences';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
const UpdateNowButton = () => {
    const id = useParams()
    const {handleGetOne, crawlNow} = useConference()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(false)
    const [isClicked, setIsIsClicked] = useState(false)
    const [message, setMessage] = useState('')
    const handleClick = async () => {
        setLoading(true);
        setIsIsClicked(true);
        try {
            // Thực hiện công việc cần làm ở đây
            const res = await crawlNow(id.id);
            setStatus(res.status);
            console.log({ res });
            if (res.status) {
                await handleGetOne(id.id);
                setIsIsClicked(true);
            } else {
                setMessage(res.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Something went wrong.');
        } finally {
            // Dừng hiển thị loading sau 5 giây
            setTimeout(() => {
                setLoading(false);
            }, 5000);
        }
    };
    

    const handleClickTryagain = () => {
        setStatus(false)
        setIsIsClicked(false)
        setMessage(false)
    }
    return (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id={'tooltip-bottom'}>
                    {`To get the latest information, click "Update Now"`}
                </Tooltip>
            }
        >            
          <Button 
    className={`rounded-5 mt-2 px-5 fw-semibold border-0 mx-2 ${status ? 'bg-red-normal' : 'bg-danger border-2 border-warning'}`}
    onClick={handleClick}
    disabled={loading} // Không cho phép nhấn nút khi đang tải
>
    {loading ? (
        <Spinner size='sm'/>
    ) : (
        <>
            {status ? (
                <FontAwesomeIcon icon={faCheck}/>
            ) : (
                message !== '' ? (
                    'Try again'
                ) : (
                    'Update now'
                )
            )}
        </>
    )}
</Button>
        </OverlayTrigger>

    );
};

export default UpdateNowButton;
