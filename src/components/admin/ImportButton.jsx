
import { useState } from "react"    
import { faFileImport } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button} from "react-bootstrap"
import useImport from "../../hooks/useImport"
import ImportModal from "../Modals/ImportModal"

const ImportButton = () => {
    const {showImportModal, setShowImportModal} = useImport()
  return (
    <div>
        <Button 
        title="Import data to dashboard"
        onClick={()=>setShowImportModal(true)}
        className="bg-white border-0 bg-white text-color-black fw-medium d-flex align-items-center border border-0">
            <FontAwesomeIcon icon={faFileImport} className='me-2'/>
            Import file
           
        </Button>
      {showImportModal &&  <ImportModal show={showImportModal} onHide={()=>setShowImportModal(false)}/>}
    </div>
  )
}

export default ImportButton