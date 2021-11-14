import {Button} from "antd";
import {networkConfigs} from "../helpers/networks";
import {AvaxLogo, BSCLogo, ETHLogo, PolygonLogo} from "./Chains/Logos";

const styles = {
  button: {
    margin: "20px",
    marginLeft: "0px",
  }
};

const icons = {
  1: <ETHLogo/>,
  56: <BSCLogo/>,
  137: <PolygonLogo/>,
  43114: <AvaxLogo/>,
}

const Filters = ({filters, toggleFilter, assets}) => {
  return Object
    .values(networkConfigs)
    .map(({chainId, currencySymbol}) => {
      let assetCount = assets.filter(asset => asset.chainId == chainId).length

      return <Button
        style={styles.button}
        key={chainId}
        onClick={() => {
          toggleFilter(chainId);
        }}
        ghost={!filters[chainId]}
        type="primary"
        icon={icons[chainId]}
      >
        {currencySymbol + ' ' + assetCount}
      </Button>
    })
}

export default Filters;
