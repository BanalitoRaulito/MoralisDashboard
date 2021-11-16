import {useMoralis, useMoralisWeb3Api} from "react-moralis";
import {useMoralisDapp} from "../providers/MoralisDappProvider/MoralisDappProvider";
import {useEffect, useRef, useState} from "react";
import {networkConfigs} from "../helpers/networks";
import {retryPromise} from "../helpers/retryPromise";

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
        if (fetchedBlocks[chainId]) {
          return;
        }
        fetchedBlocks[chainId] = true;

        if (!chainId) {
          return;
        }
        const interval = 1000 * 60 * 60 * 24
        const currentDate = Date.now()
        const amount = 10
        retryPromise(() => native.getDateToBlock({date: currentDate.toString(), chain: chainId}))
          .then(firstBlock => {
            if (!firstBlock) {return;}
            retryPromise(() => native.getDateToBlock({date: (currentDate - interval).toString(), chain: chainId}))
              .then(secondBlock => {
                if (!secondBlock) {return;}

                setBlocks(prevBlocks => {
                  const newBlockMap = {...prevBlocks};
                  if (!newBlockMap[chainId]) {
                    newBlockMap[chainId] = [];
                  }

                  const blockInterval = (secondBlock.block - firstBlock.block) || 1;
                  for (let i = firstBlock.block; i > firstBlock.block - blockInterval * amount; i -= blockInterval) {
                    newBlockMap[chainId].unshift(i);
                  }
                  return newBlockMap;
                });
              })
          })
      })
  }

  return blocks;
}

