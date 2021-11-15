import {useERC20Balances} from "../hooks/useERC20Balances";
import {Skeleton} from "antd";
import {useMemo} from "react";
import BalanceTable from "./BalanceTable";
import {useTokenPriceMap} from "hooks/useTokenPriceMap";
import Moralis from "moralis";
import TokenValueChart from "./Chart/TokenValueChart";
import {useTokenHistoricPriceMap} from "../hooks/useTokenHistoricPriceMap";
import {useDateToBlock} from "../hooks/useDateToBlock";
import HistoricTokenValueChart from "./Chart/HistoricTokenValueChart";
import NetworkFilters from "./Filters/NetworkFilters";
import {useNetworkFilters} from "../hooks/useNetworkFilters";
import {useTokenFilters} from "../hooks/useTokenFilters";

function ERC20Balances() {
  const {networkFilters, toggleNetworkFilter} = useNetworkFilters();
  const {tokenFilters, toggleTokenFilter} = useTokenFilters();

  const {assets} = useERC20Balances();
  const filteredAssets = useMemo(
    () => assets.filter(asset => networkFilters[Number(asset.chainId)]),
    [assets, networkFilters]
  );

  const tokenPriceMap = useTokenPriceMap(filteredAssets);
  const filteredAssetsWithPrice = useMemo(() => {
    return filteredAssets.map(asset => {
      let usdPrice = tokenPriceMap.get(asset.chainId, asset.token_address)
      return {
        ...asset,
        usdPrice,
        usdValue: Moralis.Units.FromWei(asset.balance, asset.decimals) * usdPrice
      }
    }).sort((a, b) => b.usdValue - a.usdValue)
  }, [tokenPriceMap, filteredAssets]);

  let {blocks} = useDateToBlock()
  const tokenHistoricPriceMap = useTokenHistoricPriceMap(filteredAssets, blocks);

  const assetsHistoricPrice = useMemo(() => {
    return filteredAssets.map(asset => {
      return {
        ...asset,
        historicPrices: tokenHistoricPriceMap.get(asset.chainId, asset.token_address)
      }
    })
  }, [tokenHistoricPriceMap, filteredAssets]);

  return (
    <div style={{width: "100vw", padding: "15px"}}>
      <Skeleton loading={!assets}>
        {Object.values(networkFilters).every(i => i)
            ? <HistoricTokenValueChart filters={tokenFilters} toggleFilter={toggleTokenFilter} assets={assetsHistoricPrice}/>
            : <TokenValueChart assets={filteredAssetsWithPrice}/>}

        <NetworkFilters filters={networkFilters} toggleFilter={toggleNetworkFilter} assets={filteredAssetsWithPrice}/>
        <BalanceTable toggleFilter={toggleTokenFilter} assets={filteredAssetsWithPrice}/>
      </Skeleton>
    </div>
  );
}

export default ERC20Balances;
