import {Button} from "antd";
import {networkConfigs} from "../helpers/networks";

const Filters = ({filters, toggleFilter}) =>
  Object
    .values(networkConfigs)
    .map(({chainId, currencySymbol}) =>
      <Button
        key={chainId}
        onClick={() => {
          toggleFilter(chainId);
        }}
        ghost={!filters[chainId]}
      >
        {currencySymbol}
      </Button>
    )

export default Filters;