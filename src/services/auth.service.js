import axios from "axios";
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from "amazon-cognito-identity-js"


const API_URL = process.env.REACT_APP_API_URL;


const POOL_DATA = {
  UserPoolId: process.env.REACT_APP_USER_POOL_ID,
  ClientId: process.env.REACT_APP_CLIENT_ID
}

const userPool = new CognitoUserPool(POOL_DATA);

const register = (username, email, password) => {
  return new Promise((resolve, reject) => {
    const attrList = [];
    const emailAttribute = {
      Name: "email",
      Value: email
    };
    attrList.push(new CognitoUserAttribute(emailAttribute));
    userPool.signUp(username, password, attrList, null, (err, result) => {
      if (err) {
        console.log('registration error', err)
        reject(err)
      }
      console.log("register: ", result)
      resolve(result)
    });
  })
};

const confirm = (username, code) => {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        console.log('confirmation error', err)
        reject(err)
      }
      console.log("confirmation: ", result)
      resolve(result)
    });
  })
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  confirm
};

export default AuthService;
