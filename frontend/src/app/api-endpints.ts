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
  static getApiHash(): string {
    return '/api/go/hash';
  }
  static getApiEncode(): string {
    let encodeApiEndpoint: string = '/api/cpp/encode';
    if (useDebugUrl) {
      encodeApiEndpoint = 'http://localhost:10000/api/cpp/encode';
    }
    return encodeApiEndpoint;
  }
  static getApiComments(): string {
    let commentsApiEndpoint: string = '/api/go/comments';
    if (useDebugUrl) {
      commentsApiEndpoint = 'http://localhost:8080/api/go/comments';
    }
    return commentsApiEndpoint;
  }
}
