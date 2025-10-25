import { Select } from "@mantine/core";
import { useState, useEffect } from "react";

export const SelectionDropdown = ({
  label,
  placeholder,
  value,
  data,
  setCurrentCountry,
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  // Sync internal state with prop changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleChange = (selectedValue) => {
    setCurrentValue(selectedValue);
    setCurrentCountry(selectedValue);
  };

  return (
    <Select
      label={label}
      placeholder={placeholder}
      value={currentValue}
      onChange={handleChange}
      data={data}
      style={{ flex: 1, maxHeight: "5rem", overflowY: "auto" }}
    />
  );
};

export default SelectionDropdown;
