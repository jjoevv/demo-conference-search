
import { useAppContext } from '../context/authContext'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useState } from 'react'

const labelMap = {
  'DATA_UPDATE_CYCLE': {
      label: 'label_data_update_cycle',
      describe: 'describe_data_update_cycle'
  },
  'CHANGE_AND_UPDATE': {
      label: 'label_change_and_update',
      describe: 'describe_change_and_update'
  },
  'CANCELLED_EVENT': {
      label: 'label_cancelled_conference',
      describe: 'describe_cancelled_event'
  },
  'YOUR_UPCOMING_EVENT': {
      label: 'label_your_upcoming_event',
      describe: 'describe_your_upcoming_event'
  },
  'AUTO_ADD_EVENT_TO_SCHEDULE': {
      label: 'label_auto_add_event_to_schedule',
      describe: 'describe_auto_add_event_to_schedule'
  }
};

const useSetting = () => {
  const {state, dispatch} = useAppContext()
  const { user } = useLocalStorage()
  const { token } = useToken()
  const [loading, setLoading] = useState(false)

  const [selectedValue, setSelectedValue] = useState();

    const handleSelect = (value) => {
        setSelectedValue(value);
    };

  const getAllSetting = async () => {
    setLoading(true);
      if(user || localStorage.getItem('user')){
        let storedToken = JSON.parse(localStorage.getItem('token'));
        const tokenHeader = token ? token : storedToken
        const response = await fetch(`${baseURL}/user/setting`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenHeader}`
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
    
        const data = await response.json();

        const transformedData = {};
        for (const item of data.data) {
          transformedData[item.name] = {
              ...item,
              label: labelMap[item.name] ? labelMap[item.name].label : item.name,
              describe: labelMap[item.name] ? labelMap[item.name].describe : '',
              value: item.value,
              status: item.status
          };
      }
        setLoading(false);
        dispatch({type: 'GET_SETTINGS', payload: transformedData})
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
        let storedToken = JSON.parse(localStorage.getItem('token'));
        const tokenHeader = token ? token : storedToken
        // Gửi yêu cầu lấy danh sách feedback đến API
        const response = await fetch(`${baseURL}/user/setting`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenHeader}`
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
     settings: state.settings,
     selectedValue,
     handleSelect,
     getAllSetting, 
     updateSetting
    }
  }


  export default useSetting