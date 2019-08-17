import {
  REMOVE_USER_DATA,
  SET_CATEGORIES,
  SET_MOVEMENTS,
  SET_TOKEN,
  SET_USER_DATA,
  START_FETCHING,
  STOP_FETCHING,
  SET_MESSAGE,
  CLEAR_MESSAGE,
  SET_TOTAL,
  SET_FILTERED_MOVEMENTS,
  CLEAR_FILTERED_MOVEMENTS
} from "./../actions/types";

let initialState = {
  categories: [],
  isFetching: false,
  movements: [],
  userData: null,
  userToken: null,
  message: { message: "", type: "", kind: "" },
  total: 0,
  filteredMovements: {}
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_USER_DATA:
      return {
        ...state,
        userData: null,
        userToken: null
      };
    case SET_MESSAGE:
      return {
        ...state,
        message: {
          message: action.data.message,
          type: action.data.type,
          kind: action.data.kind
        }
      };
    case CLEAR_MESSAGE:
      return {
        ...state,
        message: {
          message: "",
          type: "",
          kind: ""
        }
      };
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.data
      };
    case SET_CATEGORIES:
      return {
        ...state,
        categories: action.data
      };
    case SET_MOVEMENTS:
      return {
        ...state,
        movements: action.data
      };
    case SET_TOKEN:
      return {
        ...state,
        userToken: action.data
      };
    case SET_TOTAL:
      return {
        ...state,
        total: action.data
      };
    case SET_FILTERED_MOVEMENTS:
      return {
        ...state,
        filteredMovements: action.data
      };
    case CLEAR_FILTERED_MOVEMENTS:
      return {
        ...state,
        filteredMovements: {}
      };
    case START_FETCHING:
      return {
        ...state,
        isFetching: true
      };
    case STOP_FETCHING:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
};

export default rootReducer;
