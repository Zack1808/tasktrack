import React, { useState, useCallback, useId } from "react";
import Button from "./Button";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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

  const internalId = useId();
  const inputId = id ?? internalId;

  const switchVisibility = useCallback(() => {
    setIsVisible((prevState) => !prevState);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId}>
          {label} {required && "*"}
        </label>
      )}
      <div className="border border-gray-300 flex align-center focus-within:outline-2 focus-within:outline-blue-300 rounded-sm">
        <input
          {...rest}
          className="w-full px-2 focus:outline-none"
          type={isVisible ? "text" : type}
          required={required}
          id={inputId}
          autoComplete={type === "password" ? "new-password" : "on"}
        />
        {type === "password" && (
          <Button
            data-testid="password-visibility"
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
