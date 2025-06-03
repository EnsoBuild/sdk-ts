## @ensobuild/shortcuts-sdk@0.0.1

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install @ensobuild/shortcuts-sdk@0.0.1 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://localhost:3000*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*MetadataApi* | [**aggregators**](docs/MetadataApi.md#aggregators) | **GET** /api/v1/aggregators | Returns aggregators supported by the API (can be controled via disableAggregators param)
*MetadataApi* | [**findAllProtocols**](docs/MetadataApi.md#findallprotocols) | **GET** /api/v1/protocols | Returns projects and relevant protocols available to use
*MetadataApi* | [**getPrice**](docs/MetadataApi.md#getprice) | **GET** /api/v1/prices/{chainId}/{address} | Returns price for a token
*MetadataApi* | [**getPrices**](docs/MetadataApi.md#getprices) | **GET** /api/v1/prices/{chainId} | Returns price for multiple tokens
*MetadataApi* | [**getVolume**](docs/MetadataApi.md#getvolume) | **GET** /api/v1/volume/{chainId} | Returns chain USD volume and total transactions
*MetadataApi* | [**networks**](docs/MetadataApi.md#networks) | **GET** /api/v1/networks | Returns networks supported by the API
*MetadataApi* | [**nontokenizedPositions**](docs/MetadataApi.md#nontokenizedpositions) | **GET** /api/v1/nontokenized | Returns nontokenized positions and their details
*MetadataApi* | [**tokens**](docs/MetadataApi.md#tokens) | **GET** /api/v1/tokens | Returns tokens and their details
*ProjectsApi* | [**getStandardsByProject**](docs/ProjectsApi.md#getstandardsbyproject) | **GET** /api/v1/projects/{project}/protocols | Returns protocols available by project
*ProjectsApi* | [**projects**](docs/ProjectsApi.md#projects) | **GET** /api/v1/projects | Returns the overarching projects or platforms associated with the available projects
*ShortcutsApi* | [**bundleShortcutTransaction**](docs/ShortcutsApi.md#bundleshortcuttransaction) | **POST** /api/v1/shortcuts/bundle | Bundle a list of actions into a single tx
*ShortcutsApi* | [**iporShortcutTransaction**](docs/ShortcutsApi.md#iporshortcuttransaction) | **POST** /api/v1/shortcuts/static/ipor | Get transaction for IPOR shortcut
*ShortcutsApi* | [**postRouteShortcutTransaction**](docs/ShortcutsApi.md#postrouteshortcuttransaction) | **POST** /api/v1/shortcuts/route | Best route from a token to another
*ShortcutsApi* | [**routeNontokenizedShorcutTransaction**](docs/ShortcutsApi.md#routenontokenizedshorcuttransaction) | **GET** /api/v1/shortcuts/route/nontokenized | Best route from a token to nontokenized position
*ShortcutsApi* | [**routeShortcutTransaction**](docs/ShortcutsApi.md#routeshortcuttransaction) | **GET** /api/v1/shortcuts/route | Best route from a token to another
*StandardsApi* | [**findAllActions**](docs/StandardsApi.md#findallactions) | **GET** /api/v1/actions | Returns actions available to use in bundle shortcuts
*StandardsApi* | [**getActionsBySlug**](docs/StandardsApi.md#getactionsbyslug) | **GET** /api/v1/actions/{slug} | Returns actions available to use in bundle shortcuts for a given protocol
*StandardsApi* | [**getProtocolBySlug**](docs/StandardsApi.md#getprotocolbyslug) | **GET** /api/v1/standards/{slug} | Returns a standard by slug
*StandardsApi* | [**standards**](docs/StandardsApi.md#standards) | **GET** /api/v1/standards | Returns standards and methods available to use in bundle shortcuts
*WalletApi* | [**createApproveTransaction**](docs/WalletApi.md#createapprovetransaction) | **GET** /api/v1/wallet/approve | Returns transaction that approves your EnsoWallet to spend tokens
*WalletApi* | [**walletBalances**](docs/WalletApi.md#walletbalances) | **GET** /api/v1/wallet/balances | Returns all balances for a given wallet


### Documentation For Models

 - [Action](docs/Action.md)
 - [ActionToBundle](docs/ActionToBundle.md)
 - [BundleShortcutTransaction](docs/BundleShortcutTransaction.md)
 - [ConnectedNetwork](docs/ConnectedNetwork.md)
 - [Hop](docs/Hop.md)
 - [IporShortcutInput](docs/IporShortcutInput.md)
 - [IporShortcutTransaction](docs/IporShortcutTransaction.md)
 - [Network](docs/Network.md)
 - [NonTokenizedModel](docs/NonTokenizedModel.md)
 - [NontokenizedPositions200Response](docs/NontokenizedPositions200Response.md)
 - [PaginatedResult](docs/PaginatedResult.md)
 - [PaginationMeta](docs/PaginationMeta.md)
 - [PositionModel](docs/PositionModel.md)
 - [Price](docs/Price.md)
 - [Project](docs/Project.md)
 - [Protocol](docs/Protocol.md)
 - [ProtocolModel](docs/ProtocolModel.md)
 - [RouteShortcutTransaction](docs/RouteShortcutTransaction.md)
 - [RouteShortcutVariableInputs](docs/RouteShortcutVariableInputs.md)
 - [Standard](docs/Standard.md)
 - [StandardAction](docs/StandardAction.md)
 - [TokenModel](docs/TokenModel.md)
 - [Tokens200Response](docs/Tokens200Response.md)
 - [Transaction](docs/Transaction.md)
 - [WalletApproveTransaction](docs/WalletApproveTransaction.md)
 - [WalletBalance](docs/WalletBalance.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="bearer"></a>
### bearer

- **Type**: Bearer authentication (apiKey)

