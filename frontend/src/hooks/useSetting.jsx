
import { useAppContext } from '../context/authContext'
import { getFollowedConferenceAction } from '../actions/followAction'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useState } from 'react'
import useConference from './useConferences'
const useSetting = () => {
  const { user } = useLocalStorage()
  const { token } = useToken()
  const [settings, setSetttings] = useState([])
  const [loading, setLoading] = useState(false)
  const updateData = (data) => {
    return data.map(item => {
      switch (item.name) {
        case 'DATA_UPDATE_CYCLE':
          return {
            ...item,
            label: 'Data Update Cycle',
            describe: 'Select the data update cycle. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
          };
        case 'CHANGE_AND_UPDATE':
          return {
            ...item,
            label: 'Change and Update',
            describe: 'Our system will send you email notifications about conferences with extended dates'
          };
        case 'CANCELLED_EVENT':
          return {
            ...item,
            label: 'Cancelled conference',
            describe: 'Our system will send you email notifications about cancelled events'
          };
        case 'YOUR_UPCOMING_EVENT':
          return {
            ...item,
            label: 'Your upcoming event',
            describe: 'Our system will send you email notifications about your upcoming events in the timestamp'
          };
        case 'AUTO_ADD_EVENT_TO_SCHEDULE':
          return {
            ...item,
            label: 'Auto add events to schedule',
            describe: "Important dates from conferences you follow will be automatically added to your schedule."
          };
        default:
          return item;
      }
    });
  };
  
  const getAllSetting = async () => {
    setLoading(true);
    try {
      if(user){
        const response = await fetch(`${baseURL}/user/setting`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
    
        const data = await response.json();
        setLoading(false);
        const updatedData = await updateData(data.data)
        setSetttings(updatedData)
        return updatedData;
      }
    } catch (error) {
      setLoading(false); // Đặt trạng thái loading thành false trong trường hợp xảy ra lỗi
      throw new Error(`Error fetching settings: ${error.message}`);
    }
  };
  

  const updateSetting = async (name, status, value) => {
    setLoading(true)
    try {
      let postData = {}
      if(name==='DATA_UPDATE_CYCLE'){
        postData = {
          name: name,
          value: value
        }
      }
      else {
        postData = {
          name: name,
          status: status
        }
      }
        // Gửi yêu cầu lấy danh sách feedback đến API
        const response = await fetch(`${baseURL}/user/setting`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify( postData ),
        });
  
        // Kiểm tra xem kết quả trả về từ API có hợp lệ không
        if (!response.ok) {
          throw new Error('Failed to fetch feedbacks');
        }
  
        // Lấy dữ liệu từ phản hồi và cập nhật state
        const data = await response.json();
        setLoading(false)
        // Trả về dữ liệu từ API để có thể xử lý tiếp
        return data.data;
      } catch (error) {
        // Nếu có lỗi xảy ra trong quá trình gửi yêu cầu hoặc xử lý dữ liệu, ném ra một lỗi
        throw new Error(`Error fetching feedbacks: ${error.message}`);
      }
  }

    return {
     loading, 
     settings,
     getAllSetting, 
     updateSetting
    }
  }


  export default useSetting