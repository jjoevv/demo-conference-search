
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import usePost from '../../hooks/usePost';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useConference from '../../hooks/useConferences';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
const UpdateNowButton = () => {
    const id = useParams()
    const { user } = useAuth()
    const { message: messageNoti, conference, handleGetOne, crawlNow } = useConference()
    const { postedConferences, getPostedConferences } = usePost()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(false)
    const [isClicked, setIsIsClicked] = useState(false)
    const [message, setMessage] = useState('')
    const [isCrawling, setIsCrawling] = useState(false)
    const [showNoti, setShowCrawling] = useState(false)
    useEffect(() => {
        getPostedConferences()
    }, [id])

    useEffect(() => {
        const storedCrawling = sessionStorage.getItem('confIDs');
        if (storedCrawling) {
            const crawlingIDs = JSON.parse(storedCrawling);
            if (crawlingIDs.includes(id.id)) {
              console.log(storedCrawling); // Kiểm tra xem đối tượng đã được lưu chưa
                setIsCrawling(true)
            }
            else {
                setShowCrawling(false)
                setIsCrawling(false)
            }
            

            // Bây giờ bạn có thể sử dụng crawlingObject.confID và crawlingObject.userID như bạn cần
        }
    }, [postedConferences, loading, messageNoti])

    const handleClick = async () => {
        setLoading(true);
        setIsCrawling(true)
        setShowCrawling(true)
        setIsIsClicked(true);
        let ids = sessionStorage.getItem('confIDs');
        const test = ids && ids?.includes(id?.id)
        if(!test){
            try {
                
                const res = await crawlNow(conference.id);
                setStatus(res.status);
                setMessage(res.message);
          //      console.log({res})
                if (res.status) {
                    //  await handleGetOne(id.id);
                    setIsIsClicked(true);
    
                    setLoading(false);
                    setTimeout(() => {
                        setShowCrawling(false)
                    }, 8000);
                } else {
                    setMessage(res.message);
                }
            } catch (error) {
                console.error('Error:', error);
                setMessage('Something went wrong.');
                setShowCrawling(false)
            } finally {
                // Dừng hiển thị loading sau 5 giây
                setTimeout(() => {
                    setLoading(false);
                    setShowCrawling(false)
                }, 10000);
            }
        } else {
            setShowCrawling(true)
            setLoading(false)
            setIsCrawling(false)
        }
        
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
                className={`rounded-5 mt-2 px-5 py-3 fw-semibold border-0 mx-2 bg-danger text-white ${!status ? 'bg-danger' : 'bg-danger border-2 border-warning'}`}
                onClick={handleClick}
                disabled={loading || isCrawling} // Không cho phép nhấn nút khi đang tải
            >
                {loading ? (
                    <>
                        <Spinner size='sm' title='Wait for crawling....' />
                       
                    </>
                ) : (
                    <>
                        {isCrawling ? (
                            <>
                            Crawling...
                         
                            </>
                            
                        ) : (
                            'Update now'
                        )}
                    </>
                )}
                 {showNoti &&    
            <div>
                                <div className="popup">
                                    <span>This page will be updated soon. Please waiting for next notification.</span>
                        
                                </div>
                            </div>
                            }
            </Button>
        </OverlayTrigger>

    );
};

export default UpdateNowButton;
