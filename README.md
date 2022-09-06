# Tests
The project includes E2E tests for StakeWise app.


### Initial start
First you need to install all packages and generate types:

`npm install`


### How to add a new contract
After contract abi is added to `src/contracts/abis` run:
`npm run typechain` to generate contract types


### How to run all tests
`npm run e2e`


### How to run tests from a particular file
`npm run e2e ethereumStaking`


### How to run a particular test
This command will run one or several tests that matches test name:

`npm run e2e:test 'can reinvest all rETH'`
