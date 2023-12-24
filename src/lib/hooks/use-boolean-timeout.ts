import React from "react";

export function useBooleanTimeout(timeout = 2000) {
  const [value, setValue] = React.useState<Boolean>(false);

  const setTrue = () => {
    setValue(true);

    setTimeout(() => {
      setValue(false);
    }, timeout);
  };

  return [value, setTrue] as [Boolean, () => void];
}
