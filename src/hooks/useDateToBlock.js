import { useEffect, useRef } from "react";
import { useState } from "react"
import {useMoralis, useMoralisWeb3Api, useMoralisWeb3ApiCall} from "react-moralis";
import {getWrappedNative} from "../helpers/networks";

export const useDateToBlock = () => {
  const { native } = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();
  let dateNow = Date.now()

  const [dates, setDates] = useState(() => {
    let dateArray = [Date.now().toString()]
    for (let i = 0; i < 30; i++) {
      dateNow -= 1000*60*60*24;
      dateArray.push(dateNow.toString())
    }
    return dateArray;
  });

  //let block = useMoralisWeb3ApiCall(native.getDateToBlock, {chain: 'eth', date: dates[3]});
  console.log(block)
  dates.forEach(date => {
    let block = useMoralisWeb3ApiCall(native.getDateToBlock, {chain: 'eth', date: dates[3]})
  })

  useEffect(() => {
    if (!isInitialized) { return; }
    dates.forEach(date => {
      native.getDateToBlock({chain: 'eth', date: date.toString()})
        .then(block => {
          console.log('block', block)
        })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  // {
  //   'eth': [
  //     {date, blockNr},
  //     {date, blockNr},
  //   ],
  // }
  return dates;
}
