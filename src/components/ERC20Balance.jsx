import {useMoralis} from "react-moralis";
import {useERC20Balances} from "../hooks/useERC20Balances";
import {Button, Skeleton, Table} from "antd";
import {getEllipsisTxt} from "../helpers/formatters";
import {networkConfigs, disabledNetworks} from "../helpers/networks";
import {useMemo, useState} from "react";

const styles = {
  title: {
    fontSize: "30px",
    fontWeight: "700",
  },
};

const BalanceTable = ({assets}) => {
  const {Moralis} = useMoralis();

  const columns = [
    {
      title: "",
      dataIndex: "logo",
      key: "logo",
      render: (logo) => (
        <img
          src={logo || "https://etherscan.io/images/main/empty-token.png"}
          alt="nologo"
          width="28px"
          height="28px"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
    },
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
      render: (symbol) => symbol,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (value, item) =>
        parseFloat(Moralis.Units.FromWei(value, item.decimals).toFixed(6)),
    },
    {
      title: "Address",
      dataIndex: "token_address",
      key: "token_address",
      render: (address) => getEllipsisTxt(address, 5),
    },
  ];

  return (
    <Table
      dataSource={assets}
      columns={columns}
      rowKey={(record) => {
        return record.token_address;
      }}
    />
  );
}

const useFilters = () => {
  const [filters, setFilters] = useState(
    Object.fromEntries(
      Object.keys(networkConfigs)
        .filter(chainId => !disabledNetworks.includes(chainId))
        .map(chain => [chain, true])
    )
  );

  return {filters, setFilters}
}

const FilterButtons = ({filters, setFilters}) =>
  Object.entries(networkConfigs)
    .filter(chain => !disabledNetworks.includes(chain[0]))
    .map(ds => {
      const {chainKey, currencySymbol} = ds[1];
      return <Button
        key={currencySymbol}
        onClick={() => {
          console.log(filters);
          setFilters({
            ...filters,
            [chainKey]: !filters[chainKey],
          });
        }}
        ghost={!filters[chainKey]}
      >
        {currencySymbol}
      </Button>
    })


function ERC20Balance() {
  const {filters, setFilters} = useFilters();
  const {assets} = useERC20Balances();
  const filteredAssets = useMemo(
    () => assets.filter(asset => filters[asset.chainId]),
    [assets, filters]
  )

  return (
    <div style={{width: "65vw", padding: "15px"}}>
      <h1 style={styles.title}>💰Token Balances</h1>
      <Skeleton loading={!assets}>
        <FilterButtons filters={filters} setFilters={setFilters}/>
        <BalanceTable assets={filteredAssets}/>
      </Skeleton>
    </div>
  );
}

export default ERC20Balance;
