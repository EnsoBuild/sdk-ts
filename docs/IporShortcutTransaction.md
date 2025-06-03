# IporShortcutTransaction


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**createdAt** | **number** | Block number the transaction was created on | [default to undefined]
**tx** | [**Transaction**](Transaction.md) | The tx object to use in &#x60;ethers&#x60; | [default to undefined]
**logs** | **Array&lt;string&gt;** | Logs from the simulated transaction | [default to undefined]
**simulationURL** | **string** | Tenderly simulation URL | [default to undefined]

## Example

```typescript
import { IporShortcutTransaction } from '@ensobuild/shortcuts-sdk';

const instance: IporShortcutTransaction = {
    createdAt,
    tx,
    logs,
    simulationURL,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
