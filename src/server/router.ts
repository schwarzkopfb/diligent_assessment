import Router from "koa-router";
import moviesRoute from "./movies";

const router = new Router({
  prefix: "/api",
});

moviesRoute.register(router);

export default router;
