import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Brush, Tooltip} from 'recharts';
import {scaleOrdinal} from 'd3-scale';
import {schemeCategory10} from 'd3-scale-chromatic';
import {c2} from "../../helpers/formatters";

const colors = scaleOrdinal(schemeCategory10).range();

const getPath = (x, y, width, height) => `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
          Z`;

const TriangleBar = (props) => {
  const {fill, x, y, width, height} = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill}/>;
};

TriangleBar.propTypes = {
  fill: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};

const CustomTooltip = ({active, payload, label}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-label" style={{color: payload[0].fill}}>
          {label} {c2.format(payload[0].value)}
        </p>
      </div>
    );
  }

  return null;
};

class CustomizedLabel extends PureComponent {
  render() {
    const {x, y, fill, value} = this.props;

    return (
      <text x={x} y={y} dy={-4} fill={fill} fontSize={10} textAnchor="middle">
        {c2.format(value)}
      </text>
    );
  }
}

function TokenValueChart({assets}) {
  return (
    <ResponsiveContainer width="100%" height="20%">
      <BarChart
        width={500}
        height={300}
        data={assets.filter(a => a.usdValue)}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="symbol"/>
        <YAxis/>
        <Tooltip content={<CustomTooltip/>}/>
        <Bar dataKey="usdValue" fill="#8884d8" shape={<TriangleBar/>} label={<CustomizedLabel/>}>
          {assets.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % 10]}/>
          ))}
        </Bar>
        <Brush/>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TokenValueChart;

