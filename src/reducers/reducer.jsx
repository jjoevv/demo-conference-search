import * as actionTypes from './../actions/actionTypes'

const appReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.LOADING:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case actionTypes.ERROR_MESSAGE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isLogin: true,
            };
        case actionTypes.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case actionTypes.LOGOUT_USER:
            return {
                ...state,
                user: null,
                isLogin: false
            };
        case actionTypes.REGISTRATION_REQUEST:
            return {
                ...state,
                loading: true,
                user: null,
                error: null,
            };

        case actionTypes.REGISTRATION_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload,
                error: null,
            };

        case actionTypes.REGISTRATION_FAILURE:
            return {
                ...state,
                loading: false,
                user: null,
                error: action.payload,
            };
        case actionTypes.GET_OPTIONS_FILTER:
            return {
                ...state,
                filterOptions: { ...state.filterOptions, ...action.payload }
            };
        case actionTypes.ADD_FILTER:
            return {
                ...state,
                loading: false,
                optionsSelected: {
                    ...state.optionsSelected,
                    [action.payload.label]: [
                        ...(state.optionsSelected[action.payload.label] || []), // Nếu mảng không tồn tại, tạo một mảng mới
                        ...action.payload.keywords, // Thêm giá trị mới vào mảng
                    ],
                },
            };
        case actionTypes.ADD_FILTER_DATE:
            return {
                ...state,
                loading: false,
                optionsSelected: {
                    ...state.optionsSelected,
                    [action.payload.label]: [...action.payload.keyword],
                },
            }
        case actionTypes.REMOVE_FILTER:
            return {
                ...state,
                appliedFilterResult: action.payload.updatedResultsFilter,
                optionsSelected: action.payload.updateOptionsSelected,
                loading: false,
                actionWithKeyword: 'delete'
            }
        case actionTypes.CLEAR_FILTERS:
            // Cập nhật state với appliedFilterResult đã xóa hết giá trị
            return {
                ...state,
                optionsSelected: action.payload.clearedOptionsSelected,
                appliedFilterResult: action.payload.clearedConferencesFilter,
                loading: false
            };
        case actionTypes.SET_PRIORITY_KEYWORD:
            return {
                ...state,
                priorityKeywords: action.payload,
            }; 

        case actionTypes.SET_SEARCH_RESULT:
            return {
                ...state,
                resultFilter: action.payload,
            };
        case actionTypes.SEARCH_KEYWORD:
            return {
                ...state,
                resultFilter: [...state.resultFilter, ...action.payload],
            };
        case actionTypes.GET_RESULT_AFTER_FILTER:
            return {
                ...state,
                appliedFilterResult: {
                    ...state.appliedFilterResult,
                    [action.payload.label]: [
                        ...state.appliedFilterResult[action.payload.label],
                        ...action.payload.results.map(item => item)
                    ]
                },
            };

        case actionTypes.SELECT_OPTION_FILTER:
            return {
                ...state,
                optionFilter: action.payload
            }
        case actionTypes.INPUT_OPTION_FILTER:
            return {
                ...state,
                resultKeywordFilter: action.payload,
            };
        case actionTypes.SET_INPUT_OPTION_FILTER:
            return {
                ...state,
                inputFilter: action.payload,
            };
        case actionTypes.REQUEST_CONFERENCE:
            return {
                ...state,
                loading: true,
                conferences: [],
                error: null,
            };
        case actionTypes.GET_ALL_CONFERENCES:
            return {
                ...state,
                conferences: [...state.conferences, ...action.payload],
            };
        case actionTypes.GET_ONE_CONFERENCE:
            return {
                ...state,
                conference: action.payload
            };
        case actionTypes.FOLLOW:
            return {
                ...state,
                listFollowed: action.payload,
            };

        case actionTypes.UNFOLLOW:
            return {
                ...state,
                listFollowed: state.listFollowed.filter(item => item.id !== action.payload.id),
            };

        case actionTypes.GET_POSTED_CONFERENCES:
            return {
                ...state,
                postedConferences: action.payload,
            };
        case actionTypes.GET_NOTES:
            return {
                ...state,
                notes: action.payload,
            };

        case actionTypes.ADMIN_GET_USERS:
            return {
                ...state,
                users: action.payload,
            };
        case actionTypes.ADMIN_GET_USER:
            return {
                ...state,
                userAccount: action.payload,
            };
        case actionTypes.GET_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload,
            };
        default:
            return state;
    }
};

export default appReducer