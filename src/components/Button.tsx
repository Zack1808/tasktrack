import React from "react";
import { Link } from "react-router-dom";

import Loader from "./Loader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "outlined" | "contained" | "text";
  link?: string;
  className?: string;
  disabled?: boolean;
  target?: string;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  link,
  className,
  disabled,
  target,
  loading,
  children,
  ...rest
}) => {
  const outlined = `border-2 border-blue-500 text-blue-500 ${
    loading || disabled ? "" : "hover:bg-gray-200"
  }`;
  const contained = `border-2 border-blue-500 bg-blue-500 text-white ${
    loading || disabled ? "" : "hover:bg-blue-600"
  }`;
  const text = "text-blue-500";

  const classes = `px-4 py-1.5 rounded-md cursor-pointer duration-100 ease-in flex gap-2 items-center
  ${variant === "contained" ? contained : ""} ${
    variant === "outlined" ? outlined : ""
  } ${variant === "text" ? text : ""} ${className ? className : ""}`;

  const btn = (
    <button
      className={classes}
      disabled={loading || disabled}
      aria-disabled={loading || disabled}
      {...rest}
    >
      {loading && (
        <Loader
          className={`${
            variant === "contained"
              ? "bg-conic-180 from-blue-500 via-white to-blue-300"
              : ""
          } ${
            variant === "outlined"
              ? "bg-conic-180 from-white via-blue-500 to-blue-300"
              : ""
          } w-5`}
          fill={`${variant === "contained" ? "bg-blue-500" : "bg-white"}`}
        />
      )}
      {children}
    </button>
  );

  if (link) {
    if (target) {
      return (
        <a href={link} target={target} rel="noreferrer">
          {btn}
        </a>
      );
    }
    return <Link to={link}>{btn}</Link>;
  }

  return btn;
};

export default React.memo(Button);
