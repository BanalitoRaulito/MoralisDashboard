const RETRY_COUNT = 4
const TIMEOUT = 20000

export const retryPromise = cp => {
  let retries = 1
  const f = () => {
    retries++;
    return (
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error("timeout"))
        }, TIMEOUT * retries)
        cp().then(resolve, reject)
      })
        .catch(e => {
          if (retries <= RETRY_COUNT) {
            return f();
          }
        })
    );
  }

  return f();
}
