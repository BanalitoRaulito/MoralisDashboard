import { useEffect, useRef } from "react";
import { useState } from "react"
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

export const useTokenPriceMap = assets => {
  const { token } = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();

  const [map, setMap] = useState({});
  const fetchedChainTokenPairs = useRef({}).current;
  useEffect(() => {
    if (!isInitialized) { return; }

    assets.forEach(({ chainId, token_address }) => {
      if (!fetchedChainTokenPairs[chainId]) { fetchedChainTokenPairs[chainId] = {}; }
      if (fetchedChainTokenPairs[chainId][token_address]) { return; }
      fetchedChainTokenPairs[chainId][token_address] = true;

      token
        .getTokenPrice({ chain: chainId, address: token_address})
        .then(({ usdPrice }) => {
          setMap(prevMap => {
            const newMap = { ...prevMap };
            if (!newMap[chainId]) { newMap[chainId] = {}; }
            newMap[chainId][token_address] = usdPrice;
            return newMap;
          });
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, assets]);

  return {
    get: (chainId, token_address) => map[chainId] && map[chainId][token_address]
  };
}