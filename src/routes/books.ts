import { validate } from "class-validator";
import {Context} from "koa";
import Router from "koa-router";
import { AddBookRequest } from "../request/AddBookRequest";
import * as storage from "../storage/redis";

const router = new Router();

router.post(`/books`, async (ctx: Context) => { 
  try {

    // validate the incoming request
    const validationOptions = {};

    const addBookRequest = new AddBookRequest();
    addBookRequest.title = ctx.request.body.title || '';

    const errors = await validate(
      addBookRequest, 
      validationOptions
    );

    // return early if invalid
    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        data: errors,
      }

      return ctx;
    }

    // test mock storage
    console.log('route storage', storage);
    
    ctx.status = 201;
    ctx.body = {
      books: await storage.redisStorage().get('my_test_list')
    }
  } catch (e) {
    console.error(e);
  }
});

export default router;