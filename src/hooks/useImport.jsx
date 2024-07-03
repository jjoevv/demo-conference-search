
import { useAppContext } from '../context/authContext'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import usePost from './usePost'
import useAuth from './useAuth'
import forcode from './../data/forcode.json'
const useImport = () => {
    const { state, dispatch } = useAppContext()
    const { postConference } = usePost()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [selectedHeaders, setSelectedHeaders] = useState([]);
    const { user, setIsExpired } = useAuth()
    const { token } = useToken()
    const stopRef = useRef(false);

    const onDrop = (acceptedFiles) => {
        setLoading(true)
        const file = acceptedFiles[0];
        const reader = new FileReader();
        const handleFileLoad = (fileContents) => {
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
            dispatch({ type: "SET_DATA_UPLOAD", payload: { data: jsonData, headers: headers } })
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

    const handleShowImportModal = (option) => {
        setShowImportModal(option)

    }

    const handleIsCrawling = (val) => {
        dispatch({ type: "SET_STOP_IMPORTING", payload: val });
        if(val){
            handleBufferList()
        } else {
            let updatedConferences = [...state.inProgressLoading]; // Tạo bản sao của dữ liệu ban đầu
            updatedConferences = updatedConferences.map((conf, index) => {
                if (conf.status !== 'failed' && conf.status !== 'completed') {
                    return {
                        ...conf,
                        import: 'import_success',
                        isStopping: true
                        
                    };
                }
                return conf;
            });
            dispatch({ type: "SET_IMPORT_LIST", payload: updatedConferences });

        }
    }


    const startUploading = async (data) => {
        stopRef.current = false;
        let updatedConferences = [...data]; // Tạo bản sao của dữ liệu ban đầu

        for (let i = 0; i < updatedConferences.length; i++) {
            if (stopRef.current) {
                break;
            }

            
            try {
                const response = await uploadConf(updatedConferences[i].conference);
                if (!response.message?.includes('error')) {
                    // Cập nhật trạng thái conference hiện tại thành "done" hoặc "error"
                    updatedConferences = updatedConferences.map((conf, index) => {
                        if (index === i) {
                            return {
                                ...conf,
                                import: 'import_success',
                                crawlJob: response.crawlJob,
                                
                            };
                        }
                        return conf;
                    });
                    

                    dispatch({ type: "SET_IMPORT_LIST", payload: updatedConferences });

                }
                else {

                    // Cập nhật trạng thái conference thành "error" nếu có lỗi xảy ra
                    updatedConferences = updatedConferences.map((conf, index) => {
                        if (index === i) {
                            return {
                                ...conf,
                                status: 'error',
                                import: 'import_failed',
                                progress: 0,
                                describe: '',
                                crawlJob: '',
                                error: ''
                            };
                        }
                        return conf;
                    });

                    dispatch({ type: "SET_IMPORT_LIST", payload: updatedConferences });
                }


            } catch (error) {
                console.error('Error uploading conference:', error);
                updatedConferences = updatedConferences.map((conf, index) => {
                    if (index === i) {
                        return {
                            ...conf,
                            status: 'error',
                            import: 'import_failed',
                            progress: 0,
                            describe: '',
                            crawlJob: '',
                            error: ''
                        };
                    }
                    return conf;
                });

                dispatch({ type: "SET_IMPORT_LIST", payload: updatedConferences });
            }
        }

    };


    const handleImport = async (data, headers) => {
        setLoading(true);
        const conferencesWithStatus = [];
    
        // Tạo mảng các promise từ mỗi lần lặp
        const promises = data.map(async row => {
            let conference = {
                title: "",
                acronym: "",
                source: "",
                rank: "",
                PrimaryFoR: []
            };
    
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
    
            const conferenceWithStatus = {
                conference,
                status: 'waiting',
                isStopping: false,
                import: '',
                progress: 0,
                describe: '',
                crawlJob: '',
                error: ''
            };
    
            const exists = state.inProgressLoading.some(existingConf =>
                JSON.stringify(existingConf.conference) === JSON.stringify(conference)
            );
    
            if (!exists) {
                conferencesWithStatus.push(conferenceWithStatus);
            }
        });
    
        // Chờ tất cả các promise hoàn thành
        await Promise.all(promises);
    
        await dispatch({ type: "SET_IMPORT_LIST", payload: { updatedConferences: conferencesWithStatus, isImporting: true } });
        startUploading(conferencesWithStatus);
    };
    

    const uploadConf = async (conf) => {
        let storedToken = JSON.parse(localStorage.getItem('token'));
        const tokenHeader = token ? token : storedToken
        // Giả sử đây là API call
        const response = await fetch(`${baseURL}/conference/file/import`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenHeader}`
            },
            body: JSON.stringify(conf),
        });

        return response.json();
    }

    const handleBufferList = () => {
        // Wait for 5 seconds before starting to add messages
        setTimeout(() => {
          // Add messages from buffer to main list one by one
          let index = 0;
          const interval = setInterval(() => {
            if (index < state.inBufferProgressLoading.length) {
              const message = state.inBufferProgressLoading[index];
              dispatch({ type: 'UPDATE_IMPORT_LIST', payload: message });
              index++;
            } else {
              // Clear the interval after all messages are dispatched
              clearInterval(interval);
              
              // Clear the buffer after adding all messages
              setTimeout(() => {
                dispatch({ type: 'CLEAR_BUFFER' }); // Replace 'CLEAR_BUFFER' with your actual action type
              }, 1000); // Adjust the delay as needed
            }
          }, 1000); // Add one message every second
        }, 5000); // Adjust the initial delay as needed
      };
      

    const convertCodesToNames = (codes) => {
        return codes.split(';').map(code => {
            const mapping = forcode.find(forMap => forMap.code.toString().trim() === code.trim());
            return mapping ? mapping.for : code;
        }).join('; ');
    };
    const filterConferencesByStatus = (conferences, status) => {
        return conferences.filter(conference => conference.status === status);
      };
    return {
        inProgressLoading: state.inProgressLoading,
        isImporting: state.isImporting,
        showImportModal, setShowImportModal,
        showOptionImportModal, setOptionShowImportModal,
        getRootProps, getInputProps, isDragActive, onDrop,
        fileUploaded,
        dataUpload: state.dataUpload,
        loading,
        handleImport,
        handleShowImportModal,
        convertCodesToNames,
        filterConferencesByStatus,
        handleIsCrawling,
        handleBufferList,
    }
}


export default useImport