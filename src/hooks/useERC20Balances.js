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

    console.log(networks.filter(chain => chain[0] !== '0x539'))
    networks.filter(network => network[0] !== '0x539').forEach(chain => {
      console.log(chain[0])
      balances.push(account.getTokenBalances({ address: walletAddress, chain: chain[0] }));
    })

    return await Promise.all(balances)
      .then((result) => result)
      .catch((e) => alert(e.message));
  };

  return { fetchERC20Balances, assets };
};
