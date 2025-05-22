import React, { useState, useCallback } from "react";
import Button from "./Button";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  id?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  id,
  required,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const switchVisibility = useCallback(() => {
    setIsVisible((prevState) => !prevState);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id}>
          {label} {required && "*"}
        </label>
      )}
      <div className="border border-gray-300 flex align-center focus-within:outline-2 focus-within:outline-blue-300">
        <input
          {...rest}
          className="w-full px-2 focus:outline-none"
          type={isVisible ? "text" : type}
          required={required}
          autoComplete={type === "password" ? "new-password" : "on"}
        />
        {type === "password" && (
          <Button
            type="button"
            variant="text"
            onClick={switchVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? <EyeOff /> : <Eye />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default React.memo(Input);
