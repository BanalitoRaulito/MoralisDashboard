import {useERC20Balances} from "../hooks/useERC20Balances";
import {Col, Input, Row, Skeleton} from "antd";
import React, {useEffect, useMemo, useState} from "react";
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

const styles = {
  title: {
    fontSize: "30px",
    fontWeight: "700",
  },
  search: {
    height: "60px",
    marginTop: "20px",
  },
  container: {
    width: "65vw",
    padding: "15px",
    position: "relative",
  },
};

function ERC20Balances() {
  const [search, setSearch] = useState("");

  const {networkFilters, toggleNetworkFilter} = useNetworkFilters();
  const {tokenFilters, toggleTokenFilter} = useTokenFilters();

  let blocks = useDateToBlock()

  const {assets} = useERC20Balances({ address: search });
  const filteredAssets = useMemo(
    () => assets.filter(asset => networkFilters[Number(asset.chainId)]),
    [assets, networkFilters]
  );

  const tokenPriceMap = useTokenPriceMap(filteredAssets);
  const filteredAssetsWithPrice = useMemo(() =>
    filteredAssets.map(asset => {
      let usdPrice = tokenPriceMap.get(asset.chainId, asset.token_address)
      return {
        ...asset,
        usdPrice,
        usdValue: Moralis.Units.FromWei(asset.balance, asset.decimals) * usdPrice
      }
    }).sort((a, b) => b.usdValue - a.usdValue),
    [tokenPriceMap, filteredAssets]
  );

  const tokenHistoricPriceMap = useTokenHistoricPriceMap(filteredAssetsWithPrice, blocks);
  const filteredAssetsWithHistoricPrices = useMemo(() =>
    filteredAssetsWithPrice.map(asset => ({
      ...asset,
      historicPrices: tokenHistoricPriceMap.get(asset.chainId, asset.token_address)
    })).sort((a, b) => b.usdValue - a.usdValue),
    [tokenHistoricPriceMap, filteredAssetsWithPrice]
  );

  const isHistoricChart = Object.values(networkFilters).every(i => i);
  useEffect(() => {
    document.title = isHistoricChart ? 'Historic token values' : 'Current token values'
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        💰 {document.title}
      </h1>

      <Skeleton loading={!assets}>
        {isHistoricChart
            ? <HistoricTokenValueChart
                filters={tokenFilters}
                toggleFilter={toggleTokenFilter}
                assets={filteredAssetsWithHistoricPrices}
              />
            : <TokenValueChart assets={filteredAssetsWithPrice}/>}
        <Input.Group size="large">
          <Row gutter={8}>
            <Col span={20}>
              <NetworkFilters
                filters={networkFilters}
                toggleFilter={toggleNetworkFilter}
                assets={filteredAssetsWithPrice}
              />
            </Col>
            <Col span={4}>
              <Input
                placeholder="Account address"
                style={styles.search}
                onChange={event => setSearch(event.target.value)}
              />
            </Col>
          </Row>
        </Input.Group>

        <BalanceTable toggleFilter={toggleTokenFilter} assets={filteredAssetsWithPrice}/>
      </Skeleton>
    </div>
  );
}

export default ERC20Balances;
