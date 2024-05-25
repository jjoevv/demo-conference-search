import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Image, Modal, Carousel, CarouselItem, Row, OverlayTrigger, Tooltip, Accordion } from 'react-bootstrap'
import AddButtonIcon from './../../assets/imgs/edit.png'
import ChooseFORs from '../PostConference/ChooseFORs';
import usePost from '../../hooks/usePost';
import data from '../../components/Filter/options.json'
import useAccordionDates from '../../hooks/useAccordionDates';
import SuccessfulModal from './SuccessModal';
import LocationInput from '../PostConference/LocationInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import useSearch from '../../hooks/useSearch';
import Loading from '../Loading';

const AddConference = ({ show, handleClose, handleCheckStatus, onReloadList }) => {
    const { loading, postConference, getPostedConferences } = usePost()
    const { filterOptions, getOptionsFilter } = useSearch()
    const { items, dateListByRound, mergeDatesByRound, addDateToRound, addItem, deleteItem } = useAccordionDates()
    const [page, setPage] = useState(0)
    const [isPosted, setIsPosted] = useState(false)
    const [error, setError] = useState(false)


    const [message, setMesage] = useState('')
    const [status, setStatus] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [activeAccordionKey, setActiveAccordionKey] = useState([]);


    useEffect(() => {
        if (!filterOptions['rank']) {
            getOptionsFilter('', [])
        }
    }, [filterOptions])

    const [formData, setFormData] = useState({
        conf_name: '',
        acronym: '',
        callForPaper: '',
        link: '',
        rank: '',
        fieldsOfResearch: [],
        organizations: [{
            name: '',
            start_date: '',
            end_date: '',
            type: '',
            location: '',
        }],
        importantDates: [{ date_value: '', date_type: '' }],
    });

    const [requiredFields, setRequiredFields] = useState({
        conf_name: true,
        acronym: true,
        callForPaper: true,
        link: true,
        fieldsOfResearch: true,

    });


    const [invalidDates, setInvalidDates] = useState([]);

    const handleAddDate = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            importantDates: [...prevFormData.importantDates, { date_value: '', date_type: '' }]
        }));
    };

    const handleRemoveDate = (index) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            importantDates: prevFormData.importantDates.filter((_, i) => i !== index)
        }));
    };

    const handleDateChange = (e, index, field) => {
        const { value } = e.target;
        const updatedDates = formData.importantDates.map((date, i) =>
            i === index ? { ...date, [field]: value } : date
        );
        setFormData(prevFormData => ({
            ...prevFormData,
            importantDates: updatedDates
        }));
    };

    const [selectedfieldsOfResearch, setSelectedfieldsOfResearch] = useState([]);

    const isEndDateValid = (startDate, endDate) => {
        return new Date(startDate) <= new Date(endDate);
    };
    const handleOrgChange = (index, field, value) => {
        const updatedOrgs = [...formData.organizations];
        const org = { ...updatedOrgs[index] };

        // Kiểm tra nếu field là 'end_date'
        if (field === 'end_date') {
            // Lấy giá trị hiện tại của start_date
            const start_date = org.start_date;

            // Kiểm tra tính hợp lệ của end_date
            if (!isEndDateValid(start_date, value)) {
                // Nếu end_date không hợp lệ, đánh dấu lỗi
                org.isInvalidEndDate = true;
            } else {
                // Nếu end_date hợp lệ, loại bỏ đánh dấu lỗi
                org.isInvalidEndDate = false;
            }
        }

        // Cập nhật giá trị của trường field
        org[field] = value;

        // Cập nhật lại organizations trong state
        updatedOrgs[index] = org;
        setFormData(prevFormData => ({
            ...prevFormData,
            organizations: updatedOrgs
        }));
    };

    const handleAddOrganization = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            organizations: [...prevFormData.organizations, {
                name: '',
                start_date: '',
                end_date: '',
                type: '',
                location: '',
            }]
        }));
    };
    const isOrganizationValid = (org) => {
        return org.name.trim() !== '' && org.start_date.trim() !== '';
    };

    const removeInvalidOrganizations = () => {
        const updatedOrgs = formData.organizations.filter(isOrganizationValid);
        setFormData(prevFormData => ({
            ...prevFormData,
            organizations: updatedOrgs
        }));
    };
    const handleRemoveOrganization = (index) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            organizations: prevFormData.organizations.filter((_, i) => i !== index)
        }));
        //setInvalidOrganizations(prevInvalidOrganizations => prevInvalidOrganizations.filter(i => i !== index));
    };

    const handlefieldsOfResearchChange = (selectedOption) => {
        setSelectedfieldsOfResearch(selectedOption);
        const selectedValues = selectedOption.map(option =>
            (option.value)
        );

        // Cập nhật formData với giá trị mới
        setFormData({
            ...formData,
            fieldsOfResearch: selectedValues,
        });

    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

    };

    const handleLocationChange = (orgIndex, location) => {
        setFormData(prevFormData => {
            const updatedOrgs = [...prevFormData.organizations];
            updatedOrgs[orgIndex].location = location;
            return {
                ...prevFormData,
                organizations: updatedOrgs
            };
        });
    };
    const handleClearForm = () => {

        setRequiredFields({
            conf_name: true,
            acronym: true,
            callForPaper: true,
            link: true,
            fieldsOfResearch: true,
        })

        setSelectedfieldsOfResearch([])
    }

    const handleCloseForm = () => {
        handleClose()
        handleClearForm()
        setPage(0)
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await removeInvalidOrganizations()
        const newInvalidDates = formData.importantDates.reduce((acc, date, index) => {
            if ((date.date_value === '' && date.date_type !== '') || (date.date_value !== '' && date.date_type === '')) {
                acc.push(index);
            }
            return acc;
        }, []);

        if (newInvalidDates.length > 0) {
            setInvalidDates(newInvalidDates);
            alert("Please fill out both date value and date type or leave them both empty.");
        } else {
            const cleanedDates = formData.importantDates.filter(date => date.date_value !== '' && date.date_type !== '');
            setFormData(prevFormData => ({
                ...prevFormData,
                importantDates: cleanedDates
            }));
            setInvalidDates([]);
            // Handle form submission logic here
        }
        let allValid = true
        for (const field in requiredFields) {
            if (formData[field] === '' || formData[field] === undefined || (field === 'fieldsOfResearch' && formData[field].length === 0)) {
                allValid = false;
                requiredFields[field] = false

            } else {
                requiredFields[field] = true
            }
        }
        if (allValid) {
            setIsPosted(true)
            const result = await postConference(formData)
            setMesage(result.message)
            setStatus(result.status)
            onReloadList()
            if (result.status) {
                setShowSuccessModal(true)
                setIsPosted(false)
            }

        }

        else {
            setRequiredFields(requiredFields)
            setPage(0)
        }
    }
    const handleSelect = (selectedIndex) => {
        setPage(selectedIndex);
    };
    return (
        <>
            <Modal
                show={show}
                onHide={handleCloseForm}
                size="lg"
                scrollable

            >
                {status && showSuccessModal && <SuccessfulModal message={message} show={showSuccessModal} handleClose={handleClose} />}
                {!status && isPosted &&  <p className="text-danger">{message}</p>}
                <Modal.Header closeButton className='fixed'>
                    <Modal.Title className='text-center w-100 text-skyblue-dark'>Conference Information</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-scrollable-content m-0"
                    style={{ minHeight: "520px", maxHeight: "600px" }}>

                    {isPosted && status && <SuccessfulModal handleCloseForm={handleClose} message={message} />}
                    <Form className='px-5'>
                        <div className="modal-scrollable-body">
                            <Carousel activeIndex={page} onSelect={handleSelect} controls={false} interval={null} indicators={false}>
                                <Carousel.Item>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">
                                            <span className='text-danger'>* </span>Conference name:
                                        </Form.Label>
                                        <Form.Control

                                            type="text"
                                            placeholder="Enter the conference/journal name..."
                                            name="conf_name"
                                            value={formData.conf_name}
                                            onChange={handleInputChange}
                                            className={requiredFields.conf_name ? 'border-blue-normal' : 'border border-danger '}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">
                                            <span className='text-danger'>* </span>Acronym:
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter the acronym"
                                            name="acronym"
                                            value={formData.acronym}
                                            onChange={handleInputChange}
                                            className={requiredFields.acronym ? 'border-blue-normal' : 'border border-danger '}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">
                                            <span className='text-danger'>* </span> Link:
                                        </Form.Label>
                                        <Form.Control
                                            name="link"
                                            value={formData.link}
                                            onChange={handleInputChange}
                                            placeholder="Enter link..."
                                            className={requiredFields.link ? 'border-blue-normal' : 'border border-danger '}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-start">
                                        <Form.Label column sm="3">
                                            <span className='text-danger'>* </span> Field of Research:
                                        </Form.Label>
                                        <Col sm="9">
                                            <ChooseFORs
                                                selectedOptions={selectedfieldsOfResearch}
                                                onChange={handlefieldsOfResearchChange}
                                                requiredFields={requiredFields}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">
                                            Rank:
                                        </Form.Label>
                                        <Form.Select
                                            name="rank"
                                            value={formData.rank}
                                            placeholder='Select rank...'
                                            onChange={handleInputChange}
                                            className='border-blue-normal'
                                        >
                                            {!filterOptions.rank ? (
                                                data.rank.map((option, index) => (
                                                    <option value={option.value} key={index}>{option.label}</option>
                                                ))
                                            ) : (
                                                filterOptions.rank.map((option, index) => (
                                                    <option value={option} key={index}>{option}</option>
                                                ))
                                            )}

                                        </Form.Select>
                                    </Form.Group>

                                </Carousel.Item>
                                <Carousel.Item>
                                    <Accordion defaultActiveKey={activeAccordionKey} className='mt-3'>
                                        {formData.organizations.map((org, index) => (

                                            <Accordion.Item eventKey={`${index}`} key={index} className='border-0'>
                                                <Accordion.Header className='p-0'>
                                                    <div className='d-flex justify-content-between align-items-center w-100'>
                                                        <div>Organization {index + 1}</div>
                                                        <div className='d-flex mx-2'>
                                                            <Button onClick={() => handleRemoveOrganization(index)} className='bg-transparent border-0' title='Delete organization'>
                                                                <FontAwesomeIcon icon={faCircleXmark} className='text-danger fs-5' />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Accordion.Header>
                                                <Accordion.Body className='p-0'>
                                                    <Form.Group as={Row} className='my-3'>
                                                        <Form.Label column sm="3">Organization name: </Form.Label>
                                                        <Col>
                                                            <div className='d-flex align-items-center'>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={org.name}
                                                                    onChange={(e) => handleOrgChange(index, 'name', e.target.value)}
                                                                    className={org.isDuplicate && 'border-danger'}
                                                                    placeholder='Organization name...'
                                                                />
                                                                <OverlayTrigger
                                                                    placement="right"
                                                                    overlay={<Tooltip id={`tooltip-${index}`}>Organization name must be unique!</Tooltip>}
                                                                    show={org.isDuplicate}
                                                                >
                                                                    <FontAwesomeIcon icon={faCircleXmark} className='ms-2 text-warning' title='Organization name must be unique!' />
                                                                </OverlayTrigger>
                                                            </div>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className='my-3'>
                                                        <Form.Label column sm="3">Type: </Form.Label>
                                                        <Col>
                                                            <Form.Select value={org.type} onChange={(e) => handleOrgChange(index, 'type', e.target.value)}>
                                                                <option value="">Select type...</option>
                                                                <option value="online">Online</option>
                                                                <option value="offline">Offline</option>
                                                                <option value="hybrid">Hybrid</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className='my-3'>
                                                        <Form.Label column sm="3">Location: </Form.Label>
                                                        <Col>
                                                            <LocationInput onLocationChange={handleLocationChange} orgIndex={index} />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} key={index} className='mt-1 mb-3 d-flex w-100'>
                                                        <Col>
                                                            <Form.Label>Start date:</Form.Label>
                                                            <Form.Control type="date" value={org.start_date} onChange={(e) => handleOrgChange(index, 'start_date', e.target.value)} />

                                                        </Col>
                                                        <Col >
                                                            <Form.Label>End date:</Form.Label>
                                                            <Form.Control type="date" value={org.end_date} onChange={(e) => handleOrgChange(index, 'end_date', e.target.value)} className={org.isInvalidEndDate ? 'border-danger' : ''} />
                                                        </Col>
                                                    </Form.Group>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                        <div className='w-100 d-flex justify-content-center'>
                                            <Button variant="primary" onClick={handleAddOrganization} className='bg-skyblue-dark px-4 py-1 border-light'>
                                                Add more organization
                                            </Button>
                                        </div>
                                    </Accordion>
                                </Carousel.Item>
                                <Carousel.Item>
                                    {formData.importantDates.map((date, index) => (
                                        <Form.Group as={Row} key={index} className='my-3 d-flex w-100'>
                                            <Col sm='6'>
                                                <Form.Label>Date type:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder='Round date, submission date, ...'
                                                    value={date.date_type}
                                                    onChange={(e) => handleDateChange(e, index, 'date_type')}
                                                    className={invalidDates.includes(index) && date.date_type === '' ? 'border-danger' : ''}
                                                />

                                            </Col>
                                            <Col >
                                                <Form.Label>Date value:</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={date.date_value}
                                                    onChange={(e) => handleDateChange(e, index, 'date_value')}
                                                    className={invalidDates.includes(index) && date.date_value === '' ? 'border-danger' : ''}
                                                />
                                            </Col>
                                            <Col sm='1' className='d-flex align-items-end'>
                                                <Button variant="danger" onClick={() => handleRemoveDate(index)} className='bg-transparent border-0' title='Delete this date'>
                                                    <FontAwesomeIcon icon={faCircleXmark} className='text-danger' />
                                                </Button>
                                            </Col>
                                        </Form.Group>
                                    ))}

                                    <div className='w-100 d-flex justify-content-center'>
                                        <Button variant="primary" onClick={handleAddDate} className='bg-skyblue-dark px-4 py-1 border-light'>
                                            Add more date
                                        </Button>
                                    </div>

                                </Carousel.Item>
                                <CarouselItem>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-start">
                                        <Form.Label column sm="3">Call for paper:</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={18}
                                            name="callForPaper"
                                            value={formData.callForPaper}
                                            onChange={handleInputChange}
                                            placeholder="Enter callForPaper..."
                                            className={requiredFields.callForPaper ? 'border-blue-normal' : 'border border-danger '}
                                        />
                                    </Form.Group>
                                </CarouselItem>
                            </Carousel>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex align-items-center justify-content-center text-white">
                    <Button
                        onClick={() => setPage((prevIndex) => prevIndex - 1)}
                        disabled={page === 0}
                        className='border-blue-normal text-blue-normal bg-transparent text-black  px-5 mx-3'>
                        Back
                    </Button>
                    {
                        page < 3
                            ?
                            <Button onClick={() => setPage((prevIndex) => prevIndex + 1)} className='bg-blue-normal px-5 mx-3 text-black'>
                                Next
                            </Button>
                            :
                            <>
                                <Button onClick={handleFormSubmit} className='bg-blue-normal px-4 mx-3'>
                                    {
                                        loading
                                            ?
                                            <Loading />
                                            :
                                            <div>
                                                <Image width={20} height={20} className='me-2' src={AddButtonIcon} />
                                                Submit
                                            </div>
                                    }

                                </Button>

                            </>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddConference