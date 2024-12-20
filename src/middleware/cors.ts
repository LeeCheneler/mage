import type { MageMiddleware } from "../router.ts";
import { HttpMethod, StatusCode } from "../http.ts";

interface CorsOptions {
  origins?: "*" | string[];
  methods?: "*" | HttpMethod[];
  headers?: string[];
  exposeHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

/**
 * Middleware that handles Cross-Origin Resource Sharing (CORS) requests.
 *
 * @param options
 * @returns
 */
export const useCors = (options: CorsOptions | undefined): MageMiddleware => {
  return async (context, next) => {
    const origin = context.request.headers.get("Origin");

    const allowedOrigins = [options?.origins ?? "*"].flat();
    const allowedMethods = [options?.methods ?? []].flat();
    const allowedHeaders = [options?.headers ?? []].flat();
    const exposeHeaders = [options?.exposeHeaders ?? []].flat();
    const allowCredentials = options?.credentials;
    const allowedMaxAge = options?.maxAge;

    if (allowedOrigins.length > 0) {
      if (allowedOrigins.includes("*")) {
        context.response.headers.set("Access-Control-Allow-Origin", "*");
      }

      if (origin && allowedOrigins.includes(origin)) {
        context.response.headers.set("Access-Control-Allow-Origin", origin);
        context.response.headers.set("Vary", "Origin");
      }
    }

    if (allowedMethods.length > 0) {
      context.response.headers.set(
        "Access-Control-Allow-Methods",
        allowedMethods.join(", "),
      );
    }

    if (allowedHeaders.length > 0) {
      context.response.headers.set(
        "Access-Control-Allow-Headers",
        allowedHeaders.join(", "),
      );
    }

    if (exposeHeaders.length > 0) {
      context.response.headers.set(
        "Access-Control-Expose-Headers",
        exposeHeaders.join(", "),
      );
    }

    if (allowCredentials) {
      context.response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    if (allowedMaxAge) {
      context.response.headers.set(
        "Access-Control-Max-Age",
        allowedMaxAge.toString(),
      );
    }

    if (context.request.method !== HttpMethod.Options) {
      // don't set full CORS headers if the request is not a preflight request
      context.response.headers.delete("Access-Control-Allow-Methods");
      context.response.headers.delete("Access-Control-Allow-Headers");
      context.response.headers.delete("Access-Control-Max-Age");
    }

    context.empty(StatusCode.NoContent);

    await next();
  };
};
