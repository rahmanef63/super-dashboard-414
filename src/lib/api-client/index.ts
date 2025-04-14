type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface ApiRequestOptions {
  method?: RequestMethod
  body?: any
  headers?: Record<string, string>
}

/**
 * Base API request function
 */
export async function apiRequest<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options

  const requestOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Include cookies for authentication
  }

  if (body) {
    requestOptions.body = JSON.stringify(body)
  }

  const response = await fetch(`/api${endpoint}`, requestOptions)

  return handleResponse<T>(response)
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("Content-Type") || ""

  // Parse JSON response
  if (contentType.includes("application/json")) {
    const data = await response.json()

    if (!response.ok) {
      throw handleError(response.status, data)
    }

    return data as T
  }

  // Handle non-JSON responses
  if (!response.ok) {
    const text = await response.text()
    throw handleError(response.status, { message: text })
  }

  return {} as T
}

/**
 * Handle API errors
 */
function handleError(status: number, data: any): Error {
  const error = new Error(data.error || data.message || "An unexpected error occurred")

  // Add additional properties to the error
  ;(error as any).status = status
  ;(error as any).data = data

  return error
}

/**
 * Convenience methods for common API operations
 */
export const api = {
  get: <T = any>(endpoint: string, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, body: any, options?: Omit<ApiRequestOptions, "method">) =>
    apiRequest<T>(endpoint, { ...options, method: "POST", body }),

  put: <T = any>(endpoint: string, body: any, options?: Omit<ApiRequestOptions, "method">) =>
    apiRequest<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T = any>(endpoint: string, body: any, options?: Omit<ApiRequestOptions, "method">) =>
    apiRequest<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T = any>(endpoint: string, options?: Omit<ApiRequestOptions, "method">) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
}
