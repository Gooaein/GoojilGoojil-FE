import { useState, useCallback } from "react";

const useInput = (initialValue = "", onSubmit) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        onSubmit(value);
        setValue("");
      }
    },
    [value, onSubmit]
  );

  return {
    value,
    onChange: handleChange,
    onKeyPress: handleKeyPress,
  };
};

export default useInput;
