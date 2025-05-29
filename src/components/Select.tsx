import React, { useState, useCallback, useEffect, useRef, useId } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOptions {
  label: any;
  value: string | number;
}

interface SelectProps {
  options: SelectOptions[];
  value?: SelectOptions;
  label?: string;
  id?: string;
  onChange: (value: SelectOptions | undefined) => void;
}

const Select: React.FC<SelectProps> = ({
  value,
  label,
  onChange,
  options,
  id,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighligthedIndex] = useState<number>(0);
  const [optionsListPosition, setOptionsListPosition] =
    useState<string>("top-full mt-1");

  const componentID = id ?? useId();

  const selectRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLUListElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen((prevState) => !prevState);
  }, []);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
  }, []);

  const handleOptionSelect = useCallback(
    (option: SelectOptions, event?: React.MouseEvent) => {
      event && event.stopPropagation();
      if (option !== value) onChange(option);
    },
    [onChange, value]
  );

  const handleLabelClick = useCallback(() => {
    selectRef.current?.focus();
    setDropdownOpen(true);
  }, []);

  const checkSpaceBeneathDropdown = useCallback(() => {
    if (!optionsRef.current || !selectRef.current) return;

    const select = selectRef.current.getBoundingClientRect();
    const optionsList = optionsRef.current.offsetHeight;
    const availableSpace = window.innerHeight - select.bottom;

    setOptionsListPosition(
      optionsList >= availableSpace ? "bottom-full mb-1" : "top-full mt-1"
    );
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      setHighligthedIndex(0);
      setTimeout(checkSpaceBeneathDropdown, 0);
      if (optionsRef.current) optionsRef.current.scrollTop = 0;
    }
  }, [dropdownOpen]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.target !== selectRef.current) return;

      document.body.style.overflow = "hidden";

      switch (event.key) {
        case "Enter":
        case " ":
          toggleDropdown();
          if (dropdownOpen) {
            handleOptionSelect(options[highlightedIndex]);
            document.body.style.overflow = "auto";
          }
          break;

        case "ArrowUp":
        case "ArrowDown": {
          if (!dropdownOpen) setDropdownOpen(true);

          const newIndex =
            highlightedIndex + (event.key === "ArrowDown" ? 1 : -1);

          if (newIndex >= 0 && newIndex < options.length) {
            setHighligthedIndex(newIndex);
          }
          break;
        }

        case "Escape":
          closeDropdown();
          break;
      }
    };
    selectRef.current?.addEventListener("keydown", handler);

    return () => {
      selectRef.current?.removeEventListener("keydown", handler);
    };
  }, [dropdownOpen, highlightedIndex, options]);

  useEffect(() => {
    const item = itemsRef.current[highlightedIndex];

    if (item) item.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [highlightedIndex]);

  return (
    <div className="flex w-full flex-col gap-2 mb-20">
      {label && (
        <label htmlFor={componentID} onClick={handleLabelClick}>
          {label}
        </label>
      )}
      <div
        ref={selectRef}
        tabIndex={0}
        onClick={toggleDropdown}
        onBlur={closeDropdown}
        id={componentID}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
        aria-controls={`${componentID}-options`}
        aria-activedescendant={
          dropdownOpen && options[highlightedIndex]
            ? `${componentID}-option-${highlightedIndex}`
            : undefined
        }
        className="relative w-full border border-gray-300 rounded-sm flex items-center p-2 focus:outline focus:outline-blue-300"
      >
        <span className="w-full" data-testid="select-value">
          {value?.label}
        </span>
        <span>
          <ChevronDown className="text-gray-400" />
        </span>
        {dropdownOpen && (
          <ul
            role="listbox"
            id={`${componentID}-options`}
            ref={optionsRef}
            className={`absolute ${optionsListPosition} border border-gray-300 rounded-sm w-full left-0 bg-white z-50 max-h-60 overflow-auto`}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                data-highlighted={index === highlightedIndex}
                role="option"
                id={`${componentID}-option-${index}`}
                aria-selected={value === option}
                onMouseEnter={() => setHighligthedIndex(index)}
                className={`p-2 cursor-pointer ${
                  value === option ? "bg-blue-200" : ""
                } ${highlightedIndex === index ? "bg-blue-300" : ""}`}
                onClick={(event) => handleOptionSelect(option, event)}
                ref={(item) => (itemsRef.current[index] = item)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default React.memo(Select);
