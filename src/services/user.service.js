import axios from "axios";
import authHeader from "./auth-header";

import AuthService from "./auth.service";

// const API_URL = "http://localhost:8080/api/test/";
const API_URL = "https://zh6t1w7k96.execute-api.ap-southeast-2.amazonaws.com/dev/compare-yourself"

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const submitData = (data) => {
  return new Promise((resolve, reject) => {
    AuthService.getAuthenticatedUser().getSession((err, session) => {
      if (err) {
        console.log('submit data error: ', err)
        reject(err);
      }
      const token = session.getIdToken().getJwtToken();
      axios.post(API_URL, data, { headers: { Authorization: token } }).then((response) => {
        resolve(response);
      }, (error) => { reject(error)});
    });
  })
}

const getData = (all) => {
  console.log('called get data')
  return new Promise((resolve, reject) => {

    AuthService.getAuthenticatedUser().getSession((err, session) => {
      if (err) {
        console.log('submit data error: ', err)
        reject(err);
      }
     
      const token = session.getIdToken().getJwtToken();
      const accesstoken = session.getAccessToken().getJwtToken();

      console.log('token', token)

      let queryParam = "?accessToken=" + accesstoken;
      let urlParam = "all";
      if (!all) {
        urlParam = "single";
      }
      axios.get(API_URL + '/' + urlParam + queryParam, { headers: { Authorization: token } }).then((response) => {
        resolve(response);
      }, (error) => { reject(error)});
    });
  })
}

const deleteData = () => {
  
  AuthService.getAuthenticatedUser().getSession((err, session) => {  
    const token = session.getIdToken().getJwtToken();
    console.log('token', token)
    axios.delete(API_URL, { headers: { Authorization: token } }).then((response) => {
        console.log(response);
    }, (error) => { console.log(error)});

  });
}

const UserService = {
  getPublicContent,
  getUserBoard,
  submitData,
  getData,
  deleteData
};

export default UserService;
