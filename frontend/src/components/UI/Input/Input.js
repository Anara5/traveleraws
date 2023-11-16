import React, { useRef, useImperativeHandle } from "react";
import Button from '../Button/Button';
import classes from "./Input.module.css";

const Input = React.forwardRef((props, ref) => {
  const inputRef = useRef();

  const activate = () => {
    inputRef.current.focus();
  };

  const clearInput = () => {
    inputRef.current.value = '';
    inputRef.current.focus();
  };

  useImperativeHandle(ref, () => {
    return {
      focus: activate,
      clear: clearInput
    };
  });

  const inputType = props.type === 'password' ? 'password' : 'text';

  return (
    <div
      className={`${classes.control} ${
        props.isValid === false ? classes.invalid : ""
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        autoComplete={inputType === 'password' ? 'new-password' : 'text'}
      />
      {props.type === 'password' && (
          <Button type="button" onClick={clearInput} className={classes.clearButton}>
            Clear
          </Button>
        )}
    </div>
  );
});

export default Input;
