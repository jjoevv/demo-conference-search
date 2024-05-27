import { useEffect, useState } from 'react';
import useToken from './useToken';

const useLocalStorage = () => {
  const { savetokenToLocalStorage } = useToken()

  // Kiểm tra xem có dữ liệu người dùng trong localStorage không
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kiểm tra xem có thông tin người dùng trong localStorage không
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      if (JSON.parse(storedUser).accessToken) {
        savetokenToLocalStorage(JSON.parse(storedUser).accessToken)
      }
    }
    else setUser(null)
  }, []);

  // Hàm để lưu thông tin người dùng vào localStorage
  const saveUserToLocalStorage = (userData, callback) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    callback && callback(userData); // Call the callback if provided
    return userData;
  };

  // Hàm để xóa thông tin người dùng khỏi localStorage
  const deleteUserFromLocalStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user-id');
    setUser(null);
  };

  const updateUserInStorage = (updateData) => {
    // Tạo một object mới chứa các thông tin cập nhật
    const updatedUser = {
      ...user, // Giữ nguyên các trường khác không cần cập nhật
      ...updateData, // Cập nhật thông tin mới
    };
    // Lưu object mới vào localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }

  return {
    user,
    saveUserToLocalStorage,
    deleteUserFromLocalStorage,
    updateUserInStorage
  };
};

export default useLocalStorage;