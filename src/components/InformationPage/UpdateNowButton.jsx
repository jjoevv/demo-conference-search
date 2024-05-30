
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
const UpdateNowButton = () => {
    const handleClick = () => {
        // Thay thế URL bằng địa chỉ của trang web mà bạn muốn chuyển hướng đến
       window.location.reload()
    };

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
                className='bg-skyblue-normal rounded-5 mt-2 px-5 fw-semibold border-0 mx-2'
                onClick={handleClick}
                >
                Update Now</Button>
        </OverlayTrigger>

    );
};

export default UpdateNowButton;
