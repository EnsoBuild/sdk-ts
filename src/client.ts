import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import {
  ActionData,
  ApproveData,
  ApproveParams,
  BalanceParams,
  BundleAction,
  BundleData,
  BundleParams,
  ConnectedNetwork,
  IporShortcutData,
  IporShortcutInputData,
  MultiPriceParams,
  NetworkParams,
  NonTokenizedParams,
  PaginatedNonTokenizedPositionData,
  PaginatedTokenData,
  PriceData,
  PriceParams,
  Project,
  ProtocolData,
  ProtocolParams,
  RouteData,
  RouteNonTokenizedParams,
  RouteParams,
  StandardData,
  TokenParams,
  WalletBalance,
} from "./types/types";

const DEFAULT_BASE_URL = "https://api.enso.finance/api/v1";
/**
 * EnsoClient class for interacting with the Enso Finance API.
 *
 * This client provides methods to interact with various Enso Finance endpoints for
 * token routing, bundling, approvals, and more.
 *
 * @example
 * const client = new EnsoClient({
 *   apiKey: 'your-api-key',
 *   baseURL: 'https://api.enso.finance/api/v1'
 * });
 */
export class EnsoClient {
  private client: AxiosInstance;

  /**
   * Creates an instance of EnsoClient.
   *
   * @param {Object} config - Configuration object
   * @param {string} config.apiKey - API key for authentication (required)
   * @param {string} [config.baseURL] - Base URL for the API (optional, defaults to production URL)
   */
  constructor({
    baseURL = DEFAULT_BASE_URL,
    apiKey,
  }: {
    baseURL?: string;
    apiKey: string;
  }) {
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  /**
   * Makes an HTTP request to the API.
   * @private
   * @template T - The expected response type
   * @param {AxiosRequestConfig} config - Axios request configuration
   * @returns {Promise<T>} The response data
   * @throws {Error} When the API request fails
   */
  private async request<T>(
    config: AxiosRequestConfig,
    retries = 3,
  ): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with an error status
        throw new EnsoApiError(
          `API Error: ${error.response.data?.message || error.message}`,
          error.response.status,
          error.response.data,
        );
      } else if (error.request && retries > 0) {
        // Network error - retry with backoff
        const delay = 2 ** (3 - retries) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.request<T>(config, retries - 1);
      } else {
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  }

  /**
   * Gets approval data to spend a token from an EOA wallet.
   *
   * Returns a transaction that approves your EOA wallet to spend the given amount of specified tokens.
   *
   * @param {ApproveParams} params - Parameters for the approval request
   * @returns {Promise<ApproveData>} Approval transaction data
   * @throws {Error} If the API request fails
   *
   * @example
   * const approval = await client.getApprovalData({
   *   fromAddress: '0x123...',
   *   tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
   *   chainId: 1,
   *   amount: '1000000000'
   * });
   */
  public async getApprovalData(params: ApproveParams): Promise<ApproveData> {
    const url = "/wallet/approve";

    return this.request<ApproveData>({
      url,
      method: "GET",
      params: { ...params, routingStrategy: "router" },
    });
  }

  /**
   * Gets execution data for the best route from a token to another.
   *
   * Calculates optimal transaction with the best route between two tokens, which may involve
   * several actions that interact with various DeFi protocols.
   *
   * @param {RouteParams} params - Parameters for the route request
   * @returns {Promise<RouteData>} Route execution data
   * @throws {Error} If the API request fails
   *
   * @example
   * const route = await client.getRouteData({
   *   fromAddress: '0x123...',
   *   receiver: '0x456...',
   *   spender: '0x789...',
   *   chainId: 1,
   *   amountIn: ['1000000000'],
   *   tokenIn: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'], // USDC
   *   tokenOut: ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'], // WETH
   *   slippage: '50', // 0.5%
   *   referralCode: '0123456789ABCDEF'
   * });
   */
  public async getRouteData(params: RouteParams): Promise<RouteData> {
    const url = "/shortcuts/route";

    return this.request<RouteData>({
      method: "GET",
      url,
      params,
    });
  }

