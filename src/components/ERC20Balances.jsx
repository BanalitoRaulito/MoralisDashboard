import {useERC20Balances} from "../hooks/useERC20Balances";
import {Skeleton} from "antd";
import {useMemo} from "react";
import {useFilters} from "hooks/useFilters";
import BalanceTable from "./BalanceTable";
import Filters from "./Filters";
import {useTokenPriceMap} from "hooks/useTokenPriceMap";
import {useDateToBlock} from "../hooks/useDateToBlock";
import BalanceChart from "./Chart/BalanceChart";
import TokenChart from "./Chart/TokenChart";
import Moralis from "moralis";

function ERC20Balances() {
  const {filters, toggleFilter} = useFilters();
  const {assets} = useERC20Balances();
  const filteredAssets = useMemo(
    () => assets.filter(asset => filters[Number(asset.chainId)]),
    [assets, filters]
  );

  const tokenPriceMap = useTokenPriceMap(assets);
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

  const date = useDateToBlock()

  return (
    <div style={{width: "100vw", padding: "15px"}}>
      <TokenChart assets={filteredAssetsWithPrice}/>

      <Skeleton loading={!assets}>
        <Filters filters={filters} toggleFilter={toggleFilter} assets={filteredAssetsWithPrice}/>
        <BalanceTable assets={filteredAssetsWithPrice}/>
      </Skeleton>
    </div>
  );
}

export default ERC20Balances;
