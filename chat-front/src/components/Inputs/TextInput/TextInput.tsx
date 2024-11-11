import React from "react";
import { IInput } from "../input.interface";
import classes from "./TextInput.module.scss";

interface ITextInput extends IInput {
  value: string;
  onChange: Function;
}

const TextInput: React.FC<ITextInput> = ({
  type,
  length,
  name,
  required,
  pattern,
  value,
  onChange,
  label,
  placeholder,
  min,
}) => {
  return (
    <label className={classes.textInput}>
      <span className={classes.label}>
        {label}
        {required && <span className={classes.required}>*</span>}
      </span>

      <input
        type={type}
        name={name}
        id={name}
        required={required}
        maxLength={length}
        pattern={pattern}
        value={value}
        placeholder={placeholder}
        minLength={min}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target)
        }
      />
    </label>
  );
};

export default TextInput;
