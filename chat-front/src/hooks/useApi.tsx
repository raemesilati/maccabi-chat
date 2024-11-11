import useToken, { useUser } from "../contexts/userContext";
import { useMutation } from "react-query";

interface IMutationOptions {
  body?: Object | FormData;
  get?: boolean;
}

export interface ApiError {
  response?: Response;
  message?: string;
}

const useAPIMutation = <T,>(url: string) => {
  const { userContext, updateContext } = useUser();

  const apiCall = useMutation(
    async ({ body, get = false }: IMutationOptions) => {
      const headers = new Headers();

      // Set base headers
      headers.append("accept", "application/json, text/plain, */*");
      headers.append("accept-encoding", "gzip, deflate, br");
      headers.append("accept-language", "en-US,en;q=0.9");
      headers.append("Content-Type", "application/json");

      // Add authorization if available
      if (userContext?.token) {
        headers.append("Authorization", `Bearer ${userContext.token}`);
      }

      // Construct request options
      const requestOptions: RequestInit = {
        method: get ? "GET" : "POST",
        headers: headers,
        credentials: "include",
        mode: "cors",
      };

      // Only add body for POST requests
      if (!get && body) {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(
        `http://localhost:5000/${url}`,
        requestOptions
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      // Handle JSON response
      try {
        const data = await response.json();
        return data.data || data;
      } catch (error) {
        throw new Error("Invalid JSON response");
      }
    }
  );

  return {
    ...apiCall,
  };
};

export default useAPIMutation;
