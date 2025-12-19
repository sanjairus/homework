import type { RequestHandler } from "express";
import { Router } from "express";

export class BaseRouter {
  router: Router;

  constructor() {
    this.router = Router();
  }

  public addGetRoute = (path: string, cb: RequestHandler) => {
    this.router.route(path).get(cb);
  };

  public addPostRoute = (path: string, cb: RequestHandler) => {
    this.router.route(path).post(cb);
  };

  public addDeleteRoute = (path: string, cb: RequestHandler) => {
    this.router.route(path).delete(cb);
  };

  public addPutRoute = (path: string, cb: RequestHandler) => {
    this.router.route(path).put(cb);
  };

  public getRouter = () => {
    return this.router;
  };
}

export default BaseRouter;
