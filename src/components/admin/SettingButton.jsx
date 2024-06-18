import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'

const SettingButton = () => {
  return (
    <Button className='bg-white text-color-black fw-medium d-flex align-items-center border border-0'>
    <FontAwesomeIcon icon={faGear} className='me-2' />
    Setting
  </Button>
  )
}

export default SettingButton