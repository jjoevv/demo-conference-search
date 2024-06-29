import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import { useTranslation } from 'react-i18next';
import { Button, Image } from 'react-bootstrap';
import googleIcon from './../../assets/imgs/google.png'

const GoogleLoginButton = () => {
    const { t } = useTranslation()
    const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
      // Lấy thông tin người dùng từ URL sau khi chuyển hướng
      
    //  console.log('Refresh Token:', window.location);
  }, []);
    
    const handleLoginWithGoogle = () => {
        const url = ''
         window.location.href = url
        
    }

    return (
        <Button 
        onClick={handleLoginWithGoogle}
        className='border-0 w-100 p-2 rounded-3' style={{ backgroundColor: "#E8F1F3", color: "#434343" }}>
            <Image src={googleIcon} width={20} className="me-2 fw-bold" />
            {t('login_google')}
        </Button>
    );
};

export default GoogleLoginButton;
