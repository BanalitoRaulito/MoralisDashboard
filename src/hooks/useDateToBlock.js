import {useMoralis, useMoralisWeb3Api} from "react-moralis";
import {useMoralisDapp} from "../providers/MoralisDappProvider/MoralisDappProvider";
import {useEffect, useState} from "react";
import {networkConfigs} from "../helpers/networks";

export const useDateToBlock = () => {
  const {native} = useMoralisWeb3Api();
  const {isInitialized} = useMoralis();
  const {walletAddress, chainId} = useMoralisDapp();

  const [blocks, setBlocks] = useState([]);

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
        if (!chainId) {return;}
        native
          .getDateToBlock({date: Date.now().toString(), chain: chainId})
          .then(block => {
            setBlocks(prevBlocks => {
              prevBlocks[chainId] = block
            });
          })
      })
  };

  return {blocks};
};
