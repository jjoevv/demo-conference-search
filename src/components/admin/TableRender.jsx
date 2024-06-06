import React, { useState } from 'react';
import { Resizable, ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './custom_table.css';
import ReactPaginate from 'react-paginate';
import { useFlexLayout, usePagination, useResizeColumns, useSortBy, useTable } from 'react-table';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { capitalizeFirstLetter } from '../../utils/formatWord';


const TableRender = ({ data, columns }) => {
    const [pageInput, setPage]= useState(null)

    const handlePageInput = (event) => {
        event.preventDefault();
    const pageNumber = Number(pageInput) - 1;
    if (pageNumber >= 0 && pageNumber < pageCount) {
      gotoPage(pageNumber);
    }
        setPage(null);
    };



    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        nextPage,
        previousPage,
        pageCount,
        gotoPage,
        state: { pageIndex },
    } = useTable({ columns, data, initialState: { pageIndex: 0 } },
        useResizeColumns,
        useSortBy,
        usePagination, useFlexLayout);

        const renderPageNumbers = () => {
            const visiblePageNumbers = [];
            const totalPages = pageCount;
            const displayCount = 2; // Số lượng trang hiển thị ở mỗi đầu
            const ellipsisThreshold = 1; // Ngưỡng số trang lớn hơn 1 để hiển thị dấu chấm
        
            const addPageNumber = (number) => {
              visiblePageNumbers.push(
                <span
                  key={number}
                  style={{ cursor: 'pointer', marginRight: '5px', fontWeight: pageIndex === number ? 'bold' : 'normal' }}
                  onClick={() => gotoPage(number)}
                >
                  {pageIndex === number ? `[${number + 1}]` : number + 1}
                </span>
              );
            };
        
            const addEllipsis = (key) => {
              visiblePageNumbers.push(<span key={key}>...</span>);
            };
        
            // Hiển thị 2 trang đầu
            for (let i = 0; i < Math.min(2, totalPages); i++) {
              addPageNumber(i);
            }
        
            if (pageIndex > displayCount + ellipsisThreshold + 1) {
              addEllipsis('start');
            }
        
            // Hiển thị các số trang xung quanh trang hiện tại
            for (let i = Math.max(2, pageIndex - displayCount); i <= Math.min(totalPages - 3, pageIndex + displayCount); i++) {
              addPageNumber(i);
            }
        
            if (pageIndex < totalPages - displayCount - ellipsisThreshold - 2) {
              addEllipsis('end');
            }
        
            // Hiển thị 2 trang cuối
            for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
              addPageNumber(i);
            }
        
            return visiblePageNumbers;
          };
          
    return (
        <div>
            <div className="conference-table-container pt-2">
                <table className="conference-table" {...getTableProps()}>
                    <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                                    {headerGroup.headers.map((column, index) => (
                                        <th {...column.getHeaderProps()} key={column.id}
                                            className={`bg-primary-light text-color-black text-center ${index === 0 && 'fixed-column-1'}`}>
                                            {column.render('Header')}
                                            {!column.disableResizing && (
                                                <div
                                                    {...column.getResizerProps()}
                                                    className="resizer"
                                                />
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, index) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} key={row.id} className={` ${index % 2 === 0 ? 'bg-blue-light' : 'bg-white'}`}>
                                    {row.cells.map((cell, index) => {
                                        return (
                                            <td {...cell.getCellProps()} key={cell.column.id}
                                                className={`text-color-black text-start d-flex align-items-center ${index === 0 && 'fixed-column-1'}`}
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            < div className='d-flex align-items-center justify-content-end'>
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className='border-0 bg-transparent'>
          {`<`}
        </button>{' '}
            {renderPageNumbers()} 
            {`| Go to page `} 
            <input 
                type="number"
                placeholder='page'
                value={pageInput}
                onChange={(e)=>setPage(e.target.value)}
                onKeyDown={handlePageInput}
                max={pageCount}
                min={1}
            />
        <button onClick={() => nextPage()} disabled={!canNextPage} className='border-0 bg-transparent'>
          {`>`}
        </button>{' '}
      </div>
        </div>
    )
};

export default TableRender;
