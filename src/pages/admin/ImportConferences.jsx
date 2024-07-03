import { useEffect, useInsertionEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useImport from "../../hooks/useImport";
import { Container, OverlayTrigger, ProgressBar, Spinner, Tooltip } from "react-bootstrap";
import useScreenSize from "../../hooks/useScreenSize";
import TableRender from "../../components/admin/TableRender";
import ImportButton from "../../components/admin/ImportButton/ImportButton";
import ImportingProgressBar from "../../components/ProgressLoading/ImportingProgressBar";
import ImportingFilter from "../../components/Filter/ImportingFilter";
import StopButton from "../../components/admin/StopButton";
import CountdownTime from "../../components/Calendar/CountdownTime";
import IntendTime from "../../components/Calendar/IntendTime";

const ImportConferences = () => {
  const { t, i18n } = useTranslation()
  const { isImporting, inProgressLoading, convertCodesToNames, handleBufferList } = useImport()
  const { windowWidth } = useScreenSize()

  useEffect(() => {
   // console.log('importing...', inProgressLoading, isImporting)
  }, [inProgressLoading, isImporting, ])

  useEffect(()=>{

  }, [isImporting])
  const getStatusClass = (status) => {
    switch (status) {
      case 'waiting':
        return 'status-waiting';
      case 'crawling':
        return 'status-crawling';
      case 'done':
        return 'status-done';
      case 'failed':
        return 'status-error';
      case 'importing':
        return 'status-importing';
      case 'stopping':
        return 'status-stopping';
      default:
        return '';
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: (row, index) => index + 1,
        id: 'index',
        width: 30,
        disableResizing: true
      },
      {
        Header: t('conference'),
        id: 'title',
        width: 200,
        accessor: (row) => {
          const remainingItems = row.conference?.PrimaryFoR.map((item, index) => (
            <div key={index}>{
              convertCodesToNames(`${item}`)
            }</div>
          ));
          return (
            <div style={{ maxWidth: '100px' }}>
              <div className="text-nowrap">{`${row.conference.acronym} - ${row.conference.title}`}</div>
              <div className="text-nowrap">{`${row.conference.rank} - ${row.conference.source}`}</div>

              {
                row.conference?.PrimaryFoR.length > 0
                &&
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-for`}>
                      {
                        remainingItems
                      }
                    </Tooltip>
                  }
                >
                  <span className='text-decoration-underline mx-1' style={{ cursor: 'pointer' }}>
                    {t('field_of_research')}: +{row.conference?.PrimaryFoR.length} field
                  </span>
                </OverlayTrigger>
              }
            </div>
          );
        },
      },

      {
        Header: t('import_file'),
        id: 'import',
        disableResizing: true,
        accessor: 'import',
        Cell: ({ value }) => (
          <div className={`status-importing px-2 fs-6`}>
            {t(value)}
          </div>
        )
      },
      {
        Header: t('status'),
        accessor: 'status',
        id: 'status',
        disableResizing: true,
        Cell: ({ value }) => (
          <div className={`px-3 ${isImporting ? getStatusClass(value) : getStatusClass('stopping')}`}>
            {
              !isImporting ? `${t('stopping')}` : 
              value !== 'pending' ?
              `${t(value)}` :
              `${t('status_pending')}`

            }
          </div>
        )
      },

      {
        Header: t('progress'),
        accessor: 'progress',
        id: 'progress',
        disableResizing: true,
        Cell: ({ value }) => (
          <div className="w-100 d-flex justify-content-center align-items-center">
            {value === 0 && `${value}%`}
            <div className="w-100 mx-1">
              <ProgressBar animated striped variant="info"  label={value === 0 ? '0%' : `${value}%`} now={value} />
            </div>
          </div>
        )
      },

      {
        Header: t('describe'),
        accessor: 'describe',
        id: 'describe',
        width: 350,
        disableResizing: true
      },
      {
        Header: t('error'),
        accessor: 'error',
        id: 'error',
        minWidth: 350,
      },
    ],
    [i18n.language, inProgressLoading, isImporting]
  );


  useEffect(()=>{

  }, [])

  return (
    <Container className={` pt-5 overflow-hidden ${windowWidth > 768 ? 'm-5' : 'auth-container'}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className='fs-3'>{`${t('import_file')} ${t('conferences')}`}</h4>
        <ImportButton />
      </div>
      {
        isImporting || inProgressLoading.length > 0 ?
          <>
            {
              inProgressLoading.length > 0 ?
                <>
                  <div className="d-flex justify-content-between align-items-center">
                    <IntendTime totalConferences={inProgressLoading.length} />
                    <ImportingProgressBar />
                    <StopButton />
                  </div>

                  <div className="d-flex justify-content-center w-100 mb-2">
                    <ImportingFilter />
                  </div>

                  <div className='overflow-y-auto' >
                    <TableRender data={inProgressLoading} columns={columns} />
                  </div>

                </>
                :
                <>
                  <Spinner animation="grow" />
                </>
            }
          </> :
          <p>{t('no_progress_loading')}</p>
      }
    </Container>
  )
}

export default ImportConferences