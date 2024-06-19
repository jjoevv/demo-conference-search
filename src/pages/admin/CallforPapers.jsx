import { useNavigate, useParams } from "react-router-dom"
import React, { useEffect, useRef, useState } from "react"
import Loading from "../../components/Loading"
import { Button, Container } from "react-bootstrap"
import useAdmin from "../../hooks/useAdmin"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons"

import Information from "../../components/admin/Information"
import ButtonGroupActive from "../../components/admin/ButtonGroupActive"
import usePageNavigation from "../../hooks/usePageNavigation"


const CallforPapers = () => {
  const { pendingConf, getPendingConfById } = useAdmin()
  const conf_id = useParams()
  const [loadingConf, setLoadingConf] = useState(true)
  const [displayConf, setDisplayConf] = useState(null)
  const navigate = useNavigate()
  const {previousPath} = usePageNavigation()
  useEffect(() => {
    const fetchData = async () => {
      await getPendingConfById(conf_id.id)
      setLoadingConf(false)
    }
    fetchData()
  }, [conf_id])

  useEffect(()=>{
    if(pendingConf?.id === conf_id.id){
      setDisplayConf(pendingConf)
    }
  },[pendingConf])


  const tabContentRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (tabContentRef.current) {
        tabContentRef.current.style.minHeight = `${window.innerHeight - tabContentRef.current.getBoundingClientRect().top - 20}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const processText = (text) => {
    if(text){

    // Split text by \n
    const lines = text.split('\n');

    // Render lines with appropriate line breaks
    return lines.map((line, index) => {
      if (line === '' && index > 0 && lines[index - 1] === '') {
        // Ignore consecutive empty lines beyond the first two
        return null;
      }
      return (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
          {line === '' && lines[index + 1] === '' && <br />}
        </React.Fragment>
      );
    }).filter(element => element !== null);
    }

  };
  return (
    <Container className=' m-5 pt-5  overflow-x-hidden'>
 {
        loadingConf ? (
          <div className="my-4">
            <Loading />
          </div>
        ) : (
          displayConf !== null ? (
            <>
              <div className="d-flex justify-content-end">
                {
                  (previousPath && previousPath.includes('dashboard')) ?
<                 Button className='bg-teal-normal align-item my-1' onClick={() => navigate('/admin/dashboard')}>
                  <FontAwesomeIcon icon={faArrowRightToBracket} className='mx-1 rotate-180' />
                  Back to Dashboard
                </Button>
                :
                <Button className='bg-teal-normal align-item my-1' onClick={() => navigate('/admin/conferences_management')}>
                  <FontAwesomeIcon icon={faArrowRightToBracket} className='mx-1 rotate-180' />
                  Back to Conferences Management
                </Button>
                }
                
              </div>
              {
                displayConf?.information?.status && (
                  <div className="mt-4 fs-large text-success">
                    {`This conference is active now`}
                  </div>
                )
              }
              <div className="bg-skyblue-light">
                <div className='pb-5'>
                  <Information conference={displayConf} />
                  <div className='px-4 mx-4 fs-4 fw-bold mb-5'>
                  <span className='text-teal-normal'>Call for paper</span>
                    <p className="text-justify fs-medium pb-5">
                      {processText(displayConf?.callForPaper)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-between">
               <div className="">
              
              No call for paper available
            </div>
                {
                  (previousPath && previousPath.includes('dashboard')) ?
<                 Button className='bg-teal-normal align-item my-1' onClick={() => navigate('/admin/dashboard')}>
                  <FontAwesomeIcon icon={faArrowRightToBracket} className='mx-1 rotate-180' />
                  Back to Dashboard
                </Button>
                :
                <Button className='bg-teal-normal align-item my-1' onClick={() => navigate('/admin/conferences_management')}>
                  <FontAwesomeIcon icon={faArrowRightToBracket} className='mx-1 rotate-180' />
                  Back to Conferences Management
                </Button>
                }
                
              </div>
           
          )
        )
      }

      <div className="fixed-bottom mt-5 py-3 bg-darkcyan-light">
        <ButtonGroupActive conference={pendingConf}/>
      </div>
    </Container>
  )
}

export default CallforPapers