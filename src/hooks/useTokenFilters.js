import { useState } from "react";

export const useTokenFilters = () => {
  const [tokenFilters, setTokenFilters] = useState({});

  const toggleTokenFilter = ({symbol}) => {
    setTokenFilters({
      ...tokenFilters,
      [symbol]: !tokenFilters[symbol],
    });
  };

  return {tokenFilters, toggleTokenFilter};
}