  /**
   * Gets wallet balances per chain.
   *
   * Returns tokens balances for Enso Wallet associated with the given address.
   * With `useEoa` set to true, it returns balances for the given EOA address instead.
   *
   * @param {BalanceParams} params - Parameters for the balance request
   * @returns {Promise<WalletBalance[]>} Array of wallet balances
   * @throws {Error} If the API request fails
   *
   * @example
   * const balances = await client.getBalances({
   *   chainId: 1,
   *   eoaAddress: '0x123...',
   *   useEoa: true
   * });
   */
  public async getBalances(params: BalanceParams): Promise<WalletBalance[]> {
    const url = "/wallet/balances";

    if (typeof params.useEoa === "undefined") {
      params.useEoa = true;
    }

    return this.request<WalletBalance[]>({
      method: "GET",
      url,
      params,
    });
  }

  /**
   * Gets token data by address.
   *
   * Returns tokens and their details with pagination.
   *
   * @param {TokenParams} params - Parameters for the token query
   * @returns {Promise<PaginatedTokenData>} Paginated token data
   * @throws {Error} If the API request fails
   *
   * @example
   * const tokens = await client.getTokenData({
   *   chainId: 1,
   *   type: 'defi',
   *   includeMetadata: true
   * });
   */
  public async getTokenData(params: TokenParams): Promise<PaginatedTokenData> {
    const url = `/tokens`;
    if (!params.page) {
      params.page = 1;
    }

    return this.request<PaginatedTokenData>({
      method: "GET",
      url,
      params,
    });
  }

  /**
   * Gets token price data.
   *
   * Returns token price for the given address and chainId.
   *
   * @param {PriceParams} params - Parameters for the price query
   * @returns {Promise<PriceData>} Token price data
   * @throws {Error} If the API request fails
   *
   * @example
   * const price = await client.getPriceData({
   *   chainId: 1,
   *   address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // WETH
   * });
   */
  public async getPriceData(params: PriceParams): Promise<PriceData> {
    const url = `/prices/${params.chainId}/${params.address}`;

    return this.request<PriceData>({
      method: "GET",
      url,
    });
  }

  /**
   * Gets price data for multiple tokens.
   *
   * Returns prices for multiple tokens for the given chainId.
   *
   * @param {MultiPriceParams} params - Parameters for the multiple price query
   * @returns {Promise<PriceData[]>} Array of token price data
   * @throws {Error} If the API request fails
   *
   * @example
   * const prices = await client.getMultiplePriceData({
   *   chainId: 1,
   *   addresses: [
   *     '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
   *     '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'  // USDC
   *   ]
   * });
   */
  public async getMultiplePriceData(
    params: MultiPriceParams,
  ): Promise<PriceData[]> {
    const url = `/prices/${params.chainId}`;

    return this.request<PriceData[]>({
      method: "GET",
      url,
      params: { addresses: params.addresses },
    });
  }

  /**
   * Gets protocol data.
   *
   * Returns all available protocols with supported chains.
   *
   * @param {ProtocolParams} [params] - Optional parameters for filtering protocols
   * @returns {Promise<ProtocolData[]>} Array of protocol data
   * @throws {Error} If the API request fails
   *
   * @example
   * const protocols = await client.getProtocolData({ chainId: 1 });
   */
  public async getProtocolData(
    params?: ProtocolParams,
  ): Promise<ProtocolData[]> {
    const url = `/protocols`;

    return this.request<ProtocolData[]>({
      method: "GET",
      url,
      params,
    });
  }

