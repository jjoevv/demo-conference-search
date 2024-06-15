import { useEffect, useState } from 'react'
import useImport from '../../hooks/useImport'
import { Button, Carousel, Form, Spinner, Table } from 'react-bootstrap'
import forcode from './../../data/forcode.json'
const ImportedDataTable = ({onHide}) => {
    const { dataUpload, setShowImportModal, handleImport } = useImport()
    const [selectedHeaders, setSelectedHeaders] = useState([]);
    const headersNames = ['None', 'Name', 'Acronym', 'Source', 'Rank', 'Field of Research', 'Location', 'Type'];
    const [activePage, setActivePage] = useState(0);
    const [warningMessage, setWarningMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(false)
    const [isImported, setIsimported] = useState(false)
    const [formatedData, setFormatedData] = useState([])    
    const [formatedHeaders, setFormatedHeaders] = useState([])
    useEffect(() => {
        setActivePage(0); // Reset active page when data changes
    }, [dataUpload]);

    const handleNext = () => {
        if (selectedHeaders.length !== 0) {
            // Filter out selected columns with a valid name (not 'None')
            const selectedCol = selectedHeaders.filter(header => header !== undefined && header.name !== 'None');


            // Process data when at least one column is selected
            const newData = dataUpload.data.map(row => {
                let newRow = [];

                selectedHeaders.forEach(header => {
                    if (header && header.name === 'Field of Research') {
                        // Lọc ra các giá trị số tương ứng với cột 'Field of Research'
                        const fieldOfResearchCodes = row.filter((value, index) => selectedHeaders.some(h => h && h.order === index && h.name === 'Field of Research'));
                        
                        // Kiểm tra các giá trị số có trong danh sách codeMappings không
                        const fieldOfResearchNames = fieldOfResearchCodes.map(code => {
                            if(code !== ''){
                                const mapping = forcode.find(mapping => mapping.code === code);
                                if (mapping) {
                                    return mapping.for;
                                } else {
                                    setWarningMessage(`Please check the selected column has '${code}'`);
                                    return ''; // hoặc giá trị khác khi không tìm thấy mapping
                                }
                            }
                            
                        });
                        //  console.log({ fieldOfResearchCodes, fieldOfResearchNames })
                        newRow.push(fieldOfResearchNames.join('; ')); // Gộp các tên thành một chuỗi và thêm vào mảng mới
                    } else {
                        // Lưu giá trị của các cột không phải 'Field of Research' và không ảnh hưởng đến các cột khác
                   //     console.log({header})
                        if (header && header.name !== 'None') {
                            newRow.push(row[header.order]);
                        }
                    }
                });

                return newRow;
            });

            const uniqueColumnNames = [...new Set(selectedCol.map(header => header.name))];
         //   console.log({newData, selectedCol})
            // Sử dụng Set để loại bỏ các hàng trùng lặp
            // Xử lý danh sách các danh sách chuỗi để loại bỏ các chuỗi trùng lặp trong từng danh sách con
            const uniqueData = newData.map(list => {
                const uniqueSet = new Set();
                list.forEach(item => {
                    const trimmedItem = item.trim(); // Loại bỏ khoảng trắng không cần thiết
                    if (trimmedItem !== "" && !uniqueSet.has(trimmedItem)) {
                        uniqueSet.add(trimmedItem);
                    }
                });
                return Array.from(uniqueSet);
            });
            // Update state with formatted headers and data
            setFormatedHeaders(Array.from(uniqueColumnNames));
            setFormatedData(uniqueData);
            // Proceed to the next page or action if needed
            if(warningMessage === ''){
                setActivePage(activePage + 1);
            }

        } else {
            // Display warning if no columns are selected
            setWarningMessage('You should select at least one column');
            setTimeout(() => {
                setWarningMessage('');
            }, 5000);
        }

    };
    const handleSelectHeader = (selectedHeader, index) => {
        const newSelectedColumns = [...selectedHeaders];
        newSelectedColumns[index] = { order: index, name: selectedHeader };
        setSelectedHeaders(newSelectedColumns);
    };
    const handleImportFile = async () => {
        setLoading(true)
        setIsimported(true)
        const res = await handleImport(formatedData, formatedHeaders)
        setStatus(res.status)
        setWarningMessage(res.message)
        setLoading(false)
       if(res.status){
        setTimeout(() => {
            setWarningMessage('');
            onHide()
        }, 3000);
       }
       setTimeout(() => {
        setWarningMessage('');
    }, 3000);
    }
    const renderTableHeader = (headersName, isSelect) => {
        return (
            <tr>
                {headersName.map((header, index) => (
                    <th key={index}>
                        {
                            isSelect ?
                                <Form.Select
                                    value={selectedHeaders[index]?.name || ''}
                                    onChange={(e) => handleSelectHeader(e.target.value, index)}
                                >
                                    <option value="" disabled>Select Header</option>
                                    {headersNames.map((name, i) => (
                                        <option
                                            key={i}
                                            value={name}
                                            disabled={selectedHeaders.some(column => column?.name === name && name !== 'Field of Research' && name !== 'None')}
                                        >
                                            {name}
                                        </option>
                                    ))}
                                </Form.Select>
                                :
                                <div>
                                    {header}
                                </div>
                        }
                    </th>
                ))}
            </tr>
        );
    };
    const renderTableBody = (tableData) => {
        // Sắp xếp các hàng dựa trên số lượng cột không rỗng
        const sortedTableData = [...tableData].sort((a, b) => {
            const nonEmptyCountA = a.filter(cell => cell !== null && cell !== undefined && cell !== '').length;
            const nonEmptyCountB = b.filter(cell => cell !== null && cell !== undefined && cell !== '').length;
            return nonEmptyCountB - nonEmptyCountA;
        });
    
        // Lấy 10 hàng đầu tiên sau khi sắp xếp
        const displayedTableData = sortedTableData.slice(0, 10);
    
        // Tìm số cột tối đa trong dữ liệu
        const maxColumns = Math.max(...displayedTableData.map(row => row.length));
    
        // Render các hàng
        return displayedTableData.map((row, rowIndex) => {
            // Tạo hàng mới với các giá trị tương ứng với thứ tự các cột đã chọn
            const renderRow = [...row];
    
            // Nếu hàng chưa đủ số lượng cột, thêm các ô trống
            while (renderRow.length < maxColumns) {
                renderRow.push('');
            }
    
    
            return (
                <tr key={rowIndex}>
                    {renderRow.map((cell, cellIndex) => (
                        <td key={`${rowIndex}-${cellIndex}`} className='text-truncate text-nowrap overflow-hidden' style={activePage === 0 ? { maxWidth: "200px" }: {}}>
                            {cell}
                        </td>
                    ))}
                </tr>
            );
        });
    };
    
    
    return (
        <div>
            <Carousel activeIndex={activePage} onSelect={() => { }} controls={false} interval={null} indicators={false}>

                <Carousel.Item key={1}>
                    <Table striped bordered hover responsive>
                        <thead>
                            {renderTableHeader(dataUpload.headers, true)}
                        </thead>
                        <tbody>
                            {renderTableBody(dataUpload.data)}
                        </tbody>
                    </Table>
                </Carousel.Item>
                <Carousel.Item key={2}>
                    <Table striped bordered hover responsive>
                        <thead>
                            {renderTableHeader(formatedHeaders, false)}
                        </thead>
                        <tbody>
                            {renderTableBody(formatedData)}
                        </tbody>
                    </Table>
                </Carousel.Item>

            </Carousel>

          <div className="d-flex w-100 justify-content-end align-items-center">
          {!isImported && warningMessage !== '' && (
                <div className="text-warning">
                    <p>{warningMessage}</p>
                </div>)
            }
            {
                isImported && status && warningMessage !== '' &&
                <div className="text-success">
                <p>{warningMessage}</p>
            </div>
            }
               {
                isImported && !status && warningMessage !== '' &&
                <div className="text-danger">
                <p>{warningMessage}</p>
            </div>
            }
            <Button 
            disable={activePage === 0 ? true : false} 
            onClick={() => setActivePage(0)} 
            className='bg-secondary text-white mx-2 px-4 border-light'
            >
                Back
            </Button>
            {
                activePage === 1 ?
                    <Button
                        className='bg-primary-normal text-white mx-2 px-4 border-light'
                        onClick={handleImportFile}>
                        {
                            loading ?
                            <Spinner size='sm'/>
                            :
                            'Import'
                        }
                    </Button>
                    :
                    <Button 
                    className='bg-primary-normal text-white mx-2 px-4 border-light'
                    onClick={handleNext}>Next</Button>
            }
          </div>
        </div>
    );
}

export default ImportedDataTable