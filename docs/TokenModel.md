# TokenModel


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**address** | **string** | Ethereum address of the token | [default to undefined]
**chainId** | **number** | Chain ID of the network of the token | [default to undefined]
**type** | **string** | Type of token | [default to undefined]
**decimals** | **number** | Token decimals | [default to undefined]
**symbol** | **string** | Token name | [default to undefined]
**name** | **string** | Token symbol | [default to undefined]
**logosUri** | **Array&lt;string&gt;** | A list of logos for the token | [default to undefined]

## Example

```typescript
import { TokenModel } from './api';

const instance: TokenModel = {
    address,
    chainId,
    type,
    decimals,
    symbol,
    name,
    logosUri,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
