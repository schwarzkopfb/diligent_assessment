import Koa from "koa";
import Router from "koa-router";
import { HttpError } from "http-errors";

function addErrorLogging(
  verb: string,
  name: string,
  handler: (ctx: Koa.Context, next: Koa.Next) => Promise<void>
) {
  return async (ctx: Koa.Context, next: Koa.Next) => {
    try {
      await handler(ctx, next);
    } catch (error: unknown) {
      const err = error as HttpError;
      let message = err.message;

      if (!err.expose) {
        message = "Internal Server Error";
        console.error(`Error in ${verb} /${name} route`);
        console.error(err.stack);
        // TODO: if it's a 5xx error, then here we should log it to an error aggregation service like Sentry
      }

      ctx.status = err.status || 500;
      ctx.body = {
        status: "error",
        status_code: ctx.status,
        message,
      };
    }
  };
}

interface Route {
  name: string;
  get?(ctx: Koa.Context, next: Koa.Next): Promise<void>;
  post?(ctx: Koa.Context, next: Koa.Next): Promise<void>;
  put?(ctx: Koa.Context, next: Koa.Next): Promise<void>;
  patch?(ctx: Koa.Context, next: Koa.Next): Promise<void>;
  delete?(ctx: Koa.Context, next: Koa.Next): Promise<void>;
}

class Route {
  register(router: Router) {
    const { name } = this;
    const path = "/" + name;

    if (this.get) {
      router.get(path, addErrorLogging("GET", name, this.get));
    }
    if (this.post) {
      router.post(path, addErrorLogging("POST", name, this.post));
    }
    if (this.put) {
      router.put(path, addErrorLogging("PUT", name, this.put));
    }
    if (this.patch) {
      router.patch(path, addErrorLogging("PATCH", name, this.patch));
    }
    if (this.delete) {
      router.delete(path, addErrorLogging("DELETE", name, this.delete));
    }
  }
}

export default Route;
