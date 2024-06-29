
import { useAppContext } from '../context/authContext'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import usePost from './usePost'
import useAuth from './useAuth'
const useImport = () => {
    const { state, dispatch } = useAppContext()
    const {postConference} = usePost()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [selectedHeaders, setSelectedHeaders] = useState([]);
    const {user, setIsExpired} = useAuth()
    const {token} = useToken()

    const onDrop = (acceptedFiles) => {
        setLoading(true)
        const file = acceptedFiles[0];
        const reader = new FileReader();
        const  handleFileLoad = (fileContents) => {
            let jsonData = [];
            if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel") {
                // Xử lý file Excel
                const workbook = XLSX.read(fileContents, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            } else if (file.type === "text/csv") {
                // Xử lý file CSV
                const csvData = XLSX.utils.sheet_to_json(XLSX.read(fileContents, { type: 'binary' }).Sheets['Sheet1'], { header: 1 });
                jsonData = csvData;
            } else {
                console.error('Unsupported file type');
                return;
            }
            const maxColumns = Math.max(...jsonData.map(row => row.length));
            const headers = new Array(maxColumns).fill('');
            setData(jsonData);
            dispatch({type: "SET_DATA_UPLOAD", payload: {data: jsonData, headers: headers}})
            setFileUploaded(true); // Cập nhật trạng thái khi tệp đã được tải lên
        };

        reader.onload = (e) => {
            handleFileLoad(e.target.result);
        };

        reader.readAsArrayBuffer(file);
    };










    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ]
    });


    const [showImportModal, setShowImportModal] = useState(false)
    const [showOptionImportModal, setOptionShowImportModal] = useState(false)
    const handleImport = async (data, headers) => {
        setLoading(true);
        for (let row of data) {
            let conference = {
                title: "",
                acronym: "",
                source: "",
                rank: "",
                PrimaryFoR: []
            };
    
            // Duyệt qua các tên cột và giá trị tương ứng của từng dòng
            headers.forEach((header, index) => {
                if (header) {
                    switch (header) {
                        case 'Name':
                            conference.title = row[index];
                            break;
                        case 'Acronym':
                            conference.acronym = row[index];
                            break;
                        case 'Source':
                            conference.source = row[index] || "Not found";
                            break;
                        case 'Rank':
                            conference.rank = row[index] || " ";
                            break;
                        case 'Field of Research':
                            if (row[index]) {
                                conference.PrimaryFoR = row[index].split(';').map(item => parseInt(item.trim(), 10));
                            }
                            break;
                        default:
                            break;
                    }
                }
            });
    
          // console.log("Post result:", conference);
           if(user || localStorage.getItem('user')){
            let storedToken = JSON.parse(localStorage.getItem('token'));
            const tokenHeader = token ? token : storedToken
            if(storedToken){
            try {
              const response = await fetch(`${baseURL}/conference/file/import`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${tokenHeader}`
                },
                body: JSON.stringify( conference ),
              });
              const data = await response.json()        
              const message = data.message || data.data
              setLoading(false)
              if (!response.ok) {
                return {status: false, message}
              }
              else {
                if(response.status === 401){
                  setIsExpired(true)
                }
              }
            } catch (error) {
              throw new Error('Network response was not ok');
            }
            }
            else return {status: false, message: "Please log in again!"}
          }
        }
    
        setLoading(false);
        return {status: true, message: 'All conferences imported successfully!'};
    };
    
    return {
        showImportModal, setShowImportModal,
        showOptionImportModal, setOptionShowImportModal,
        getRootProps, getInputProps, isDragActive, onDrop,
        fileUploaded,
        dataUpload: state.dataUpload,
        loading,
        handleImport

    }
}


export default useImport