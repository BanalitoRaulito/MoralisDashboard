import { useEffect, useRef } from "react";
import { useState } from "react"
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import {retryPromise} from "../helpers/retryPromise";

export const useTokenHistoricPriceMap = (assets, blocks) => {
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

      const currentBlock = Object.entries(blocks).find(block => {
        return block[0] == chainId
      })
      if (!currentBlock) {return;}
      for (let block = currentBlock[1]; block > currentBlock[1] - 1000000; block-=100000) {
        retryPromise(()=>token.getTokenPrice({chain: chainId, address: token_address, to_block: block}))
          .then(({usdPrice}) => {
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
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, assets]);

  return {
    get: (chainId, token_address) => map[chainId] && map[chainId][token_address]
  };
}
