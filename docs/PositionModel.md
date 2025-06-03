# PositionModel


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
**underlyingTokens** | [**Array&lt;TokenModel&gt;**](TokenModel.md) | Underlying tokens of defi token | [default to undefined]
**project** | **string** | The overarching project or platform associated with the DeFi token | [default to undefined]
**protocolSlug** | **string** | The specific standard integration or version of the DeFi project | [default to undefined]
**apy** | **number** | The defi position APY | [default to undefined]
**apyBase** | **number** | The defi position base APY | [default to undefined]
**apyReward** | **number** | The defi position reward APY | [default to undefined]
**tvl** | **number** | The defi position TVL | [default to undefined]
**primaryAddress** | **string** | Ethereum address for contract interaction of defi token | [default to undefined]

## Example

```typescript
import { PositionModel } from '@ensobuild/shortcuts-sdk';

const instance: PositionModel = {
    address,
    chainId,
    type,
    decimals,
    symbol,
    name,
    logosUri,
    underlyingTokens,
    project,
    protocolSlug,
    apy,
    apyBase,
    apyReward,
    tvl,
    primaryAddress,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
