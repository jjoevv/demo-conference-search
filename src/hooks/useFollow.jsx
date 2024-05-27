
import { useAppContext } from '../context/authContext'
import { getFollowedConferenceAction } from '../actions/followAction'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
const useFollow = () => {
  const { state, dispatch } = useAppContext()
  const {token} = useToken()
  const {user} = useLocalStorage()
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const updateNewList = (newConferences)  => {
    // Tạo một bản sao của state.postedConferences để thực hiện các thay đổi mà không ảnh hưởng đến state gốc
    const updatedConferences = [...state.postedConferences];
    
    // Lặp qua danh sách hội nghị mới
    newConferences.forEach(newConference => {
      // Kiểm tra xem hội nghị đã tồn tại trong danh sách hay chưa
      const existingConferenceIndex = updatedConferences.findIndex(conference => conference.id === newConference.id);
    
      if (existingConferenceIndex !== -1) {
        // Nếu hội nghị đã tồn tại, thay thế bằng hội nghị mới
        updatedConferences[existingConferenceIndex] = newConference;
      } else {
        // Nếu hội nghị chưa tồn tại, thêm mới vào danh sách
        updatedConferences.push(newConference);
      }
    });
  
    return newConferences
  }
const fetchPage = async (page) => {
    let storedToken = JSON.parse(localStorage.getItem('token'));
   const tokenHeader = token ? token : storedToken
   const response = await fetch(`${baseURL}/follow?page=${page}&size=7`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${tokenHeader}`
    }
  });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

  const getListFollowedConferences = async () => {
    setLoading(true)
    if(user || localStorage.getItem('user')){
      try {
        
          const firstPageData = await fetchPage(1);                
          const totalPages = firstPageData.maxPages; // Lấy số lượng trang từ dữ liệu đầu tiên
          
          const extractData = firstPageData.data.map(item => {
            const callForPaperData = item.callForPaper;
            const followId = item.followId; // Giả sử trường followed nằm trong danh sách gốc
            
            return {
              ...callForPaperData,
              followId: followId
            };
          });
          
          const newConferences = updateNewList(extractData)
          dispatch(getFollowedConferenceAction(newConferences))
  
          // Fetch remaining pages asynchronously
          for (let i = 2; i <= totalPages; i++) {
              const pageData = await fetchPage(i);
              const extractData = pageData.data.map(item => {
                const callForPaperData = item.callForPaper;
                const followId = item.followId; // Giả sử trường followed nằm trong danh sách gốc
                
                return {
                  ...callForPaperData,
                  followId: followId
                };
              }); 
              const newConferences = updateNewList(extractData)
              dispatch(getFollowedConferenceAction(newConferences))
              
          }
  
        setLoading(false);
    } catch (error) {
        setLoading(false);
    }
     
    }
  }
  const followConference = async (id) => {
    setLoading(true)
    if(user){
      let storedToken = JSON.parse(localStorage.getItem('token'));

      const tokenHeader = token ? token : storedToken
      try {
        const response = await fetch(`${baseURL}/follow`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenHeader}`
          },
          body: JSON.stringify({ cfp_id: id})
        });
        const responsedata = await response.json()

        setLoading(false)
        if (!response.ok) {
          throw new Error(response.message);
        }
        else {
          getListFollowedConferences()
          return true
        }
      } catch (error) {
        console.error('Error:', error);
        return false
      }
    }
    else {
      alert('Log in before continuing, please!')
      navigate('/login')
    }
  }
  const unfollowConference = async (id) => {
    setLoading(true)
    try {
      const response = await fetch(`${baseURL}/follow`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cfp_id: id})
      });
      setLoading(false)
      if (!response.ok) {
       
        return false
      }
      else {
        getListFollowedConferences()
        return true
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

    return {
      loading,
      listFollowed: state.listFollowed,
      getListFollowedConferences,
      followConference,
      unfollowConference,
    }
  }


  export default useFollow