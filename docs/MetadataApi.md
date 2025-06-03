# MetadataApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**aggregators**](#aggregators) | **GET** /api/v1/aggregators | Returns aggregators supported by the API (can be controled via disableAggregators param)|
|[**findAllProtocols**](#findallprotocols) | **GET** /api/v1/protocols | Returns projects and relevant protocols available to use|
|[**getPrice**](#getprice) | **GET** /api/v1/prices/{chainId}/{address} | Returns price for a token|
|[**getPrices**](#getprices) | **GET** /api/v1/prices/{chainId} | Returns price for multiple tokens|
|[**getVolume**](#getvolume) | **GET** /api/v1/volume/{chainId} | Returns chain USD volume and total transactions|
|[**networks**](#networks) | **GET** /api/v1/networks | Returns networks supported by the API|
|[**nontokenizedPositions**](#nontokenizedpositions) | **GET** /api/v1/nontokenized | Returns nontokenized positions and their details|
|[**tokens**](#tokens) | **GET** /api/v1/tokens | Returns tokens and their details|

# **aggregators**
> Array<string> aggregators()


### Example

```typescript
import {
    MetadataApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new MetadataApi(configuration);

const { status, data } = await apiInstance.aggregators();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<string>**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Returns a list of aggregators |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **findAllProtocols**
> Array<ProtocolModel> findAllProtocols()


### Example

```typescript
import {
    MetadataApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new MetadataApi(configuration);

let chainId: any; //Chain ID of the network to search for (optional) (default to undefined)
let slug: any; //slug of the project to search for (optional) (default to undefined)

const { status, data } = await apiInstance.findAllProtocols(
    chainId,
    slug
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chainId** | **any** | Chain ID of the network to search for | (optional) defaults to undefined|
| **slug** | **any** | slug of the project to search for | (optional) defaults to undefined|


### Return type

**Array<ProtocolModel>**

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

# **getPrice**
> Price getPrice()


### Example

```typescript
import {
    MetadataApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new MetadataApi(configuration);

let address: any; //Address of the token to search for (default to undefined)
let chainId: any; //Chain ID of the network to search for (default to undefined)

const { status, data } = await apiInstance.getPrice(
    address,
    chainId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **address** | **any** | Address of the token to search for | defaults to undefined|
| **chainId** | **any** | Chain ID of the network to search for | defaults to undefined|


### Return type

**Price**

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

# **getPrices**
> Array<Price> getPrices()


### Example

```typescript
import {
    MetadataApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new MetadataApi(configuration);

let chainId: number; //Chain ID of the network to search for (default to undefined)
let addresses: Array<string>; //Ethereum address of the token to check price for. (default to undefined)

const { status, data } = await apiInstance.getPrices(
    chainId,
    addresses
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chainId** | [**number**] | Chain ID of the network to search for | defaults to undefined|
| **addresses** | **Array&lt;string&gt;** | Ethereum address of the token to check price for. | defaults to undefined|


### Return type

**Array<Price>**

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

# **getVolume**
> getVolume()


### Example

```typescript
import {
    MetadataApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new MetadataApi(configuration);

let chainId: number; //Chain ID of the network to search for (default to 1)

const { status, data } = await apiInstance.getVolume(
    chainId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chainId** | [**number**] | Chain ID of the network to search for | defaults to 1|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **networks**
> Array<ConnectedNetwork> networks()


### Example

```typescript
import {
    MetadataApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new MetadataApi(configuration);

let name: any; //Title of the network to search for (optional) (default to undefined)
let chainId: any; //Chain ID of the network to search for (optional) (default to undefined)

const { status, data } = await apiInstance.networks(
    name,
    chainId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | **any** | Title of the network to search for | (optional) defaults to undefined|
| **chainId** | **any** | Chain ID of the network to search for | (optional) defaults to undefined|


### Return type

**Array<ConnectedNetwork>**

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

# **nontokenizedPositions**
> NontokenizedPositions200Response nontokenizedPositions()


### Example

```typescript
import {
    MetadataApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new MetadataApi(configuration);

let project: string; //The overarching project or platform associated with the DeFi token (optional) (default to undefined)
let protocolSlug: string; //The specific standard integration or version of the DeFi project (optional) (default to undefined)
let chainId: number; //Chain ID of the network of the nontokenized position (optional) (default to undefined)
let address: Array<string>; //Ethereum addresses of the nontokenized positions (optional) (default to undefined)
let primaryAddress: Array<string>; //Ethereum addresses for contract interaction of nontokenized position (optional) (default to undefined)
let page: number; //Pagination page number. Pages are of length 1000 (optional) (default to undefined)
let cursor: number; //Cursor for pagination. Pages are of length 1000 (optional) (default to undefined)

const { status, data } = await apiInstance.nontokenizedPositions(
    project,
    protocolSlug,
    chainId,
    address,
    primaryAddress,
    page,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **project** | [**string**] | The overarching project or platform associated with the DeFi token | (optional) defaults to undefined|
| **protocolSlug** | [**string**] | The specific standard integration or version of the DeFi project | (optional) defaults to undefined|
| **chainId** | [**number**] | Chain ID of the network of the nontokenized position | (optional) defaults to undefined|
| **address** | **Array&lt;string&gt;** | Ethereum addresses of the nontokenized positions | (optional) defaults to undefined|
| **primaryAddress** | **Array&lt;string&gt;** | Ethereum addresses for contract interaction of nontokenized position | (optional) defaults to undefined|
| **page** | [**number**] | Pagination page number. Pages are of length 1000 | (optional) defaults to undefined|
| **cursor** | [**number**] | Cursor for pagination. Pages are of length 1000 | (optional) defaults to undefined|


### Return type

**NontokenizedPositions200Response**

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

# **tokens**
> Tokens200Response tokens()


### Example

```typescript
import {
    MetadataApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new MetadataApi(configuration);

let project: string; //The overarching project or platform associated with the DeFi token (optional) (default to undefined)
let protocolSlug: string; //The specific standard integration or version of the DeFi project (optional) (default to undefined)
let underlyingTokens: Array<string>; //Underlying tokens of defi token (optional) (default to undefined)
let underlyingTokensExact: Array<string>; //Exact composition of underlying tokens of defi token (optional) (default to undefined)
let primaryAddress: Array<string>; //Ethereum addresses for contract interaction of defi tokens (optional) (default to undefined)
let address: Array<string>; //Ethereum addresses of the tokens (optional) (default to undefined)
let name: Array<string>; //Names of the tokens (optional) (default to undefined)
let symbol: Array<string>; //Symbols of the tokens (optional) (default to undefined)
let chainId: number; //Chain ID of the network of the token (optional) (default to undefined)
let type: 'defi' | 'base'; //Type of token.       If not provided, both types will be taken into account (optional) (default to undefined)
let page: number; //Pagination page number. Pages are of length 1000 (optional) (default to undefined)
let cursor: number; //Cursor for pagination. Pages are of length 1000 (optional) (default to undefined)
let includeMetadata: boolean; //Whether to include token metadata (symbol, name and logos) (optional) (default to false)
let apyFrom: number; //Only include tokens with APY over this value (optional) (default to undefined)
let apyTo: number; //Only include tokens with APY below this value (optional) (default to undefined)
let tvlFrom: number; //Only include tokens with TVL over this value (optional) (default to undefined)
let tvlTo: number; //Only include tokens with TVL below this value (optional) (default to undefined)

const { status, data } = await apiInstance.tokens(
    project,
    protocolSlug,
    underlyingTokens,
    underlyingTokensExact,
    primaryAddress,
    address,
    name,
    symbol,
    chainId,
    type,
    page,
    cursor,
    includeMetadata,
    apyFrom,
    apyTo,
    tvlFrom,
    tvlTo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **project** | [**string**] | The overarching project or platform associated with the DeFi token | (optional) defaults to undefined|
| **protocolSlug** | [**string**] | The specific standard integration or version of the DeFi project | (optional) defaults to undefined|
| **underlyingTokens** | **Array&lt;string&gt;** | Underlying tokens of defi token | (optional) defaults to undefined|
| **underlyingTokensExact** | **Array&lt;string&gt;** | Exact composition of underlying tokens of defi token | (optional) defaults to undefined|
| **primaryAddress** | **Array&lt;string&gt;** | Ethereum addresses for contract interaction of defi tokens | (optional) defaults to undefined|
| **address** | **Array&lt;string&gt;** | Ethereum addresses of the tokens | (optional) defaults to undefined|
| **name** | **Array&lt;string&gt;** | Names of the tokens | (optional) defaults to undefined|
| **symbol** | **Array&lt;string&gt;** | Symbols of the tokens | (optional) defaults to undefined|
| **chainId** | [**number**] | Chain ID of the network of the token | (optional) defaults to undefined|
| **type** | [**&#39;defi&#39; | &#39;base&#39;**]**Array<&#39;defi&#39; &#124; &#39;base&#39;>** | Type of token.       If not provided, both types will be taken into account | (optional) defaults to undefined|
| **page** | [**number**] | Pagination page number. Pages are of length 1000 | (optional) defaults to undefined|
| **cursor** | [**number**] | Cursor for pagination. Pages are of length 1000 | (optional) defaults to undefined|
| **includeMetadata** | [**boolean**] | Whether to include token metadata (symbol, name and logos) | (optional) defaults to false|
| **apyFrom** | [**number**] | Only include tokens with APY over this value | (optional) defaults to undefined|
| **apyTo** | [**number**] | Only include tokens with APY below this value | (optional) defaults to undefined|
| **tvlFrom** | [**number**] | Only include tokens with TVL over this value | (optional) defaults to undefined|
| **tvlTo** | [**number**] | Only include tokens with TVL below this value | (optional) defaults to undefined|


### Return type

**Tokens200Response**

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

