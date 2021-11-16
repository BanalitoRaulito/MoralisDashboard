import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush} from 'recharts';
import Moralis from "moralis";
import {c2} from "../../helpers/formatters";
import {scaleOrdinal} from "d3-scale";
import {schemeCategory10} from "d3-scale-chromatic";
import {Card} from "antd";

const colors = scaleOrdinal(schemeCategory10).range();

const CustomTooltip = ({active, payload, label}) => {
  if (active && payload && payload.length) {
    return (
      <Card>
        <p>{label}</p>
        {payload && payload.map(p => {
          return <p className="desc" style={{color: p.stroke}}>{p.name} {c2.format(p.value)}</p>
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

  assets
    .filter(({symbol}) => !filter.find(f => f === symbol))
    .forEach(asset => {
      if (!asset.historicPrices || asset.historicPrices.length < 1) {
        return;
      }
      for (let i = 0; i < 9; i++) {
        if (!asset.historicPrices[i]) {
          return;
        }
        let price = !asset.historicPrices[i]
          ? 0
          : Moralis.Units.FromWei(asset.balance, asset.decimals) * asset.historicPrices[i]
        newAssets[i] = {
          ...newAssets[i],
          [asset.symbol]: price,
          name: i
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
        {(newAssets.length && Object.keys(newAssets[0]).map((key, index) => {
          return key !== 'name' ?
            <Line type="monotone" dataKey={key} stroke={colors[index % 10]} activeDot={{r: 8}}/> : null;
        }))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default HistoricTokenValueChart;
