import {useEffect, useState} from "react";
import {useMoralis, useMoralisWeb3Api} from "react-moralis";
import {useMoralisDapp} from "providers/MoralisDappProvider/MoralisDappProvider";
import {networkConfigs, disabledNetworks} from "../helpers/networks";

export const useERC20Balances = () => {
  const {account} = useMoralisWeb3Api();
  const {isInitialized} = useMoralis();
  const {walletAddress, chainId} = useMoralisDapp();

  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (isInitialized) {
      fetchERC20Balances()
        .catch((e) => alert(e.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, chainId, walletAddress]);

  const fetchERC20Balances = async () => {
    let networks = Object.keys(networkConfigs);

    networks
      .filter(chain => !disabledNetworks.includes(chain))
      .forEach(chainId => {
        account
          .getTokenBalances({address: walletAddress, chain: chainId})
          .then(tokenBalances => tokenBalances.map(tokenBalance => ({
            ...tokenBalance,
            chainId,
          })))
          .then(tokenBalances => {
            setAssets(prevAssets => [...prevAssets, ...tokenBalances]);
          })
      })
  };

  return {fetchERC20Balances, assets};
};
