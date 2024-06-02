import  { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getIdFromPathname } from '../../utils/getID'
import useFeedback from '../../hooks/useFeedbacks'
import { SortFeedbacks } from './SortFeedbacks'
import useLocalStorage from '../../hooks/useLocalStorage'
import { Button, Image } from 'react-bootstrap'

import starIcon from '../../assets/imgs/star.png'
import unstarIcon from '../../assets/imgs/unstar.png'

import EditIcon from '../../assets/imgs/edit_green.png'
import DeleteIcon from '../../assets/imgs/delete_bin.png'
import InputFeedback from './InputFeedback'
import { formatTime } from '../../utils/formatDate'
const AllFeedbackOfConf = () => {
    const {pathname} = useLocation()
    const {quantity, feedbacks, getAllFeedbacks, updateFeedback, deleteFeedback, sortFeedback, checkEditFeedback} = useFeedback()
    const {user} = useLocalStorage()
    const [idEdit, setIdEdit] = useState(null)
    const [idCFP, setidCFP] = useState(null)
    
    const [selectedOption, setSelectedOption] = useState(null);
    const [displayFeedback, setDisplayfeedback] = useState([])
   
    useEffect(()=>{        
        const handleGetFeedbacks = async () => {
            
            const idinpathname = await getIdFromPathname(pathname)
            const response = await getAllFeedbacks(idinpathname)
            setDisplayfeedback(response.rows)
        }   
        handleGetFeedbacks()
    },[pathname, user])
    const options = [
        { value: 'ratingAscending', label: 'Rating Ascending' },
        { value: 'ratingDescending', label: 'Rating Descending' },
        { value: 'mostRecent', label: 'Most Recent' },
        { value: 'oldest', label: 'Oldest' },
    ];
      // Hàm xử lý khi người dùng chọn một tùy chọn từ dropdown
      const handleSelectOption = (option) => {
        setSelectedOption(option);
    };
    const handleChooseFeedback = (e, index) => {
        setIdEdit(feedbacks[index].tid)
        setidCFP(feedbacks[index].CallForPaperCfpId)
    }

    const handleDeleteFeedback = (tid)=> {
        deleteFeedback(tid)
        window.location.reload()
    }
    useEffect(()=>{
        const handleSortFeedback = async () => {
            const sorted = await sortFeedback(selectedOption)
            setDisplayfeedback(sorted)
        }
        handleSortFeedback()
    }, [selectedOption])

    const renderUser = (user) => {
        const displayName = user.name.trim() ? user.name : user.email;

    return displayName
    }
  return (
    <div className='ps-5'>
        <div className="d-flex align-items-center justify-content-between mt-4">
            <p className="fw-bold">{quantity} feedback</p>
            <SortFeedbacks options={options} onSelect={handleSelectOption}/>
        </div>
            <div>
          {
            feedbacks ? 
            <>
              {
    displayFeedback.map((feedback, index) => (
        <div className="p-3 m-1 mt-3 rounded shadow-sm w-100 border border-light" key={feedback.tid}>
            <div className="d-flex justify-content-between align-items-center bg-primary-light p-2 rounded">
                <span className="fw-bold m-0">{
                  renderUser(feedback.User)  }               wrote:</span>
                <span>at {formatTime(feedback.time)}</span>
            </div>
            <div key={index}>
        {[...Array(5)].map((_, starIndex) => (
            <span key={starIndex}>
                {starIndex < feedback.rating ? (
                    <Image src={starIcon} width={16} height={16} className='mx-1' />
                ) : (
                    <Image src={unstarIcon} width={16} height={16} className='mx-1'/>
                )}
            </span>
        ))}
    </div>
    <div className="p-2" style={{ textAlign: "justify", textJustify: "inter-word" }}>
                        {feedback.content}
                    </div>
          {
            checkEditFeedback(feedback.User) &&
            <>
              {feedback.tid === idEdit ? (
                <InputFeedback 
                    onClick={updateFeedback} 
                    onCheck={() => setIdEdit(false)} 
                    id={idEdit}
                    cfpid={idCFP}
                />
            ) : (
                <>
                   
                    <div className="d-flex justify-content-end align-items-center">
                        <Button className='bg-transparent border-0' onClick={(e) => handleChooseFeedback(e, index)}><Image src={EditIcon} width={20} /></Button>
                        <Button className='bg-transparent border-0'> <Image src={DeleteIcon} className='mx-1' width={20} onClick={() => handleDeleteFeedback(feedback.tid)} /></Button>
                    </div>
                </>
            )}
            </>
          }
        </div>
    ))
}

            </>
            :
            <><p>There are no feedbacks</p></>
          }
            </div>
    </div>
  )
}

export default AllFeedbackOfConf