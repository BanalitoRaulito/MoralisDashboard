import { networkConfigs } from "helpers/networks";
import { useState } from "react";

export const useFilters = () => {
  const [filters, setFilters] = useState(() =>
    Object.fromEntries(
      Object.values(networkConfigs).map(({chainId}) => [chainId, true])
    )
  );

  const toggleFilter = chain => {
    setFilters({
      ...filters,
      [chain]: !filters[chain],
    });
  };

  return {filters, toggleFilter};
}