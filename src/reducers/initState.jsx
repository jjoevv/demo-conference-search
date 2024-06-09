export const initialState = {
  user: null,
  isLogin: false,
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
    owner: [],
  },
  priorityKeywords: {},

  pageParam: 0,
  paramsFilter: {
    homepage: "",
    follow: "",
    post: "",
  },


  optionFilter: [],
  resultKeywordFilter: [],
  resultFilter: [],
  inputFilter: '',
  actionWithKeyword:'alo',



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

  //feedbacks
  feedbacks: [],

  //notes
  notes: [],

  //ADMIN MANAGEMENT
  users: [],
  userAccount: null,
};

