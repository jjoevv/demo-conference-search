// actionTypes.js
export const LOADING = 'LOADING';
export const ERROR_MESSAGE = 'ERROR_MESSAGE';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_USER = 'LOGOUT_USER';

export const REGISTRATION_REQUEST = 'REGISTRATION_REQUEST';
export const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS';
export const REGISTRATION_FAILURE = 'REGISTRATION_FAILURE';

export const SEARCH_KEYWORD = 'SEARCH_KEYWORD'; //get all keywords by input and filter
export const SET_SEARCH_RESULT = 'SET_SEARCH_RESULT'; //get all keywords by input and filter
export const SEARCH_KEYWORD_FAILURE = 'SEARCH_KEYWORD_FAILURE'; //get FAILED

export const GET_ALL_CONFERENCES = 'GET_ALL_CONFERENCES';   //get all conferences from server
export const GET_ONE_CONFERENCE = 'GET_ONE_CONFERENCE'  //get data of one conference by id
export const GET_ALL_PENDING_CONFERENCES = 'GET_ALL_PENDING_CONFERENCES';
export const GET_PENDING_CONFERENCE = 'GET_PENDING_CONFERENCE';

export const FOLLOW = "FOLLOW";
export const UNFOLLOW = "UNFOLLOW"

export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS'
export const SET_NOTI_MESSAGE_CRAWL = 'SET_NOTI_MESSAGE_CRAWL'

export const GET_OPTIONS_FILTER = 'GET_OPTIONS_FILTER'
export const ADD_FILTER_DATE = 'ADD_FILTER_DATE';
export const ADD_FILTER_CONFERENCE_DATE= 'ADD_FILTER_CONFERENCE_DATE';
export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';
export const SET_PRIORITY_KEYWORD = 'SET_PRIORITY_KEYWORD';
export const SET_PARAMS = 'SET_PARAMS'
export const SET_PARAMS_FILTERS = 'SET_PARAMS_FILTERS'

export const GET_RESULT_AFTER_FILTER = 'GET_RESULT_AFTER_FILTER';
export const SELECT_OPTION_FILTER = 'SELECT_OPTION_FILTER'
export const INPUT_OPTION_FILTER = 'INPUT_OPTION_FILTER'
export const SET_INPUT_OPTION_FILTER = 'SET_INPUT_OPTION_FILTER'

export const GET_NOTES = 'GET_NOTES'
export const GET_FEEDBACKS = 'GET_FEEDBACKS'
export const GET_SETTINGS= 'GET_SETTINGS'

export const GET_POSTED_CONFERENCES = 'GET_POSTED_CONFERENCES'

export const ADMIN_GET_USERS = 'ADMIN_GET_USERS'
export const ADMIN_GET_USER = 'ADMIN_GET_USER'

export const SET_DATA_UPLOAD = 'SET_DATA_UPLOAD'
export const SET_HEADERS_EXPORT = 'SET_HEADERS_EXPORT'

export const SET_USER_LOG = 'SET_USER_LOG'
export const SET_ETL_LOG = 'SET_ETL_LOG'
export const SET_CURRENT_USER = 'SET_CURRENT_USER'


export const SET_SOCKET_ID = 'SET_SOCKET_ID'

export const ADD_ID_CRAWLING = 'ADD_ID_CRAWLING'
export const REMOVE_ID_CRAWLING = 'REMOVE_ID_CRAWLING'
export const UPDATE_ID_STATUS = 'UPDATE_ID_STATUS'

export const ADD_MESSAGE = 'ADD_MESSAGE'
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE'

export const SET_USER_LOCATION = 'SET_USER_LOCATION'

export const SET_IMPORT_LIST = 'SET_IMPORT_LIST'
export const SET_BUFFER_LIST = 'SET_BUFFER_LIST'
export const CLEAR_BUFFER_LIST = 'CLEAR_BUFFER_LIST'
export const SET_STOP_IMPORTING = 'SET_STOP_IMPORTING' 

export const UPDATE_IMPORT_LIST = 'UPDATE_IMPORT_LIST'
