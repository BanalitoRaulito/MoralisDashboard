import { networkConfigs } from "helpers/networks";
import { useState } from "react";

export const useNetworkFilters = () => {
  const [networkFilters, setNetworkFilters] = useState(() =>
    Object.fromEntries(
      Object.values(networkConfigs).map(({chainId}) => [chainId, true])
    )
  );

  const toggleNetworkFilter = chain => {
    setNetworkFilters({
      ...networkFilters,
      [chain]: !networkFilters[chain],
    });
  };

  return {networkFilters, toggleNetworkFilter};
}
