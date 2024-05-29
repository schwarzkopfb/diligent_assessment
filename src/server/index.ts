import * as http from "node:http";
import Koa from "koa";
import conditional from "koa-conditional-get";
import etag from "koa-etag";
import serve from "koa-static";
import logger from "koa-logger";
import router from "./router";
import { PORT } from "./consts";

const app = new Koa();

app
  .use(logger())
  .use(conditional())
  .use(etag())
  .use(serve("dist/client"))
  .use(serve("public"))
  .use(router.routes())
  .use(router.allowedMethods());

http
  .createServer(app.callback())
  .on("listening", () =>
    console.log("server is ready to accept connections on port %s", PORT)
  )
  .listen(PORT);
