let useDebugUrl: boolean = false;

export class ApIModule {
  static getApiEndpointRandom(): string {
    let randomNumberApiEndpoint: string = '/api/cpp/random';
    if (useDebugUrl) {
      randomNumberApiEndpoint = 'http://localhost:5202/api/cpp/random';
    }
    return randomNumberApiEndpoint;
  }
  static getApiEndpointShoppingListGet(): string {
    let shoppingListGetApiEndpoint: string = '/api/cs/shoppinglist';
    if (useDebugUrl) {
      shoppingListGetApiEndpoint = 'http://localhost:5202/api/cs/shoppinglist';
    }
    return shoppingListGetApiEndpoint;
  }
  static getApiEncode(): string {
    let encodeApiEndpoint: string = '/api/cpp/encode';
    if (useDebugUrl) {
      encodeApiEndpoint = 'http://localhost:10000/api/cpp/encode';
    }
    return encodeApiEndpoint;
  }
}