  /**
   * Constructs bundled transaction data.
   *
   * Returns a single transaction bundling the submitted actions. For available actions, see `/actions` endpoint.
   *
   * @param {BundleParams} params - Parameters for the bundle request
   * @param {BundleAction[]} actions - Array of actions to bundle
   * @returns {Promise<BundleData>} Bundled transaction data
   * @throws {Error} If the API request fails
   *
   * @example
   * const bundle = await client.getBundleData(
   *   {
   *     chainId: 1,
   *     fromAddress: '0x123...',
   *     routingStrategy: 'delegate',
   *     referralCode: '0123456789ABCDEF'
   *   },
   *   [
   *     {
   *       protocol: ['enso'],
   *       action: 'route',
   *       args: {
   *         tokenIn: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
   *         tokenOut: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
   *         amountIn: '1000000000',
   *         receiver: '0x123...'
   *       }
   *     }
   *   ]
   * );
   */
  public async getBundleData(
    params: BundleParams,
    actions: BundleAction[],
  ): Promise<BundleData> {
    const url = "/shortcuts/bundle";

    return this.request<BundleData>({
      method: "POST",
      url,
      params,
      data: actions,
    });
  }

  /**
   * Gets execution data for best route to non-tokenized position.
   *
   * Calculates optimal transaction with the best route entering a non-tokenized position,
   * which may involve several actions that interact with various DeFi protocols.
   *
   * @param {RouteNonTokenizedParams} params - Parameters for the non-tokenized route request
   * @returns {Promise<RouteData>} Route execution data
   * @throws {Error} If the API request fails
   *
   * @example
   * const route = await client.getRouteNonTokenized({
   *   fromAddress: '0x123...',
   *   tokenIn: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
   *   positionOut: '0xPositionAddress',
   *   amountIn: ['1000000000'],
   *   receiver: '0x123...',
   *   slippage: '50', // 0.5%
   *   referralCode: '0123456789ABCDEF'
   * });
   */
  public async getRouteNonTokenized(
    params: RouteNonTokenizedParams,
  ): Promise<RouteData> {
    const url = "/shortcuts/route/nontokenized";

    return this.request<RouteData>({
      method: "GET",
      url,
      params,
    });
  }

  /**
   * Gets IPOR shortcut transaction.
   *
   * Returns a transaction for IPOR shortcut operations.
   *
   * @param {Object} params - Parameters for the IPOR shortcut
   * @param {number} [params.chainId] - Chain ID (optional)
   * @param {string} params.fromAddress - Ethereum address of the wallet
   * @param {IporShortcutInputData} data - IPOR shortcut input data
   * @returns {Promise<IporShortcutData>} IPOR shortcut transaction data
   * @throws {Error} If the API request fails
   */
  public async getIporShortcut(
    params: { chainId?: number; fromAddress: string },
    data: IporShortcutInputData,
  ): Promise<IporShortcutData> {
    const url = "/shortcuts/static/ipor";

    return this.request<IporShortcutData>({
      method: "POST",
      url,
      params,
      data,
    });
  }

  /**
   * Gets all standards.
   *
   * Returns standards available for bundling. Each element represents a protocol, with list of supported actions and chains the standard's supported on.
   *
   * @returns {Promise<StandardData[]>} Array of standard data
   * @throws {Error} If the API request fails
   */
  public async getStandards(): Promise<StandardData[]> {
    const url = "/standards";

    return this.request<StandardData[]>({
      method: "GET",
      url,
    });
  }

  /**
   * Gets standard by protocol slug.
   *
   * Returns a standard matching the given `slug`, containing supported actions, exact `inputs`, and a list of chains the standard's supported on.
   *
   * @param {string} slug - The protocol slug
   * @returns {Promise<StandardData[]>} Array of standard data
   * @throws {Error} If the API request fails
   */
  public async getStandardBySlug(slug: string): Promise<StandardData[]> {
    const url = `/standards/${slug}`;

    return this.request<StandardData[]>({
      method: "GET",
      url,
    });
  }

  /**
   * Gets all supported actions.
   *
   * Returns actions that can be bundled with `/shortcuts/bundle` endpoint. For specific protocol actions and exact action inputs, see `/actions/{slug}` endpoint.
   *
   * @returns {Promise<ActionData[]>} Array of action data
   * @throws {Error} If the API request fails
   */
  public async getActions(): Promise<ActionData[]> {
    const url = "/actions";

    return this.request<ActionData[]>({
      method: "GET",
      url,
    });
  }

