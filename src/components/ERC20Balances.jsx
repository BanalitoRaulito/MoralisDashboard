import {useERC20Balances} from "../hooks/useERC20Balances";
import {Skeleton} from "antd";
import {useMemo} from "react";
import {useFilters} from "hooks/useFilters";
import BalanceTable from "./BalanceTable";
import Filters from "./Filters";
import {useTokenPriceMap} from "hooks/useTokenPriceMap";
import Moralis from "moralis";
import TokenValueChart from "./Chart/TokenValueChart";
import NetworkValueChart from "./Chart/NetworkValueChart";
import {useTokenHistoricPriceMap} from "../hooks/useTokenHistoricPriceMap";
import {useDateToBlock} from "../hooks/useDateToBlock";

function ERC20Balances() {
  const {filters, toggleFilter} = useFilters();
  const {assets} = useERC20Balances();
  const filteredAssets = useMemo(
    () => assets.filter(asset => filters[Number(asset.chainId)]),
    [assets, filters]
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

  let blocks = useDateToBlock()
  console.log(blocks)

  // const tokenHistoricPriceMap = useTokenHistoricPriceMap(filteredAssets, blocks);
  // const assetsHistoricPrice = useMemo(() => {
  //   return filteredAssets.map(asset => {
  //     return {
  //       ...asset,
  //       historicPrices: tokenHistoricPriceMap.get(asset.chainId, asset.token_address)
  //     }
  //   })
  // }, [tokenHistoricPriceMap, filteredAssets]);

  return (
    <div style={{width: "100vw", padding: "15px"}}>
      <Skeleton loading={!assets}>
        {
          Object.values(filters).every(i => i)
            ? <NetworkValueChart />
            : <TokenValueChart assets={filteredAssetsWithPrice}/>
        }
        <Filters filters={filters} toggleFilter={toggleFilter} assets={filteredAssetsWithPrice}/>
        <BalanceTable assets={filteredAssetsWithPrice}/>
      </Skeleton>
    </div>
  );
}

export default ERC20Balances;
