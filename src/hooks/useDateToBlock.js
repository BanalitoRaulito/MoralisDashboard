import {useMoralis, useMoralisWeb3Api} from "react-moralis";
import {useMoralisDapp} from "../providers/MoralisDappProvider/MoralisDappProvider";
import {useEffect, useRef, useState} from "react";
import {networkConfigs} from "../helpers/networks";

export const useDateToBlock = () => {
  const {native} = useMoralisWeb3Api();
  const {isInitialized} = useMoralis();
  const {walletAddress, chainId} = useMoralisDapp();

  const [blocks, setBlocks] = useState({});
  const fetchedBlocks = useRef({}).current;

  useEffect(() => {
    if (isInitialized) {
      fetchDateToBlock()
        .catch((e) => alert(e.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, chainId, walletAddress]);

  const fetchDateToBlock = async () => {
    let networks = Object.keys(networkConfigs);
    networks
      .forEach(chainId => {
        if (fetchedBlocks[chainId]) { return; }
        fetchedBlocks[chainId] = true;

        if (!chainId) {return;}
        native
          .getDateToBlock({date: Date.now().toString(), chain: chainId})
          .then(({block}) => {
            setBlocks(prevBlocks => {
              const newMap = {...prevBlocks};
              if (!newMap[chainId]) {
                newMap[chainId] = {};
              }
              newMap[chainId] = block;
              return newMap;
            });
          })
      })
  };

  return {blocks};
};
