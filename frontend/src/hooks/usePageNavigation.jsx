import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getIdFromPathname } from '../utils/getID';

const usePageNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    // Lưu đường dẫn của trang hiện tại vào localStorage
    const handleBeforeUnload = () => {
      localStorage.setItem('lastVisitedPage', location.pathname);
    };

    // Xử lý trước khi làm mới trang
    const handleBeforeUnloadEvent = () => {
      
      handleBeforeUnload();
      
    };
    handleBeforeUnload()
    window.addEventListener('beforeunload', handleBeforeUnloadEvent);
  }, []);

  const goToPreviousPage = (event) => {
    if ((event.ctrlKey || event.metaKey) && (event.key === 'r' || event.key === 'R')) {
        const lastVisitedPage = localStorage.getItem('lastVisitedPage');
        if (lastVisitedPage) {
          navigate(lastVisitedPage);
        }
      }
  };

  return { goToPreviousPage };
};

export default usePageNavigation;
