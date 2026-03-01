import axios from 'axios';

/**
 * Port of PHP calllink::run() - HTTP GET request to external APIs
 */
export async function callLink(url: string): Promise<{ result: 'success' | 'error'; data?: unknown }> {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      validateStatus: () => true,
    });
    if (response.data && Object.keys(response.data).length > 0) {
      return { result: 'success', data: response.data };
    }
    return { result: 'error' };
  } catch {
    return { result: 'error' };
  }
}
