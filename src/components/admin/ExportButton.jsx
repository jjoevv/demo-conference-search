import { faDownload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button} from "react-bootstrap"
import useAdmin from "../../hooks/useAdmin"

const ExportButton = ({data}) => {
    const {exportToExcel} = useAdmin()
  return (
    <div>
        <Button 
        title="Import data to dashboard"
        onClick={()=>exportToExcel(data)}
        className="bg-white border-0 bg-white text-color-black fw-medium d-flex align-items-center border border-0">
            <FontAwesomeIcon icon={faDownload} className='me-2'/>
            Export file
        </Button>
     
    </div>
  )
}

export default ExportButton