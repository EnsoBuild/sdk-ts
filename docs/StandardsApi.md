# StandardsApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**actionsControllerFindAll**](#actionscontrollerfindall) | **GET** /api/v1/actions | Returns actions available to use in bundle shortcuts|
|[**actionsControllerGetActionsBySlug**](#actionscontrollergetactionsbyslug) | **GET** /api/v1/actions/{slug} | Returns actions available to use in bundle shortcuts for a given protocol|
|[**standardsControllerGetProtocolBySlug**](#standardscontrollergetprotocolbyslug) | **GET** /api/v1/standards/{slug} | Returns a standard by slug|
|[**standardsControllerStandards**](#standardscontrollerstandards) | **GET** /api/v1/standards | Returns standards and methods available to use in bundle shortcuts|

# **actionsControllerFindAll**
> Array<Action> actionsControllerFindAll()


### Example

```typescript
import {
    StandardsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StandardsApi(configuration);

const { status, data } = await apiInstance.actionsControllerFindAll();
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

# **actionsControllerGetActionsBySlug**
> Array<Action> actionsControllerGetActionsBySlug()


### Example

```typescript
import {
    StandardsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StandardsApi(configuration);

let slug: string; // (default to undefined)

const { status, data } = await apiInstance.actionsControllerGetActionsBySlug(
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

# **standardsControllerGetProtocolBySlug**
> Array<ProtocolModel> standardsControllerGetProtocolBySlug()


### Example

```typescript
import {
    StandardsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StandardsApi(configuration);

let slug: string; //The protocol slug (default to undefined)

const { status, data } = await apiInstance.standardsControllerGetProtocolBySlug(
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

# **standardsControllerStandards**
> Array<Standard> standardsControllerStandards()


### Example

```typescript
import {
    StandardsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StandardsApi(configuration);

const { status, data } = await apiInstance.standardsControllerStandards();
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