  /**
   * Gets actions for a specific protocol.
   *
   * @param {string} slug - The protocol slug
   * @returns {Promise<ActionData[]>} Array of action data for the protocol
   * @throws {Error} If the API request fails
   */
  public async getActionsBySlug(slug: string): Promise<ActionData[]> {
    const url = `/actions/${slug}`;

    return this.request<ActionData[]>({
      method: "GET",
      url,
    });
  }

  /**
   * Gets all non-tokenized positions.
   *
   * Returns a list of all nontokenized positions with details.
   *
   * @param {NonTokenizedParams} [params] - Optional parameters for filtering
   * @returns {Promise<PaginatedNonTokenizedPositionData>} Paginated non-tokenized position data
   * @throws {Error} If the API request fails
   */
  public async getNonTokenizedPositions(
    params?: NonTokenizedParams,
  ): Promise<PaginatedNonTokenizedPositionData> {
    const url = "/nontokenized";

    return this.request<PaginatedNonTokenizedPositionData>({
      method: "GET",
      url,
      params,
    });
  }

  /**
   * Gets supported projects.
   *
   * Returns supported projects (e.g. `aave`) or platforms associated with available projects.
   *
   * @returns {Promise<Project[]>} Array of project data
   * @throws {Error} If the API request fails
   */
  public async getProjects(): Promise<Project[]> {
    const url = "/projects";

    return this.request<Project[]>({
      method: "GET",
      url,
    });
  }

  /**
   * Gets protocols within a project.
   *
   * Returns all protocols available within the given project. For supported projects, see the `/projects` endpoint.
   *
   * @param {string} project - The project name
   * @returns {Promise<ProtocolData[]>} Array of protocol data within the project
   * @throws {Error} If the API request fails
   */
  public async getProtocolsByProject(project: string): Promise<ProtocolData[]> {
    const url = `/projects/${project}/protocols`;

    return this.request<ProtocolData[]>({
      method: "GET",
      url,
    });
  }

  /**
   * Gets supported networks.
   *
   * Returns networks supported by Enso.
   *
   * @param {NetworkParams} [params] - Optional parameters for filtering networks
   * @returns {Promise<ConnectedNetwork[]>} Array of network data
   * @throws {Error} If the API request fails
   */
  public async getNetworks(
    params?: NetworkParams,
  ): Promise<ConnectedNetwork[]> {
    const url = "/networks";

    return this.request<ConnectedNetwork[]>({
      method: "GET",
      url,
      params,
    });
  }

  /**
   * Gets supported aggregators.
   *
   * Fetches aggregators supported by Enso.
   *
   * @param {number} [chainId] - Chain ID to filter aggregators for
   * @returns {Promise<string[]>} Array of aggregator names
   * @throws {Error} If the API request fails
   */
  public async getAggregators(chainId?: number): Promise<string[]> {
    const url = "/aggregators";
    const params = chainId ? { chainId } : undefined;

    return this.request<string[]>({
      method: "GET",
      url,
      params,
    });
  }

  /**
   * Gets volume data for a chain.
   *
   * Returns total USD and transactions volume for the given chainId.
   *
   * @param {number} chainId - Chain ID to get volume for
   * @returns {Promise<unknown>} Volume data
   * @throws {Error} If the API request fails
   */
  public async getVolume(chainId: number): Promise<unknown> {
    const url = `/volume/${chainId}`;

    return this.request<unknown>({
      method: "GET",
      url,
    });
  }

  public async getAccountId(): Promise<string> {
    const url = `/account/accountId`;

    return this.request<string>({
      method: "GET",
      url,
    });
  }
}

// Custom error classes
export class EnsoApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public responseData?: any,
  ) {
    super(message);
    this.name = "EnsoApiError";
  }
}
