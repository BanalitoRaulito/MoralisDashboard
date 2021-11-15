const RETRY_COUNT = 3
const TIMEOUT = 15000

export const retryPromise = cp => {
  let retries = 0
  const f = () => {
    retries++;
    return (
      new Promise((resolve, reject) => {
        setTimeout(() => { reject(new Error("timeout")) }, TIMEOUT);
        cp().then(resolve, reject);
      })
      .catch(e => {
        if (retries <= RETRY_COUNT) {
          console.warn(
            `Promise failed, attempting retry number ${retries}` +
            (e?.message === "timeout"
              ? " and it was a timeout"
              : "")
          )
          return f();
        } else {
          console.error(`Failed promise after ${RETRY_COUNT} retries`);
        }
      })
    );
  }

  return f();
}