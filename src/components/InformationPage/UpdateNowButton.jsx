
import { Button, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useConference from '../../hooks/useConferences';
import { useTranslation } from 'react-i18next';
const UpdateNowButton = () => {
    const {t} = useTranslation()
    const id = useParams()
    const { message: messageNoti, conference, crawlNow, isCrawlingConfs, removeIDfromCrawlings } = useConference()
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
          {t('updateTooltip')}
        </Tooltip>
      }
    >
      <Button
        className={`rounded-5 mt-2 px-5 py-3 fw-semibold border-0 mx-2 bg-danger text-white ${!status ? 'bg-danger' : 'bg-danger border-2 border-warning'}`}
        onClick={handleClick}
        disabled={loading || isCrawling}
      >
        {loading ? (
          <Spinner size='sm' title={t('waitMessage')} />
        ) : (
          <>
            {isCrawling ? (
              <>
                <Spinner as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  className='me-1'
                  title={t('waitMessage')}
                />
                {t('waitMessage')}
              </>
            ) : (
              t('updateButton')
            )}
          </>
        )}
      </Button>
    </OverlayTrigger>

    );
};

export default UpdateNowButton;
