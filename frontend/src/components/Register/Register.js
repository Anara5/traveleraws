import React, { useReducer, useEffect, useRef } from 'react';
import Card from '../UI/Card/Card';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import classes from './Register.module.css';
import axios from 'axios';

const registerAPIUrl = process.env.REACT_APP_REGISTER_URL;

const inputReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 0 };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 0 };
  }
  return { value: '', isValid: false };
};

const Register = () => {
    const [nameState, dispatchName] = useReducer(inputReducer, { value: '', isValid: false });
    const [emailState, dispatchEmail] = useReducer(inputReducer, { value: '', isValid: false });
    const [usernameState, dispatchUsername] = useReducer(inputReducer, { value: '', isValid: false });
    const [passwordState, dispatchPassword] = useReducer(inputReducer, { value: '', isValid: false });
    const [message, setMessage] = React.useState(null);
  
    const nameInputRef = useRef();
    const emailInputRef = useRef();
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const { isValid: nameIsValid } = nameState;
    const { isValid: emailIsValid } = emailState;
    const { isValid: usernameIsValid } = usernameState;
    const { isValid: passwordIsValid } = passwordState;
    const formIsValid =
      nameState.isValid && emailState.isValid && usernameState.isValid && passwordState.isValid;
  
    useEffect(() => {
      const identifier = setTimeout(() => {
        // Check if all fields are valid
        const isFormValid =
          nameState.isValid && emailState.isValid && usernameState.isValid && passwordState.isValid;
        setMessage(isFormValid ? null : 'All fields are required');
      }, 500);
      return () => {
        clearTimeout(identifier);
      };
    }, [nameState.isValid, emailState.isValid, usernameState.isValid, passwordState.isValid]);
  
    const submitHandler = (event) => {
      event.preventDefault();
  
      if (!formIsValid) {
        return;
      }
  
      const requestConfig = {
        headers: {
          'x-api-key': process.env.REACT_APP_X_API_KEY,
        }
      };
  
      const requestBody = {
        name: nameState.value,
        email: emailState.value,
        username: usernameState.value,
        password: passwordState.value,
      };
  
      axios
        .post(registerAPIUrl, requestBody, requestConfig)
        .then((response) => {
          setMessage('Registration successful');
        })
        .catch((error) => {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            setMessage(error.response.data.message);
          } else {
            setMessage('Sorry, an unexpected error occurred. Please try again later.');
          }
        });
    };
  
    return (
      <Card className={classes.register}>
        <form onSubmit={submitHandler}>
          <h5>Register</h5>
          <Input
            ref={nameInputRef}
            id="name"
            label="Name"
            type="text"
            isValid={nameIsValid}
            value={nameState.value}
            onChange={(event) => dispatchName({ type: 'USER_INPUT', val: event.target.value })}
            onBlur={() => dispatchName({ type: 'INPUT_BLUR' })}
          />
          <Input
            ref={emailInputRef}
            id="email"
            label="E-Mail"
            type="email"
            isValid={emailIsValid}
            value={emailState.value}
            onChange={(event) => dispatchEmail({ type: 'USER_INPUT', val: event.target.value })}
            onBlur={() => dispatchEmail({ type: 'INPUT_BLUR' })}
          />
          <Input
            ref={usernameInputRef}
            id="username"
            label="Username"
            type="text"
            isValid={usernameIsValid}
            value={usernameState.value}
            onChange={(event) => dispatchUsername({ type: 'USER_INPUT', val: event.target.value })}
            onBlur={() => dispatchUsername({ type: 'INPUT_BLUR' })}
          />
          <Input
            ref={passwordInputRef}
            id="password"
            label="Password"
            type="password"
            isValid={passwordIsValid}
            value={passwordState.value}
            onChange={(event) => dispatchPassword({ type: 'USER_INPUT', val: event.target.value })}
            onBlur={() => dispatchPassword({ type: 'INPUT_BLUR' })}
          />
          <div className={classes.actions}>
            <Button type="submit" className={classes.btn}>
              Register
            </Button>
          </div>
        </form>
        {message && <p className={classes.message}>{message}</p>}
      </Card>
    );
  };
  
  export default Register;
