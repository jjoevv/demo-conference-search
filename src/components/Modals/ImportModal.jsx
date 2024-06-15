import { Button, Modal } from 'react-bootstrap'

import useImport from '../../hooks/useImport';
import ImportedDataTable from '../admin/ImportedDataTable';
const ImportModal = ({show, onHide}) => {
    const {getRootProps, getInputProps, isDragActive, fileUploaded} = useImport()
  return (
    <Modal show={show}  onHide={onHide}  dialogClassName="modal-90w modal-90h">
    <Modal.Header closeButton>
      <Modal.Title>
        {fileUploaded ? 'Columns' : 'Upload data'}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className='py-5'>
        <div className={`w-100 d-flex justify-content-center ${fileUploaded ? '' : 'my-5'}`}> 
            {
                !fileUploaded ?
                <div {...getRootProps({ className: 'dropzone' })} className='p-5 bg-teal-light rounded text-center'  style={{maxWidth: "500px", minWidth: "100px", cursor: "pointer"}}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
               <>
                <p className='fs-medium fw-bold'>Drops file here, or click to select file</p>
                <p className="text-color-medium">CSV, XLS, XLSX files accepted</p>
               </>
              )}
            </div>
            :
            <ImportedDataTable onHide={onHide}/>
            }
        </div>
    </Modal.Body>
    </Modal>
  )
}

export default ImportModal