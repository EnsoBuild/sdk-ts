# PaginationMeta


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total** | **number** | Total amount of pages | [default to undefined]
**lastPage** | **number** | Last page number | [default to undefined]
**currentPage** | **number** | Current page number | [default to undefined]
**perPage** | **number** | Amount of elements per page | [default to undefined]
**prev** | **number** | Previous page | [default to undefined]
**next** | **number** | Next page | [default to undefined]
**cursor** | **number** | Cursor for pagination | [default to undefined]

## Example

```typescript
import { PaginationMeta } from './api';

const instance: PaginationMeta = {
    total,
    lastPage,
    currentPage,
    perPage,
    prev,
    next,
    cursor,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
