import React, { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  value?: string; // Controlled value
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select or type...",
  onChange,
  className = "",
  value = "",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]); // <-- refs array

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(value.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsDropdownOpen(true);
    setHighlightedIndex(0);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen && e.key === "ArrowDown") {
      setIsDropdownOpen(true);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionClick(filteredOptions[highlightedIndex].value);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (
      highlightedIndex >= 0 &&
      highlightedIndex < optionRefs.current.length
    ) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    if (!isDropdownOpen) setHighlightedIndex(-1);
  }, [isDropdownOpen]);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsDropdownOpen(true)}
        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
      />
      {isDropdownOpen && (
        <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-300 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                
                onClick={() => handleOptionClick(option.value)}
                className={`cursor-pointer px-4 py-2 text-sm ${
                  index === highlightedIndex
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
              No options found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Select;
