
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const UpdateNowButton = (path) => {
    const handleClick = () => {
        // Thay thế URL bằng địa chỉ của trang web mà bạn muốn chuyển hướng đến
       window.location.reload()
    };

    return (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id={'tooltip-bottom'} style={{ maxWidth: '420px', padding: '15px' }}>
                    <span style={{ whiteSpace: 'nowrap' }} className=''>Data updates occur every 3 days;</span>
                    <br />
                    To get the latest information, click "Update Now"
                </Tooltip>
            }
        >
            <Button 
                className='bg-skyblue-normal rounded-5 mt-2 px-5 fw-semibold border-0 mx-2'
                onClick={handleClick}
                >
                Update Now</Button>
        </OverlayTrigger>

    );
};

export default UpdateNowButton;
