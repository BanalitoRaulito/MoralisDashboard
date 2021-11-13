import {useERC20Balances} from "../hooks/useERC20Balances";
import {Skeleton} from "antd";
import {useMemo} from "react";
import { useFilters } from "hooks/useFilters";
import BalanceTable from "./BalanceTable";
import Filters from "./Filters";

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

  return (
    <div style={{width: "65vw", padding: "15px"}}>
      <h1 style={styles.title}>💰Token Balances</h1>
      <Skeleton loading={!assets}>
        <Filters filters={filters} toggleFilter={toggleFilter}/>
        <BalanceTable assets={filteredAssets}/>
      </Skeleton>
    </div>
  );
}

export default ERC20Balances;
