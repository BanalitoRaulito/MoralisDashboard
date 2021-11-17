import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import Moralis from "moralis";
import {c2} from "../../helpers/formatters";
import createColor from "create-color";
import {Card} from "antd";

const CustomTooltip = ({active, payload, label}) => {
  if (active && payload && payload.length) {
    return (
      <Card title={label}>
        {payload && payload.map(p => {
          return <p className="desc" style={{color: p.stroke}}>
            {p.name} {c2.format(p.value)}
          </p>
        })}
      </Card>
    );
  }

  return null;
};

function HistoricTokenValueChart({filters, toggleFilter, assets}) {
  let newAssets = []
  let filter = Object.entries(filters)
    .map(token => {
      if (token[1] !== true) {
        return null;
      }
      return token[0];
    })

  const interval = 1000 * 60 * 60 * 24 * 30;
  assets
    .filter(({symbol}) => !filter.find(f => f === symbol))
    .forEach(asset => {
      if (!asset.historicPrices || asset.historicPrices.length < 1) {
        return;
      }
      for (let i = 0; i <= 11; i++) {
        if (!asset.historicPrices[i]) {
          return;
        }
        let price = !asset.historicPrices[i]
          ? 0
          : Moralis.Units.FromWei(asset.balance, asset.decimals) * asset.historicPrices[i]

        newAssets[i] = {
          ...newAssets[i],
          [asset.symbol]: price,
          name: new Date(Date.now() - (interval * (8 - i))).toDateString()
        }
      }
    })

  return (
    <ResponsiveContainer width="100%" height="20%">
      <LineChart
        width={500}
        height={300}
        data={newAssets}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip content={<CustomTooltip/>}/>
        <Legend onClick={(value) => toggleFilter({symbol: value.value})}/>
        {(newAssets.length && Object.keys(newAssets[0]).map(key => {
          return key !== 'name' ?
            <Line type="monotone" dataKey={key} stroke={createColor([key])} activeDot={{r: 8}}/> : null;
        }))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default HistoricTokenValueChart;

