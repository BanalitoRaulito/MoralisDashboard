import { useEffect, useRef } from "react";
import { useState } from "react"
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

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
        console.log(block[0], chainId)
        return block[0] == chainId
      })
      if (!currentBlock) {return;}
      console.log(currentBlock, 'yes', chainId)
      for (let block = currentBlock[1]; block > currentBlock[1] - 1000000; block-=100000) {
        token
          .getTokenPrice({chain: chainId, address: token_address, to_block: block})
          .then(({usdPrice}) => {
            setMap(prevMap => {
              const newMap = {...prevMap};
              if (!newMap[chainId]) {
                newMap[chainId] = {};
              }
              newMap[chainId][token_address] ? newMap[chainId][token_address].push(usdPrice) : newMap[chainId][token_address] = [];
              return newMap;
            });
          });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, assets]);

  return {
    get: (chainId, token_address) => map[chainId] && map[chainId][token_address]
  };
}
