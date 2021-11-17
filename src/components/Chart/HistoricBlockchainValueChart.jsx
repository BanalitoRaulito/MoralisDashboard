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

const DATA_POINT_NUM = 9
const interval = 1000 * 60 * 60 * 24 * 30;

function HistoricBlockchainValueChart({filters, toggleFilter, assets}) {
  const dataPoints = (
    assets
      .filter(({symbol}) => !filters[symbol])
      .reduce((dataPoints, asset) => {
          if (!asset.historicPrices || !asset.historicPrices.length) {
            return dataPoints;
          }

          for (let i = 0; i < DATA_POINT_NUM; i++) {
            if (!asset.historicPrices[i]) {
              continue;
            }

            const price = (
              Moralis.Units.FromWei(
                asset.balance,
                asset.decimals
              ) * asset.historicPrices[i]
            );
            if (!dataPoints[i][asset.chainId]) {
              dataPoints[i][asset.chainId] = 0;
            }
            dataPoints[i][asset.chainId] += price;
          }

          return dataPoints;
        },
        Array(DATA_POINT_NUM).fill().map((_, i) => ({
          name: new Date(Date.now() - (interval * (8 - i))).toDateString()
        })),
      )
  );

  console.log(dataPoints);
  return (
    <ResponsiveContainer width="100%" height="15%">
      <LineChart
        width={500}
        height={300}
        data={dataPoints}
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
        {(dataPoints.length && Object.keys(dataPoints[0]).map(key =>
          key !== 'name'
            ? <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={createColor([key])}
              activeDot={{r: 8}}
            />
            : null
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default HistoricBlockchainValueChart;

