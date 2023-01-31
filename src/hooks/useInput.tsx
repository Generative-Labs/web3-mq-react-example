import { useState } from 'react';

export const useInput = (initState: any) => {
  const [value, setValue] = useState(initState);
  return {
    input: {
      value,
      onChange: (e: { target: { value: any } }) => {
        setValue(e.target.value);
      },
    },
    setValue,
  };
};