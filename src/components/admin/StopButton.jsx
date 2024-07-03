import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import useImport from '../../hooks/useImport'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePause, faPlay } from '@fortawesome/free-solid-svg-icons'

const StopButton = () => {
    const {t} = useTranslation()
    const {isImporting, handleIsCrawling} = useImport()
  return (
    <>
      {
        isImporting ?
        <Button 
        onClick={()=>handleIsCrawling(false)}
        className="d-flex justify-content-center align-items-center px-2 py-1 bg-red-normal border-light text-nowrap">
          <FontAwesomeIcon icon={faCirclePause} className='mx-1 text-light'/>
          {t('importing')}
        </Button>
        :
        <Button 
        onClick={()=>handleIsCrawling(true)}
        className="d-flex justify-content-center align-items-center px-2 py-1 bg-red-normal border-light text-nowrap">
          <FontAwesomeIcon icon={faPlay} className='mx-1 text-light'/>
          {t('stopping')}
        </Button>
      }
      
    </>
  )
}

export default StopButton