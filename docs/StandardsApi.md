# StandardsApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**findAllActions**](#findallactions) | **GET** /api/v1/actions | Returns actions available to use in bundle shortcuts|
|[**getActionsBySlug**](#getactionsbyslug) | **GET** /api/v1/actions/{slug} | Returns actions available to use in bundle shortcuts for a given protocol|
|[**getProtocolBySlug**](#getprotocolbyslug) | **GET** /api/v1/standards/{slug} | Returns a standard by slug|
|[**standards**](#standards) | **GET** /api/v1/standards | Returns standards and methods available to use in bundle shortcuts|

# **findAllActions**
> Array<Action> findAllActions()


### Example

```typescript
import {
    StandardsApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new StandardsApi(configuration);

const { status, data } = await apiInstance.findAllActions();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Action>**

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

# **getActionsBySlug**
> Array<Action> getActionsBySlug()


### Example

```typescript
import {
    StandardsApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new StandardsApi(configuration);

let slug: string; // (default to undefined)

const { status, data } = await apiInstance.getActionsBySlug(
    slug
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **slug** | [**string**] |  | defaults to undefined|


### Return type

**Array<Action>**

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

# **getProtocolBySlug**
> Array<ProtocolModel> getProtocolBySlug()


### Example

```typescript
import {
    StandardsApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new StandardsApi(configuration);

let slug: string; //The protocol slug (default to undefined)

const { status, data } = await apiInstance.getProtocolBySlug(
    slug
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **slug** | [**string**] | The protocol slug | defaults to undefined|


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

# **standards**
> Array<Standard> standards()


### Example

```typescript
import {
    StandardsApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new StandardsApi(configuration);

const { status, data } = await apiInstance.standards();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Standard>**

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

