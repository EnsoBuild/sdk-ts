# WalletApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createApproveTransaction**](#createapprovetransaction) | **GET** /api/v1/wallet/approve | Returns transaction that approves your EnsoWallet to spend tokens|
|[**walletBalances**](#walletbalances) | **GET** /api/v1/wallet/balances | Returns all balances for a given wallet|

# **createApproveTransaction**
> WalletApproveTransaction createApproveTransaction()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let fromAddress: string; //Ethereum address of the wallet to send the transaction from (default to '0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
let tokenAddress: string; //ERC20 token address of the token to approve (default to '0x6b175474e89094c44da98b954eedeac495271d0f')
let amount: string; //Amount of tokens to approve in wei (default to '1000000000000000000000000000')
let chainId: number; //Chain ID of the network to execute the transaction on (optional) (default to 1)
let routingStrategy: 'ensowallet' | 'router' | 'delegate' | 'router-legacy' | 'delegate-legacy'; //Routing strategy to use (optional) (default to undefined)

const { status, data } = await apiInstance.createApproveTransaction(
    fromAddress,
    tokenAddress,
    amount,
    chainId,
    routingStrategy
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fromAddress** | [**string**] | Ethereum address of the wallet to send the transaction from | defaults to '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'|
| **tokenAddress** | [**string**] | ERC20 token address of the token to approve | defaults to '0x6b175474e89094c44da98b954eedeac495271d0f'|
| **amount** | [**string**] | Amount of tokens to approve in wei | defaults to '1000000000000000000000000000'|
| **chainId** | [**number**] | Chain ID of the network to execute the transaction on | (optional) defaults to 1|
| **routingStrategy** | [**&#39;ensowallet&#39; | &#39;router&#39; | &#39;delegate&#39; | &#39;router-legacy&#39; | &#39;delegate-legacy&#39;**]**Array<&#39;ensowallet&#39; &#124; &#39;router&#39; &#124; &#39;delegate&#39; &#124; &#39;router-legacy&#39; &#124; &#39;delegate-legacy&#39;>** | Routing strategy to use | (optional) defaults to undefined|


### Return type

**WalletApproveTransaction**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **walletBalances**
> Array<WalletBalance> walletBalances()


### Example

```typescript
import {
    WalletApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new WalletApi(configuration);

let eoaAddress: string; //Address of the eoa with which to associate the ensoWallet for balances (default to '0x93621DCA56fE26Cdee86e4F6B18E116e9758Ff11')
let useEoa: boolean; //If true returns balances for the provided eoaAddress, instead of the associated ensoWallet (default to false)
let chainId: number; //Chain ID of the network to execute the transaction on (optional) (default to 1)

const { status, data } = await apiInstance.walletBalances(
    eoaAddress,
    useEoa,
    chainId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eoaAddress** | [**string**] | Address of the eoa with which to associate the ensoWallet for balances | defaults to '0x93621DCA56fE26Cdee86e4F6B18E116e9758Ff11'|
| **useEoa** | [**boolean**] | If true returns balances for the provided eoaAddress, instead of the associated ensoWallet | defaults to false|
| **chainId** | [**number**] | Chain ID of the network to execute the transaction on | (optional) defaults to 1|


### Return type

**Array<WalletBalance>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

