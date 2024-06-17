import { useAppContext } from '../context/authContext'
const useSuggest = () => {

    const findSimilarConferences = (conferencesData, conference) => {
        const similarConferences = [];
      
        for (let i = 0; i < conferencesData.length; i++) {
          const conf = conferencesData[i];
      
          // Check if ranks match and at least one fieldOfResearch matches
          if ((conf.information.rank === conference.information.rank && conf.information.source === conference.information.source) ||
              conf.information.fieldOfResearch.some(field => conference.information.fieldOfResearch.includes(field)) &&
              conf.id !== conference.id &&
              conf.organizations.some(org => org.status === 'new' && new Date(org.start_date) > new Date())
            ) {
      
            // Add similar object with rank and fieldOfResearch to the conference
            conf.similar = {
              rank: conference.information.rank,
              fieldOfResearch: conference.information.fieldOfResearch,
            };
      
            similarConferences.push(conf);
      
            // Break loop if we have found 10 conferences
            if (similarConferences.length >= 12) {
              break;
            }
          }
        }
      
        
      
        // Return up to 10 conferences (or less if there are fewer matches)
        return similarConferences.slice(0, 12);
      };
      
      
  return {
    findSimilarConferences
  }
}

export default useSuggest