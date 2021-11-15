import {Button} from "antd";
import {networkConfigs} from "../../helpers/networks";
import {AvaxLogo, BSCLogo, ETHLogo, PolygonLogo} from "../Chains/Logos";

const styles = {
  button: {
    margin: "20px",
    marginLeft: "0px",
    height: "60px",
    fontSize: "35px",
  },
  text: {
    marginLeft: "10px",
    fontSize: "35px",
  }
};

const icons = {
  1: <ETHLogo/>,
  56: <BSCLogo/>,
  137: <PolygonLogo/>,
  43114: <AvaxLogo/>,
}

const NetworkFilters = ({filters, toggleFilter, assets}) => {
  return Object
    .values(networkConfigs)
    .map(({chainId}) => {
      let assetCount = assets.filter(asset => asset.chainId == chainId).length

      return <Button
        style={styles.button}
        key={chainId}
        onClick={() => {
          toggleFilter(chainId);
        }}
        ghost={!filters[chainId]}
        icon={icons[chainId]}
      >
        <span style={styles.text}>{assetCount}</span>
      </Button>
    })
}

export default NetworkFilters;
