import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

//const user = AuthService.getAuthenticatedUser();

//console.log('user', user)
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vage = (value) => {
    if (value > 100 || value < 5) {
        return (
          <div className="alert alert-danger" role="alert">
            The age must be between 5 and 100 years.
          </div>
        );
    }
};

const vheight = (value) => {
  if (value < 50 || value > 100) {
    return (
      <div className="alert alert-danger" role="alert">
        The height must be between 50 and 100 inches.
      </div>
    );
  }
};

const vincome = (value) => {
  if (value < 0) {
    return (
      <div className="alert alert-danger" role="alert">
        The income must be greater than 0.
      </div>
    );
  }
};

const Compare = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [income, setIncome] = useState(0);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeAge = (e) => {
    const age = Number(e.target.value);
    setAge(age);
  };

  const onChangeHeight = (e) => {
    const height = Number(e.target.value);
    setHeight(height);
  };

  const onChangeIncome = (e) => {
    const income = Number(e.target.value);
    setIncome(income);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
     UserService.submitData({
      age,
      height,
      income
     }).then(
          (response) => {
            setMessage("successfully created data");
            setSuccessful(true);
          },
          (error) => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
  
            setMessage(resMessage);
            setSuccessful(false);
          }
       );
    }
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleSubmit} ref={form}>
          {!successful && (
            <div>
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <Input
                  type="number"
                  className="form-control"
                  name="age"
                  value={age}
                  onChange={onChangeAge}
                  validations={[required, vage]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="height">Height</label>
                <Input
                  type="number"
                  className="form-control"
                  name="height"
                  value={height}
                  onChange={onChangeHeight}
                  validations={[required, vheight]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="income">Income</label>
                <Input
                  type="number"
                  className="form-control"
                  name="income"
                  value={income}
                  onChange={onChangeIncome}
                  validations={[required, vincome]}
                />
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block">Submit</button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div
                className={ successful ? "alert alert-success" : "alert alert-danger" }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Compare;
