
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/authContext';
import countries from  './../data/countries.json'
import { useTranslation } from 'react-i18next';

const useAreaFilter = () => {
  const {state, dispatch} = useAppContext()
  const {t} =useTranslation()
  const navigate = useNavigate()
    const checkForCountryInText = (text) => {
      if(!text || text === undefined && text === ''){
        return ''
      }
        const countryNames = Object.values(countries).map(country => country.country_name);
        const foundCountry = countryNames.find(country => text.toLowerCase().includes(country.toLowerCase()));
    
        if (foundCountry) {
          return foundCountry
        } else {
          return ''
        }
      };

      const setUserLocation = (location) => {
        dispatch({type: "SET_USER_LOCATION", payload: location})
      }

      const handleNavigateAccount = () => {
        alert(t('pls_login_to_use_area_filter'))
        navigate('/user/account')
      }
      const handleNavigateLogin = () => {
        alert(t('pls_login_to_use_this_feature'))
        navigate('/login')
      }
  return {
    userLocation: state.userLocation,
    setUserLocation,
    checkForCountryInText,
    handleNavigateAccount,
    handleNavigateLogin
  }
}

export default useAreaFilter