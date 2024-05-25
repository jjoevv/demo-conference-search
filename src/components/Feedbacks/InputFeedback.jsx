import { useEffect, useState } from 'react'
import { Button, Form, Image } from 'react-bootstrap'
import RateConference from './RateConference';
import useLocalStorage from '../../hooks/useLocalStorage';

import AvatarIcon from '../../assets/imgs/avatar.png'
import useFeedback from '../../hooks/useFeedbacks';
const InputFeedback = ({ onClick, onCheck, id, cfpid}) => {
    const { user } = useLocalStorage()
    const { getAllFeedbacks } = useFeedback()
    const [feedback, setFeedback] = useState('')
    const [rating, setRating] = useState(5)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState('')
    const handleSubmit = async () => {
        if (user) {
            if (feedback !== '') {
                // Gửi feedback qua API ở đây
                const res = await onClick(id, feedback, rating)
                // Reset ô nhập feedback sau khi gửi
                if(res.data){

                    setFeedback('');
                    
                    getAllFeedbacks(cfpid)
                    window.location.reload()
                    const timer = setTimeout(() => {
                        if(onCheck){onCheck()}
                    }, 5000);
            
                    // Hủy bỏ timer khi component unmount
                    return () => clearTimeout(timer);
                }
                else {
                    setMessage('Something wrong! Try again or refresh page')
                    setError(true)
                }
            }
            else {
                setError(true)
            }
        }
        else alert('Please log in to leave feedback.')
    };

    const handleInputChange = (e) => {
        setFeedback(e.target.value)
        setError(false)
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setError(false);
        }, 5000);

        // Hủy bỏ timer khi component unmount
        return () => clearTimeout(timer);
    }, [error]); // Chạy effect chỉ một lần khi component mount
    return (
        <div className='w-100 d-flex align-items-center justify-content-start mt-3'>
            <div className='h-100 align-self-start'>
                <Image src={AvatarIcon} className='me-3' width={30}/>
            </div>

            <div className='w-100 my-1'>
                <span className=' fw-semibold'>{user && user.name ? user.name : 'Undefined user'}</span>
                <Form className='my-1'>
                    <Form.Group className=' border rounded'>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={feedback}
                            onChange={e => handleInputChange(e)}
                            placeholder="Feedback..."
                            required={true}
                            className={error ? 'border-danger' : 'border-0'}
                        />
                        {error && <p className='text-danger'>Please input your feedback before posting.</p>}
                        <div className="text-end m-2 mx-3 d-flex justify-content-between align-items-center">

                            <RateConference rating={rating} setRating={setRating} />
                            <div>
                                {error && message!== ''&& <p className='text-danger'>{message}</p>}
{
    onCheck && <Button className='bg-secondary border-light mx-2 px-4' onClick={onCheck} title='Post your feedback'>
    Cancel
</Button>
}
                            <Button className='bg-primary-dark border-light  px-4' onClick={handleSubmit} title='Post your feedback'>
                                Post
                            </Button>
                            </div>
                        </div>
                    </Form.Group>

                </Form>
            </div>
        </div>
    )
}

export default InputFeedback