# `ethereum-boilerplate balance extencion`

> Balance extension is made to add functionality to Token Balances page

### `Previusly:`

![image](https://user-images.githubusercontent.com/78314301/139561267-7a1be577-ad13-4158-a7ea-aa4e7db358a3.png)

### `With extension:`

![image](https://i.ibb.co/4SPMvbq/Screenshot-2021-11-17-at-14-30-10.png)

### `hooks:`

- useDateToBlock.js - (get previous blocks)
- useTokenPriceMap.js - (get price for multiple accounts)
- useTokenHistoricPriceMap.js - (get historic price)
- useTokenFilters.js - (filter by token)
- useNetworkFilters.js - (filter by network)

### `components:`

- BalanceTable.jsx
- ERC20Balances.jsx
- NetworkFilters.jsx
- HistoricValueChart.jsx
- TokenValueChart.jsx

### `helpers:`

- retryPromise.js
