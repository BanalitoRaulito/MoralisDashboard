import {useMoralis} from "react-moralis";
import {Table} from "antd";
import {c2, getEllipsisTxt} from "../helpers/formatters";
import createColor from "create-color";

const BalanceTable = ({toggleFilter, assets}) => {
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
      render: (symbol) => <span style={{color: createColor([symbol])}}>{symbol}</span>,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (value, item) =>
        parseFloat(Moralis.Units.FromWei(value, item.decimals).toFixed(6)),
    },
    {
      title: "USD Value",
      dataIndex: "usdPrice",
      key: "usdPrice",
      render: (usdPrice, item) => {
        return usdPrice ? c2.format(Moralis.Units.FromWei(item.balance, item.decimals) * usdPrice) : 'Loading...';
      },
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
      onRow={token => ({onClick: () => {toggleFilter(token)}})}
      onHeaderRow={(columns, index) => {
        return {
          onClick: () => {alert('sort ' + columns  + ' ' + index)}, // click header row
        };
      }}
    />
  );
}

export default BalanceTable;
