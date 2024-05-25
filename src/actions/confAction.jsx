import { GET_ALL_CONFERENCES, GET_ONE_CONFERENCE, REQUEST_CONFERENCE } from "./actionTypes";

export const getAllConf = (conferences) => {
    return {
      type: GET_ALL_CONFERENCES,
      payload: conferences,
    };
};

export const getOneConf = (data) => {
    return {
      type: GET_ONE_CONFERENCE,
      payload: data,
    };
};

export const requestConference = () => {
  return {
    type: REQUEST_CONFERENCE,
  }
}