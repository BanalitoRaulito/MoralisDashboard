import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush} from 'recharts';
import Moralis from "moralis";
import {c2} from "../../helpers/formatters";

const CustomTooltip = ({active, payload, label}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p>
        {payload && payload.map(p => <p className="desc">{p.name} {c2.format(p.value)}</p>)}
      </div>
    );
  }

  return null;
};

function HistoricTokenValueChart({assets}) {
  let newAssets = []
  assets.forEach(asset => {
    if (!asset.historicPrices || asset.historicPrices.length !== 9) {
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
  console.log(newAssets)

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
        <Legend/>
        {(newAssets.length && Object.keys(newAssets[0]).map((key) => {
          return key !== 'name' ? <Line type="monotone" dataKey={key} stroke="#8884d8" activeDot={{r: 8}}/> : null;
        }))}
        <Brush/>
      </LineChart>
    </ResponsiveContainer>
  );
}

export default HistoricTokenValueChart;

