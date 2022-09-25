import { findAllByTestId } from "@testing-library/react";
import { CognitoUserPool, 
  CognitoUserAttribute, 
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js"


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
  return new Promise((resolve, reject) => {
    const attrList = [];
    const authData = {
      Username: username,
      Password: password
    };
    const authDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: username,
      Pool: userPool
    }
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authDetails, {
      onSuccess (result) {
        console.log("logged in: ", result)
        resolve(result)
      },
      onFailure(err) {
        console.log("error logging in: ", err)
        reject(err)
      }
    });
  })
};

const logout = () => {
  userPool.getCurrentUser().signOut();
};

const getAuthenticatedUser = () => {
  return userPool.getCurrentUser();
}

const isAuthenticated = () => {
  const user = userPool.getCurrentUser();
  if (user) {
    user.getSession((err, session) => {
      if (err) {
        return false;
      }
      if (session.isValid()) {
        return true;
      }
      return false;
    })
    return true;
  }
  return false
}


const AuthService = {
  register,
  login,
  logout,
  getAuthenticatedUser,
  confirm,
  isAuthenticated
};

export default AuthService;
