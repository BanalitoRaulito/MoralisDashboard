import { useEffect, useRef } from "react";
import { useState } from "react"
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import {retryPromise} from "../helpers/retryPromise";

export const useTokenHistoricPriceMap = (assets, blocks) => {
  const { token } = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();

  const [map, setMap] = useState({});
  const fetchedChainTokenPairs = useRef({}).current;
  const networkBlocks = Object.entries(blocks)

  useEffect(() => {
    if (!isInitialized) { return; }

    assets.forEach(({ chainId, token_address }) => {
      const blocks = networkBlocks.find(block => block[0] == chainId)
      if (!blocks) {return;}

      if (!fetchedChainTokenPairs[chainId]) { fetchedChainTokenPairs[chainId] = {}; }
      if (fetchedChainTokenPairs[chainId][token_address]) { return; }
      fetchedChainTokenPairs[chainId][token_address] = true;

      blocks[1].forEach(block => {
        retryPromise(() => token.getTokenPrice({chain: chainId, address: token_address, to_block: block}))
          .then((token) => {
            if (!token) {return}
            const {usdPrice} = token
            setMap(prevMap => {
              const newMap = {...prevMap};
              if (!newMap[chainId]) {
                newMap[chainId] = {};
              }
              newMap[chainId][token_address] ? newMap[chainId][token_address].unshift(usdPrice) : newMap[chainId][token_address] = [];
              return newMap;
            });
          })
          .catch(e => console.warn(e));
      })
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, assets, blocks]);

  return {
    get: (chainId, token_address) => map[chainId] && map[chainId][token_address]
  };
}
