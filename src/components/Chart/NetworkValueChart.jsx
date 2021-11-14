import React from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush} from 'recharts';
import Moralis from "moralis";

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function NetworkValueChart({assets}) {
  let newAssets = []
  assets.forEach(asset => {
    if (!asset.historicPrices || asset.historicPrices.length !== 9) {return;}
    for (let i = 0; i < 9; i++) {
      if (!asset.historicPrices[i]) {return;}
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
        <Tooltip/>
        <Legend/>
        {newAssets.length && Object.keys(newAssets[0]).map((key) => <Line type="monotone" dataKey={key} stroke="#8884d8" activeDot={{r: 8}}/>)}
        <Brush/>
      </LineChart>
    </ResponsiveContainer>
  );
}

export default NetworkValueChart;

