import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useReducer, useRef } from 'react';
import Card from '../UI/Card/Card';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import classes from './Login.module.css';
import { setUserSession } from '../../service/AuthService';
import axios from 'axios';

const loginAPIUrl = process.env.REACT_APP_LOGIN_URL;

const usernameReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value };
  }
    return { value: "", isValid: false };
};
  
const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length >= 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length >= 6 };
  }
  return { value: "", isValid: false };
};

const Login = ({ onLogin }) => {
    const [formIsValid, setFormIsValid] = useState(false);
    const [usernameState, dispatchUsername] = useReducer(usernameReducer, {
        value: "",
        isValid: false
    });
    const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
        value: "",
        isValid: false
    });
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const fakeButtonRef = useRef();
    const { isValid: usernameIsValid } = usernameState;
    const { isValid: passwordIsValid } = passwordState;
    useEffect(() => {
        const identifier = setTimeout(() => {
          setFormIsValid(usernameIsValid && passwordIsValid);
        }, 500);
        return () => {
          clearTimeout(identifier);
        };
      }, [usernameIsValid, passwordIsValid]);
    
    const usernameChangeHandler = (event) => {
        dispatchUsername({ type: "USER_INPUT", val: event.target.value });
        setFormIsValid(event.target.value && passwordState.isValid);
    };
    
    const passwordChangeHandler = (event) => {
        dispatchPassword({ type: "USER_INPUT", val: event.target.value });
        setFormIsValid(usernameState.isValid && event.target.value.trim().length >= 6);
    };
    
    const validateUresnameHandler = () => {
        dispatchUsername({ type: "INPUT_BLUR" });
    };
    
    const validatePasswordHandler = () => {
        dispatchPassword({ type: "INPUT_BLUR" });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        const requestConfig = {
            headers: {
                'x-api-key': process.env.REACT_APP_X_API_KEY
            }
        }
        const requestBody = {
            username: usernameState.value,
            password: passwordState.value
        }

        if (formIsValid) {
          axios.post(loginAPIUrl, requestBody, requestConfig)
            .then(response => {
                setUserSession(response.data.user, response.data.token);
                onLogin();
                navigate('/premium-content');
            })
            .catch(error => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage('Sorry, an unexpected error occurred. Please try again later.');
                }
            });
        } else if (!usernameIsValid) {
          usernameInputRef.current.focus();
        } else {
          passwordInputRef.current.focus();
        }
    };

    const submitFakeButtonHandler = (event) => {
      event.preventDefault();
      if (!formIsValid) {
        return;
      }
      fakeButtonRef.current.click();
    };

    return (
        <div className={classes.backgroundImage}>
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <h5>Login</h5>
                <Input
                    ref={usernameInputRef}
                    id="username"
                    label="Username"
                    type={process.env.NODE_ENV === 'development' ? 'text' : 'text'} // Change to 'text'
                    isValid={usernameIsValid}
                    value={usernameState.value}
                    onChange={usernameChangeHandler}
                    onBlur={validateUresnameHandler}
                    autoComplete="username"
                    />
                <Input
                    ref={passwordInputRef}
                    id="password"
                    label="Password"
                    type="password"
                    isValid={passwordIsValid}
                    value={passwordState.value}
                    onChange={passwordChangeHandler}
                    onBlur={validatePasswordHandler}
                    autoComplete="current-password"
                    />
                <div className={classes.actions}>
                    <Button type="submit" className={classes.btn}>
                        Login
                    </Button>
                </div>
                <button
                  type="button"
                  style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
                  onClick={submitFakeButtonHandler}
                  ref={fakeButtonRef}
                >
                  Fake Button
                </button>
            </form>
            {message && <p className={classes.message}>{message}</p>}
        </Card>
        </div>
    )
}

export default Login;
