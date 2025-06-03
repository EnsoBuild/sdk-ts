# ProjectsApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getStandardsByProject**](#getstandardsbyproject) | **GET** /api/v1/projects/{project}/protocols | Returns protocols available by project|
|[**projects**](#projects) | **GET** /api/v1/projects | Returns the overarching projects or platforms associated with the available projects|

# **getStandardsByProject**
> Array<ProtocolModel> getStandardsByProject()


### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

let project: string; //The overarching project or platform (default to undefined)

const { status, data } = await apiInstance.getStandardsByProject(
    project
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **project** | [**string**] | The overarching project or platform | defaults to undefined|


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

# **projects**
> Array<Project> projects()


### Example

```typescript
import {
    ProjectsApi,
    Configuration
} from '@ensobuild/shortcuts-sdk';

const configuration = new Configuration();
const apiInstance = new ProjectsApi(configuration);

const { status, data } = await apiInstance.projects();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Project>**

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

