import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Image, Modal, Carousel, CarouselItem, Row, ButtonGroup } from 'react-bootstrap'
import AddButtonIcon from './../../assets/imgs/edit.png'
import ChooseFORs from '../PostConference/ChooseFORs';
import usePost from '../../hooks/usePost';
import data from '../../components/Filter/options.json'
import SuccessfulModal from './SuccessModal';
import LocationInput from '../PostConference/LocationInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import useSearch from '../../hooks/useSearch';
import Loading from '../Loading';

const AddConference = ({ show, handleClose, handleCheckStatus, onReloadList }) => {
    const { loading, postConference, getPostedConferences } = usePost()
    const { filterOptions, getOptionsFilter } = useSearch()

    const [page, setPage] = useState(0)
    const [isPosted, setIsPosted] = useState(false)

    const [message, setMesage] = useState('')
    const [status, setStatus] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [activeAccordionKey, setActiveAccordionKey] = useState([]);

    const [isDuplicate, setIsDuplicate] = useState(false)
    const [isOrgDateValid, setIsOrgDateValid] = useState(false)
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
            start_date: null,
            end_date: null,
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

    const handleOrgChange = (index, event) => {
        const { name, value } = event.target;
        
        // Kiểm tra nếu end_date được chọn trước start_date
        if (name === 'end_date' && formData.organizations[index].start_date && value < formData.organizations[index].start_date) {
            setIsOrgDateValid(true);
        } else {
            setIsOrgDateValid(false);
        }

        const updatedOrganizations = [...formData.organizations];
        updatedOrganizations[index][name] = value;

        setFormData({
            ...formData,
            organizations: updatedOrganizations
        });
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

        // Kiểm tra và loại bỏ các phần tử rỗng trong mảng organizations
        const updatedOrganizations = formData.organizations.filter(org => {
            return !Object.values(org).every(value => value === "" || value === null);
        });

        // Cập nhật formData với mảng organizations sau khi loại bỏ các phần tử rỗng
        setFormData(prevFormData => ({
            ...prevFormData,
            organizations: updatedOrganizations
        }));

        const newInvalidDates = formData.importantDates.reduce((acc, date, index) => {
            if ((date.date_value === '' && date.date_type !== '') || (date.date_value !== '' && date.date_type === '')) {
                acc.push(index);
            }
            return acc;
        }, []);

        const hasDuplicateNames = formData.organizations.some((org, index) => {
            return formData.organizations.findIndex((item, i) => item.name === org.name && i !== index) !== -1;
        });
        setIsDuplicate(hasDuplicateNames)
        if (hasDuplicateNames) {
            setActiveAccordionKey(2)
        }
        if (newInvalidDates.length > 0) {
            setInvalidDates(newInvalidDates);
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
            if (result.status) {
                setShowSuccessModal(true)
                setIsPosted(false)

                onReloadList()
                window.location.reload()
                handleCloseForm()
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

                <Modal.Header closeButton className='fixed'>
                    <Modal.Title className='text-center w-100 text-skyblue-dark'>Conference Information</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-scrollable-content m-0"
                    style={{ minHeight: "520px", maxHeight: "500px" }}>

                    <Form className='px-5'>
                        <div className="modal-scrollable-body">
                            <Carousel activeIndex={page} onSelect={handleSelect} controls={false} interval={null} indicators={false}>
                                <Carousel.Item className='mt-5'>
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
                                            value={formData.rank || ''}
                                            onChange={handleInputChange}
                                            className='border-blue-normal'
                                        >
                                            {/* Option placeholder */}
                                            <option value="" disabled hidden>Select rank...</option>
                                            {/* Options từ data.rank */}
                                            {(filterOptions.rank || data.rank).map((option, index) => (
                                                <option value={option.value || option} key={index}>{option.label || option}</option>
                                            ))}
                                        </Form.Select>

                                    </Form.Group>

                                </Carousel.Item>
                                <Carousel.Item>
                                    {
                                        formData.organizations.map((organization, index) => (
                                            <div key={index}>
                                                <Form.Group as={Row} className='my-3'>
                                                    <Form.Label column sm="3">Organization name: </Form.Label>
                                                    <Col>
                                                        <div className='d-flex align-items-center'>
                                                            <Form.Control
                                                                type="text"
                                                                value={organization.name}
                                                                onChange={(e) => handleOrgChange(index, e)}
                                                                name='name'
                                                                placeholder='Organization name...'
                                                            />
                                                            <FontAwesomeIcon icon={faCircleXmark} className='ms-2 text-warning' title='Organization name must be unique!' />

                                                        </div>
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} className='my-3'>
                                                    <Form.Label column sm="3">Type: </Form.Label>
                                                    <Col>
                                                        <Form.Select value={organization.type} name='type' onChange={(e) => handleOrgChange(index, e)}>
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
                                                        <LocationInput onLocationChange={handleLocationChange} orgIndex={index}/>
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} className='mt-1 mb-3 d-flex w-100'>
                                                    <Col>
                                                        <Form.Label>Start date:</Form.Label>
                                                        <Form.Control type="date" value={organization.start_date} name='start_date' onChange={(e) => handleOrgChange(index, e)} className={isOrgDateValid ? 'border-danger' : ''} />

                                                    </Col>
                                                    <Col >
                                                        <Form.Label>End date:</Form.Label>
                                                        <Form.Control type="date" value={organization.end_date} name='end_date' onChange={(e) => handleOrgChange(index, e)} className={isOrgDateValid ? 'border-danger' : ''} />
                                                    </Col>
                                                </Form.Group>

                                            </div>
                                        ))
                                    }
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
                    {status && isPosted && showSuccessModal && <SuccessfulModal message={message} show={showSuccessModal} handleClose={handleClose} />}
                {!status && isPosted && <p className="text-danger text-center">{message}</p>}
                {isPosted && status && <SuccessfulModal handleCloseForm={handleClose} message={message} />}
                </Modal.Body>
              
                <Modal.Footer className="d-flex align-items-center justify-content-center text-white mb-4">
                    <ButtonGroup>
                        <Button
                            onClick={() => setPage((prevIndex) => prevIndex - 1)}
                            disabled={page === 0}
                            className='border-blue-normal text-blue-normal bg-transparent text-black  px-5 mx-3 rounded'>
                            Back
                        </Button>
                        {
                            page < 3
                                ?
                                <Button onClick={() => setPage((prevIndex) => prevIndex + 1)} className='rounded bg-blue-normal px-5 mx-3 text-black'>
                                    Next
                                </Button>
                                :
                                <>
                                    <Button onClick={handleFormSubmit} className='bg-blue-normal px-4 mx-3 rounded'>
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
                    </ButtonGroup>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddConference