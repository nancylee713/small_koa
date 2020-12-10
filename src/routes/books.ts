import { validate } from "class-validator";
import {Context} from "koa";
import Router from "koa-router";
import { AddBookRequest } from "../request/AddBookRequest";

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

    ctx.status = 201;
    ctx.body = {
      books: [
        ctx.request.body.title,
      ]
    }
  } catch (e) {
    console.error(e);
  }
});

export default router;