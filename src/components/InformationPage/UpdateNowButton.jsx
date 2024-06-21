
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import usePost from '../../hooks/usePost';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useConference from '../../hooks/useConferences';
const UpdateNowButton = () => {
    const id = useParams()
    const { user } = useAuth()
    const { message: messageNoti, conference, handleGetOne, crawlNow, isCrawlingConfs, removeIDfromCrawlings } = useConference()
    const { postedConferences, getPostedConferences } = usePost()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(false)
    const [isClicked, setIsIsClicked] = useState(false)
    const [message, setMessage] = useState('')
    const [isCrawling, setIsCrawling] = useState(false)
   

    useEffect(()=>{
        const crawlingStatus = isCrawlingConfs.find(conf => conf.id === id?.id);
    
        if (crawlingStatus) {
          const currentTime = new Date().getTime();
          const elapsedTime = currentTime - crawlingStatus.timestamp;
            
          // Nếu thời gian đã vượt quá 10 phút, xóa đối tượng khỏi danh sách
          if (elapsedTime > 10 * 60 * 1000) {
            removeIDfromCrawlings(id?.id)
          } else {
            setIsCrawling(true)
          }
        }  else setIsCrawling(false)
      }, [isCrawlingConfs, id, messageNoti])

    const handleClick = async () => {
        setLoading(true);
        setIsIsClicked(true);
        let ids = sessionStorage.getItem('confIDs');
        const test = ids && ids?.includes(id?.id)
        if (!test) {
            try {

                const res = await crawlNow(conference.id);
                setStatus(res.status);
                setMessage(res.message);
                //      console.log({res})
                if (res.status) {
                    setIsIsClicked(true);
                    setLoading(false);
                    
                    setIsCrawling(true)
                } else {
                    setMessage(res.message);
                }
            } catch (error) {
                console.error('Error:', error);
                setMessage('Something went wrong. Please refresh page.');
            } 
        } else {
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
                                <Spinner as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status" 
                                    className='me-1'
                                    title='Please wait for crawling'
                                    />
                                Crawling...

                            </>

                        ) : (
                            'Update now'
                        )}
                    </>
                )}
              
            </Button>
        </OverlayTrigger>

    );
};

export default UpdateNowButton;
