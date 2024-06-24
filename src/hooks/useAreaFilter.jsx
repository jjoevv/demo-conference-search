
import countries from  './../data/countries.json'

const useAreaFilter = () => {
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
  return {
    checkForCountryInText
  }
}

export default useAreaFilter