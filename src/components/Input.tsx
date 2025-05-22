import React, { useState, useCallback } from "react";
import Button from "./Button";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  id?: string;
}

const Input: React.FC<InputProps> = ({ label, type, id, ...rest }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const switchVisibility = useCallback(() => {
    setIsVisible((prevState) => !prevState);
  }, [isVisible]);

  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <div className="border-1 border-gray-300 flex align-center focus-within:outline-2 focus-within:outline-blue-300">
        <input
          {...rest}
          className="w-full px-2 focus:outline-none"
          type={isVisible ? "text" : type}
        />
        {type === "password" && (
          <Button variant="text" onClick={switchVisibility}>
            {isVisible ? <EyeOff /> : <Eye />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Input;
