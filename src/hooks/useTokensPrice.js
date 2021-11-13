import { getWrappedNative } from "helpers/networks";
import { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { c2, tokenValueTxt } from "../helpers/formatters";

const IsNative = (address) =>
  address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

const useTokensPrice = (options) => {
  const { token } = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();
  const [tokensPrice, setTokensPrice] = useState();

  useEffect(() => {
    if (!options || !isInitialized) return null;
    fetchTokensPrice(options).then((price) => {
      price.usdPrice = c2.format(price.usdPrice);
      const { value, decimals, symbol } = price.nativePrice;
      price.nativePrice = tokenValueTxt(value, decimals, symbol);
      setTokensPrice(price);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, options]);

  const fetchTokensPrice = async (tokens) => {
    tokens
      .forEach(tokenData => {
        const { chain, address } = tokenData;
        const tokenAddress = IsNative(address) ? getWrappedNative(chain) : address;
        console.log("chain", chain, "address", address,"tokenAddress", tokenAddress);

        return token
          .getTokenPrice({ chain, address: tokenAddress })
          .then((result) => {
            console.log(result, 'hey')
          });
      })
  };
  return { fetchTokensPrice, tokensPrice };
};

export default useTokensPrice;
