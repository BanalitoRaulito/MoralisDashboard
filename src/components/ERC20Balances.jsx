import {useERC20Balances} from "../hooks/useERC20Balances";
import {Skeleton} from "antd";
import {useMemo} from "react";
import { useFilters } from "hooks/useFilters";
import BalanceTable from "./BalanceTable";
import Filters from "./Filters";
import { useTokenPriceMap } from "hooks/useTokenPriceMap";
import {useDateToBlock} from "../hooks/useDateToBlock";

const styles = {
  title: {
    fontSize: "30px",
    fontWeight: "700",
  },
};

function ERC20Balances() {
  const {filters, toggleFilter} = useFilters();
  const {assets} = useERC20Balances();
  const filteredAssets = useMemo(
    () => assets.filter(asset => filters[Number(asset.chainId)]),
    [assets, filters]
  );

  const tokenPriceMap = useTokenPriceMap(assets);
  const filteredAssetsWithPrice = useMemo(() => {
    return filteredAssets.map(asset => ({
      ...asset,
      usdPrice: tokenPriceMap.get(asset.chainId, asset.token_address)
    }))
  }, [tokenPriceMap, filteredAssets]);

  const date = useDateToBlock()

  return (
    <div style={{width: "65vw", padding: "15px"}}>
      <h1 style={styles.title}>💰Token Balances</h1>
      <Skeleton loading={!assets}>
        <Filters filters={filters} toggleFilter={toggleFilter}/>
        <BalanceTable assets={filteredAssetsWithPrice}/>
      </Skeleton>
    </div>
  );
}

export default ERC20Balances;
