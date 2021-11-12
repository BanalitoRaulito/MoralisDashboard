import { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import {networkConfigs} from "../helpers/networks";

export const useERC20Balances = (params) => {
  const { account } = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();
  const { walletAddress, chainId } = useMoralisDapp();

  const [assets, setAssets] = useState();

  useEffect(() => {
    if (isInitialized) {
      fetchERC20Balances()
        .then((balance) => setAssets(balance))
        .catch((e) => alert(e.message));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, chainId, walletAddress]);

  const fetchERC20Balances = async () => {
    let balances = []
    let networks = Object.entries(networkConfigs)
    let disabledNetworks = ['0x539']

    networks.filter(network => !disabledNetworks.includes(network[0]))
        .forEach(chain => {
      balances.push(account.getTokenBalances({ address: walletAddress, chain: chain[0] }));
    })

    const assetBalance = await Promise.all(balances)
      .then((result) => result)
      .catch((e) => alert(e.message));

    return [].concat.apply([], assetBalance)
  };

  return { fetchERC20Balances, assets };
};
