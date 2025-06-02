# ShortcutsApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**bundleControllerBundleShortcutTransaction**](#bundlecontrollerbundleshortcuttransaction) | **POST** /api/v1/shortcuts/bundle | Bundle a list of actions into a single tx|
|[**iporControllerIporShortcutTransaction**](#iporcontrolleriporshortcuttransaction) | **POST** /api/v1/shortcuts/static/ipor | Get transaction for IPOR shortcut|
|[**nontokenizedControllerRouteNontokenizedShorcutTransaction**](#nontokenizedcontrollerroutenontokenizedshorcuttransaction) | **GET** /api/v1/shortcuts/route/nontokenized | Best route from a token to nontokenized position|
|[**routerControllerPostRouteShortcutTransaction**](#routercontrollerpostrouteshortcuttransaction) | **POST** /api/v1/shortcuts/route | Best route from a token to another|
|[**routerControllerRouteShortcutTransaction**](#routercontrollerrouteshortcuttransaction) | **GET** /api/v1/shortcuts/route | Best route from a token to another|

# **bundleControllerBundleShortcutTransaction**
> BundleShortcutTransaction bundleControllerBundleShortcutTransaction(actionToBundle)


### Example

```typescript
import {
    ShortcutsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ShortcutsApi(configuration);

let fromAddress: string; //Ethereum address of the wallet to send the transaction from (default to '0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
let actionToBundle: Array<ActionToBundle>; //
let chainId: number; //Chain ID of the network to execute the transaction on (optional) (default to 1)
let referralCode: string; //Referral code that will be included in an on-chain event. (optional) (default to undefined)
let routingStrategy: 'delegate' | 'router'; //Routing strategy to use (optional) (default to 'delegate')
let receiver: string; //Ethereum address of the receiver of the tokenOut (optional) (default to undefined)
let spender: string; //Ethereum address of the spender of the tokenIn (optional) (default to undefined)
let ignoreAggregators: Array<string>; //A list of swap aggregators to be ignored from consideration (optional) (default to undefined)

const { status, data } = await apiInstance.bundleControllerBundleShortcutTransaction(
    fromAddress,
    actionToBundle,
    chainId,
    referralCode,
    routingStrategy,
    receiver,
    spender,
    ignoreAggregators
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **actionToBundle** | **Array<ActionToBundle>**|  | |
| **fromAddress** | [**string**] | Ethereum address of the wallet to send the transaction from | defaults to '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'|
| **chainId** | [**number**] | Chain ID of the network to execute the transaction on | (optional) defaults to 1|
| **referralCode** | [**string**] | Referral code that will be included in an on-chain event. | (optional) defaults to undefined|
| **routingStrategy** | [**&#39;delegate&#39; | &#39;router&#39;**]**Array<&#39;delegate&#39; &#124; &#39;router&#39;>** | Routing strategy to use | (optional) defaults to 'delegate'|
| **receiver** | [**string**] | Ethereum address of the receiver of the tokenOut | (optional) defaults to undefined|
| **spender** | [**string**] | Ethereum address of the spender of the tokenIn | (optional) defaults to undefined|
| **ignoreAggregators** | **Array&lt;string&gt;** | A list of swap aggregators to be ignored from consideration | (optional) defaults to undefined|


### Return type

**BundleShortcutTransaction**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **iporControllerIporShortcutTransaction**
> IporShortcutTransaction iporControllerIporShortcutTransaction(iporShortcutInput)


### Example

```typescript
import {
    ShortcutsApi,
    Configuration,
    IporShortcutInput
} from './api';

const configuration = new Configuration();
const apiInstance = new ShortcutsApi(configuration);

let fromAddress: string; //Ethereum address of the wallet to send the transaction from (default to '0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
let iporShortcutInput: IporShortcutInput; //
let chainId: number; //Chain ID of the network to execute the transaction on (optional) (default to 1)

const { status, data } = await apiInstance.iporControllerIporShortcutTransaction(
    fromAddress,
    iporShortcutInput,
    chainId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **iporShortcutInput** | **IporShortcutInput**|  | |
| **fromAddress** | [**string**] | Ethereum address of the wallet to send the transaction from | defaults to '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'|
| **chainId** | [**number**] | Chain ID of the network to execute the transaction on | (optional) defaults to 1|


### Return type

**IporShortcutTransaction**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **nontokenizedControllerRouteNontokenizedShorcutTransaction**
> RouteShortcutTransaction nontokenizedControllerRouteNontokenizedShorcutTransaction()


### Example

```typescript
import {
    ShortcutsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ShortcutsApi(configuration);

let fromAddress: string; //Ethereum address of the wallet to send the transaction from (default to '0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
let tokenIn: Array<string>; //Ethereum address of the token to swap from. For ETH, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee (default to undefined)
let positionOut: string; //Ethereum address of the position to receive (default to undefined)
let amountIn: Array<string>; //Amount of tokenIn to swap in wei (default to undefined)
let receiver: string; //Ethereum address of the receiver of the positionOut (default to undefined)
let chainId: number; //Chain ID of the network to execute the transaction on (optional) (default to 1)
let routingStrategy: 'delegate' | 'delegate-legacy'; //Routing strategy to use (optional) (default to undefined)
let referralCode: string; //Referral code that will be included in an on-chain event. (optional) (default to undefined)
let slippage: string; //Slippage in basis points (1/10000). If specified, minAmountOut should not be specified (optional) (default to '50')
let fee: Array<string>; //Fee in basis points (1/10000) for each amountIn value. Must be in range 0-100. If specified, this percentage of each amountIn value will be sent to feeReceiver (optional) (default to undefined)
let feeReceiver: string; //The Ethereum address that will receive the collected fee. Required if fee is provided (optional) (default to undefined)
let spender: string; //Ethereum address of the spender of the tokenIn (optional) (default to undefined)

const { status, data } = await apiInstance.nontokenizedControllerRouteNontokenizedShorcutTransaction(
    fromAddress,
    tokenIn,
    positionOut,
    amountIn,
    receiver,
    chainId,
    routingStrategy,
    referralCode,
    slippage,
    fee,
    feeReceiver,
    spender
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fromAddress** | [**string**] | Ethereum address of the wallet to send the transaction from | defaults to '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'|
| **tokenIn** | **Array&lt;string&gt;** | Ethereum address of the token to swap from. For ETH, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee | defaults to undefined|
| **positionOut** | [**string**] | Ethereum address of the position to receive | defaults to undefined|
| **amountIn** | **Array&lt;string&gt;** | Amount of tokenIn to swap in wei | defaults to undefined|
| **receiver** | [**string**] | Ethereum address of the receiver of the positionOut | defaults to undefined|
| **chainId** | [**number**] | Chain ID of the network to execute the transaction on | (optional) defaults to 1|
| **routingStrategy** | [**&#39;delegate&#39; | &#39;delegate-legacy&#39;**]**Array<&#39;delegate&#39; &#124; &#39;delegate-legacy&#39;>** | Routing strategy to use | (optional) defaults to undefined|
| **referralCode** | [**string**] | Referral code that will be included in an on-chain event. | (optional) defaults to undefined|
| **slippage** | [**string**] | Slippage in basis points (1/10000). If specified, minAmountOut should not be specified | (optional) defaults to '50'|
| **fee** | **Array&lt;string&gt;** | Fee in basis points (1/10000) for each amountIn value. Must be in range 0-100. If specified, this percentage of each amountIn value will be sent to feeReceiver | (optional) defaults to undefined|
| **feeReceiver** | [**string**] | The Ethereum address that will receive the collected fee. Required if fee is provided | (optional) defaults to undefined|
| **spender** | [**string**] | Ethereum address of the spender of the tokenIn | (optional) defaults to undefined|


### Return type

**RouteShortcutTransaction**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**400** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **routerControllerPostRouteShortcutTransaction**
> RouteShortcutTransaction routerControllerPostRouteShortcutTransaction(routeShortcutVariableInputs)


### Example

```typescript
import {
    ShortcutsApi,
    Configuration,
    RouteShortcutVariableInputs
} from './api';

const configuration = new Configuration();
const apiInstance = new ShortcutsApi(configuration);

let routeShortcutVariableInputs: RouteShortcutVariableInputs; //

const { status, data } = await apiInstance.routerControllerPostRouteShortcutTransaction(
    routeShortcutVariableInputs
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **routeShortcutVariableInputs** | **RouteShortcutVariableInputs**|  | |


### Return type

**RouteShortcutTransaction**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**400** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **routerControllerRouteShortcutTransaction**
> RouteShortcutTransaction routerControllerRouteShortcutTransaction()


### Example

```typescript
import {
    ShortcutsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ShortcutsApi(configuration);

let fromAddress: string; //Ethereum address of the wallet to send the transaction from (default to '0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
let amountIn: Array<string>; //Amount of tokenIn to swap in wei (default to undefined)
let tokenIn: Array<string>; //Ethereum address of the token to swap from. For ETH, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee (default to undefined)
let tokenOut: Array<string>; //Ethereum address of the token to swap to. For ETH, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee (default to undefined)
let chainId: number; //Chain ID of the network to execute the transaction on (optional) (default to 1)
let routingStrategy: 'ensowallet' | 'router' | 'delegate' | 'router-legacy' | 'delegate-legacy'; //Routing strategy to use (optional) (default to undefined)
let toEoa: boolean; //Flag that indicates if gained tokenOut should be sent to EOA (optional) (default to undefined)
let receiver: string; //Ethereum address of the receiver of the tokenOut (optional) (default to undefined)
let spender: string; //Ethereum address of the spender of the tokenIn (optional) (default to undefined)
let minAmountOut: Array<string>; //Minimum amount out in wei. If specified, slippage should not be specified (optional) (default to undefined)
let slippage: string; //Slippage in basis points (1/10000). If specified, minAmountOut should not be specified (optional) (default to '50')
let fee: Array<string>; //Fee in basis points (1/10000) for each amountIn value. Must be in range 0-100. If specified, this percentage of each amountIn value will be sent to feeReceiver (optional) (default to undefined)
let feeReceiver: string; //The Ethereum address that will receive the collected fee. Required if fee is provided (optional) (default to undefined)
let ignoreAggregators: Array<string>; //A list of swap aggregators to be ignored from consideration (optional) (default to undefined)
let ignoreStandards: Array<string>; //A list of standards to be ignored from consideration (optional) (default to undefined)
let referralCode: string; //Referral code that will be included in an on-chain event. (optional) (default to undefined)
let destinationChainId: number; //Chain ID of the network to bridge to and receive tokenOut (optional) (default to undefined)

const { status, data } = await apiInstance.routerControllerRouteShortcutTransaction(
    fromAddress,
    amountIn,
    tokenIn,
    tokenOut,
    chainId,
    routingStrategy,
    toEoa,
    receiver,
    spender,
    minAmountOut,
    slippage,
    fee,
    feeReceiver,
    ignoreAggregators,
    ignoreStandards,
    referralCode,
    destinationChainId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fromAddress** | [**string**] | Ethereum address of the wallet to send the transaction from | defaults to '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'|
| **amountIn** | **Array&lt;string&gt;** | Amount of tokenIn to swap in wei | defaults to undefined|
| **tokenIn** | **Array&lt;string&gt;** | Ethereum address of the token to swap from. For ETH, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee | defaults to undefined|
| **tokenOut** | **Array&lt;string&gt;** | Ethereum address of the token to swap to. For ETH, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee | defaults to undefined|
| **chainId** | [**number**] | Chain ID of the network to execute the transaction on | (optional) defaults to 1|
| **routingStrategy** | [**&#39;ensowallet&#39; | &#39;router&#39; | &#39;delegate&#39; | &#39;router-legacy&#39; | &#39;delegate-legacy&#39;**]**Array<&#39;ensowallet&#39; &#124; &#39;router&#39; &#124; &#39;delegate&#39; &#124; &#39;router-legacy&#39; &#124; &#39;delegate-legacy&#39;>** | Routing strategy to use | (optional) defaults to undefined|
| **toEoa** | [**boolean**] | Flag that indicates if gained tokenOut should be sent to EOA | (optional) defaults to undefined|
| **receiver** | [**string**] | Ethereum address of the receiver of the tokenOut | (optional) defaults to undefined|
| **spender** | [**string**] | Ethereum address of the spender of the tokenIn | (optional) defaults to undefined|
| **minAmountOut** | **Array&lt;string&gt;** | Minimum amount out in wei. If specified, slippage should not be specified | (optional) defaults to undefined|
| **slippage** | [**string**] | Slippage in basis points (1/10000). If specified, minAmountOut should not be specified | (optional) defaults to '50'|
| **fee** | **Array&lt;string&gt;** | Fee in basis points (1/10000) for each amountIn value. Must be in range 0-100. If specified, this percentage of each amountIn value will be sent to feeReceiver | (optional) defaults to undefined|
| **feeReceiver** | [**string**] | The Ethereum address that will receive the collected fee. Required if fee is provided | (optional) defaults to undefined|
| **ignoreAggregators** | **Array&lt;string&gt;** | A list of swap aggregators to be ignored from consideration | (optional) defaults to undefined|
| **ignoreStandards** | **Array&lt;string&gt;** | A list of standards to be ignored from consideration | (optional) defaults to undefined|
| **referralCode** | [**string**] | Referral code that will be included in an on-chain event. | (optional) defaults to undefined|
| **destinationChainId** | [**number**] | Chain ID of the network to bridge to and receive tokenOut | (optional) defaults to undefined|


### Return type

**RouteShortcutTransaction**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**400** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

