import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";


import { CognitoIdentityProvider} from "@aws-sdk/client-cognito-identity-provider";

const cognitoIdentityProvider = new CognitoIdentityProvider({region: "ap-southeast-2"});

const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  const getData = () => {
    UserService.getData();
    // AuthService.getAuthenticatedUser().getSession((err, session) => {
    //   if (err) {
    //     console.log('submit data error: ', err)
    //   }
     
    //   const token = session.getIdToken().getJwtToken();

    //   console.log('token', token)

    //   credentials: new AWS.CognitoIdentityCredentials({
    //     IdentityPoolId: 'XXX'
    //   })

    //   cognitoIdentityProvider.getUser(token, (err, res) =>{
    //     if (err) {
    //       console.log('err', err)
    //     }

    //     console.log('result', res)
    //   });
    // })
  }

  const deleteData = () => {
    UserService.deleteData();
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
        <button onClick={getData}>Get Data</button>
        <button onClick={deleteData}>Delete Data</button>
      </header>
    </div>
  );
};

export default Home;
