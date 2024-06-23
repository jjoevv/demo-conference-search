import { faDownload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button} from "react-bootstrap"
import useAdmin from "../../hooks/useAdmin"
import { useTranslation } from "react-i18next"

const ExportButton = ({data}) => {
  const {t} = useTranslation()
    const {exportToExcel} = useAdmin()
  return (
    <div>
        <Button 
        title="Import data to dashboard"
        onClick={()=>exportToExcel(data)}
        className="bg-white border-0 bg-white text-color-black fw-medium d-flex align-items-center border border-0">
            <FontAwesomeIcon icon={faDownload} className='me-2'/>
            {t('export_file')}
        </Button>
     
    </div>
  )
}

export default ExportButton