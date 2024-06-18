
import { useAppContext } from '../context/authContext'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import usePost from './usePost'
const useImport = () => {
    const { state, dispatch } = useAppContext()
    const {postConference} = usePost()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [selectedHeaders, setSelectedHeaders] = useState([]);


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
                conf_name: "", // Tên hội nghị
                acronym: "", // Viết tắt
                callForPaper: "Not found", // Mặc định khi không có dữ liệu
                link: " ", // Liên kết
                rank: "N/I", // Mặc định cho rank
                fieldsOfResearch: [], // Mảng các lĩnh vực nghiên cứu
                organizations: [], // Mảng các tổ chức
                importantDates: [] // Mảng các ngày quan trọng
            };
    
            // Duyệt qua các tên cột và giá trị tương ứng của từng dòng
            headers.forEach((header, index) => {
                if (header) {
                    switch (header) {
                        case 'Name':
                            conference.conf_name = row[index];
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
                                conference.fieldsOfResearch = row[index].split(';').map(item => item.trim());
                            }
                            break;
                        default:
                            break;
                    }
                }
            });
    
          //  console.log("Post result:", conference);
            try {
                const result = await postConference(conference);
                if (!result.status) {
                    console.error("Post conference failed:", result.message);
                    return result; // Trả về false nếu postConference thất bại
                }
            } catch (error) {
                console.error("Error posting conference:", error);
                return {status: false, message: 'Error posting conference'}; // Trả về false nếu có lỗi trong quá trình gọi postConference
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