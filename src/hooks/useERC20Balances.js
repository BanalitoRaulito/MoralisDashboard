import {useEffect, useState} from "react";
import {useMoralis, useMoralisWeb3Api} from "react-moralis";
import {useMoralisDapp} from "providers/MoralisDappProvider/MoralisDappProvider";
import {networkConfigs} from "../helpers/networks";

export const useERC20Balances = ({ address }) => {
  const {account} = useMoralisWeb3Api();
  const {isInitialized} = useMoralis();
  const { walletAddress } = useMoralisDapp();
  const [assets, setAssets] = useState([]);

  useEffect(
    () => {
      if (!isInitialized) { return }
      const networks = Object.keys(networkConfigs);

      networks
        .forEach(chainId => {
          account
            .getTokenBalances({
              address: address || walletAddress,
              chain: chainId
            })
            .then(tokenBalances => tokenBalances.map(tokenBalance => ({
              ...tokenBalance,
              chainId,
            })))
            .then(tokenBalances => {
              setAssets(prevAssets => [...prevAssets, ...tokenBalances]);
            })
            .catch((e) => alert(e.message));
        })
      return () => setAssets([])
    },
    [isInitialized, address, account]
  );

  return { assets };
};
