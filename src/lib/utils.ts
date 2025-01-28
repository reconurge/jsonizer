import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


type FetchResult<T> = {
  data?: T;
  error?: string;
};

export const fetchApi = async <T>(apiUrl: string | undefined): Promise<FetchResult<T>> => {
  if (!apiUrl) {
    return { error: "API URL is not provided." };
  }

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    // Validate JSON response
    if (typeof response.data === "object" && response.data !== null) {
      return { data: response.data };
    } else {
      return { error: "Invalid JSON response from the API." };
    }
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status code outside the range of 2xx
      return { error: `API error: ${error.response.status} ${error.response.statusText}` };
    } else if (error.request) {
      // Request was made, but no response was received
      return { error: "No response from the server. Please check your internet connection." };
    } else {
      // Something happened in setting up the request
      return { error: `Error: ${error.message}` };
    }
  }
};

export async function isImageUrl(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url); // HEAD request to check headers
    const contentType = response.headers["content-type"];
    return contentType?.startsWith("image/") || false;
  } catch (error) {
    console.error("Error checking URL:", error);
    return false;
  }
}