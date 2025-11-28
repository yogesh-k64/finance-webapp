interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

interface ApiError {
  message: string;
  status: number;
  data?: any;
}

type SuccessCallback<T = any> = (response: ApiResponse<T>) => void;
type ErrorCallback = (error: ApiError) => void;

class ApiServices {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('Content-type');
    let data: any;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.log('data :', data);
      const error: ApiError = {
        message: data.message || `HTTP Error: ${response.status}`,
        status: response.status,
        data: data,
      };
      throw error;
    }

    return {
      data: data.data,
      message: data.message,
      status: response.status,
      success: response.ok,
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        const apiError: ApiError = {
          message: error.message,
          status: 0,
        };
        throw apiError;
      }
      throw error;
    }
  }

  // GET Request with callback support
  async GetRequest<T = any>(
    endpoint: string, 
    successCallback?: SuccessCallback<T>,
    errorCallback?: ErrorCallback,
    headers?: HeadersInit
  ): Promise<ApiResponse<T> | void> {
    try {
      const response = await this.makeRequest<T>(endpoint, {
        method: 'GET',
        headers,
      });
      
      if (successCallback) {
        successCallback(response);
        return;
      }
      
      return response;
    } catch (error) {
      if (errorCallback) {
        errorCallback(error as ApiError);
        return;
      }
      throw error;
    }
  }

  // POST Request with callback support
  async PostRequest<T = any>(
    endpoint: string,
    body?: any,
    successCallback?: SuccessCallback<T>,
    errorCallback?: ErrorCallback,
    headers?: HeadersInit
  ): Promise<ApiResponse<T> | void> {
    try {
      const response = await this.makeRequest<T>(endpoint, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
        headers,
      });
      
      if (successCallback) {
        successCallback(response);
        return;
      }
      
      return response;
    } catch (error) {
      if (errorCallback) {
        errorCallback(error as ApiError);
        return;
      }
      throw error;
    }
  }

  // PUT Request with callback support
  async PutRequest<T = any>(
    endpoint: string,
    body?: any,
    successCallback?: SuccessCallback<T>,
    errorCallback?: ErrorCallback,
    headers?: HeadersInit
  ): Promise<ApiResponse<T> | void> {
    try {
      const response = await this.makeRequest<T>(endpoint, {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
        headers,
      });
      
      if (successCallback) {
        successCallback(response);
        return;
      }
      
      return response;
    } catch (error) {
      if (errorCallback) {
        errorCallback(error as ApiError);
        return;
      }
      throw error;
    }
  }

  // DELETE Request with callback support
  async DeleteRequest<T = any>(
    endpoint: string,
    successCallback?: SuccessCallback<T>,
    errorCallback?: ErrorCallback,
    headers?: HeadersInit
  ): Promise<ApiResponse<T> | void> {
    try {
      const response = await this.makeRequest<T>(endpoint, {
        method: 'DELETE',
        headers,
      });
      
      if (successCallback) {
        successCallback(response);
        return;
      }
      
      return response;
    } catch (error) {
      if (errorCallback) {
        errorCallback(error as ApiError);
        return;
      }
      throw error;
    }
  }

  // PATCH Request with callback support
  async PatchRequest<T = any>(
    endpoint: string,
    body?: any,
    successCallback?: SuccessCallback<T>,
    errorCallback?: ErrorCallback,
    headers?: HeadersInit
  ): Promise<ApiResponse<T> | void> {
    try {
      const response = await this.makeRequest<T>(endpoint, {
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined,
        headers,
      });
      
      if (successCallback) {
        successCallback(response);
        return;
      }
      
      return response;
    } catch (error) {
      if (errorCallback) {
        errorCallback(error as ApiError);
        return;
      }
      throw error;
    }
  }

  setBaseURL(url: string): void {
    this.baseURL = url;
  }
}

const services = new ApiServices(import.meta.env.VITE_API_BASE_URL || '');

export default services;
export { ApiServices, type ApiResponse, type ApiError, type SuccessCallback, type ErrorCallback };