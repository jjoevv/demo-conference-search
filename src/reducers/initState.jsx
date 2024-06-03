export const initialState = {
  user: null,
  loading: false,
  error: null,
  
  conferences: [],
  conference: null,
  notifications: [],
  isFollow: false,//????

  popularConf: [], //conference có nhiều follow


  //filter
  maxpage: 0,
  amount: 0,
  filterOptions: [],
  filterResults: [],
  appliedFilterResult: {
    //lưu kết quả đã filter theo từng tiêu chí
    location: [], 
    rank: [], 
    for: [], 
    source: [],
    acronym: [],
    type: [],
    conferenceDate: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    category: [],
  },

  optionsSelected: {
    location: [],
    rank: [], 
    for: [], 
    source: [], 
    acronym: [], 
    type: [],
    conferenceDate: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    category: [],
  },
priorityKeywords: {},



  optionFilter: [],
  resultKeywordFilter: [],
  resultFilter: [],
  inputFilter: '',
  actionWithKeyword:'',



  listFollowed: [],
  //filter in auth page
  filterAuth: [],
  filterOptionsAuth:  {
    locations: [],
    ranks: [],
    fors: [],
    sources: [],
    acronyms: [],
    types: [],
    date: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    category: [],
  },
  
  //postedConf
  postedConferences: [],

  //notes
  notes: []
};

