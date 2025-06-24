const BASE_API_URL: string =
  "http://4.204.24.205:8000";

interface RequestOptions {
  method: string;
  url: string;
  query?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
}

interface MethodOptions {
  query?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
}

interface Response {
  ok: boolean;
  status: number;
  json: () => Promise<any>;
}

interface ApiResponse {
  ok: boolean;
  status: number;
  body: any;
}

export default class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_API_URL;
  }

  private async authenticatedRequest(
    options: RequestOptions
  ): Promise<ApiResponse> {
    let query: string = new URLSearchParams(options.query || {}).toString();
    if (query !== "") {
      query = "?" + query;
    }

    let response: Response;
    try {
      const headers: Record<string, string> = {
        ...options.headers,
      };

      const token = localStorage.getItem("accessToken");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(options.body);
      }

      response = await fetch(this.baseUrl + options.url + query, {
        method: options.method,
        headers,
        body: options.body || null,
      });
    } catch (error) {
      console.log(options);
      response = {
        ok: false,
        status: 500,
        json: async () => {
          return {
            code: 500,
            message: "The server is unresponsive",
            description: error instanceof Error ? error.message : String(error),
          };
        },
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null,
    };
  }

  private async unauthenticatedRequest(
    options: RequestOptions
  ): Promise<ApiResponse> {
    let query: string = new URLSearchParams(options.query || {}).toString();
    if (query !== "") {
      query = "?" + query;
    }

    let response: Response;
    try {
      const headers: Record<string, string> = {
        ...options.headers,
      };

      if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(options.body);
      }

      response = await fetch(this.baseUrl + options.url + query, {
        method: options.method,
        headers,
        body: options.body || null,
      });
    } catch (error) {
      console.log(options);
      response = {
        ok: false,
        status: 500,
        json: async () => {
          return {
            code: 500,
            message: "The server is unresponsive",
            description: error instanceof Error ? error.message : String(error),
          };
        },
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null,
    };
  }

  async get(
    url: string,
    query?: Record<string, any>,
    options: MethodOptions = {}
  ): Promise<ApiResponse> {
    return this.authenticatedRequest({ method: "GET", url, query, ...options });
  }

  async uget(
    url: string,
    query?: Record<string, any>,
    options: MethodOptions = {}
  ): Promise<ApiResponse> {
    return this.unauthenticatedRequest({
      method: "GET",
      url,
      query,
      ...options,
    });
  }

  async post(
    url: string,
    body?: any,
    options: MethodOptions = {}
  ): Promise<ApiResponse> {
    return this.authenticatedRequest({ method: "POST", url, body, ...options });
  }

  async upost(
    url: string,
    body?: any,
    options: MethodOptions = {}
  ): Promise<ApiResponse> {
    return this.unauthenticatedRequest({
      method: "POST",
      url,
      body,
      ...options,
    });
  }

  async patch(
    url: string,
    body?: any,
    options: MethodOptions = {}
  ): Promise<ApiResponse> {
    return this.authenticatedRequest({
      method: "PATCH",
      url,
      body,
      ...options,
    });
  }

  async upatch(
    url: string,
    body?: any,
    options: MethodOptions = {}
  ): Promise<ApiResponse> {
    return this.unauthenticatedRequest({
      method: "PATCH",
      url,
      body,
      ...options,
    });
  }

  async delete(url: string, options: MethodOptions = {}): Promise<ApiResponse> {
    return this.authenticatedRequest({ method: "DELETE", url, ...options });
  }

  async udelete(
    url: string,
    options: MethodOptions = {}
  ): Promise<ApiResponse> {
    return this.unauthenticatedRequest({ method: "DELETE", url, ...options });
  }
}
