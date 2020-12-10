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

    // save the new book to storage
    const store = storage.redisStorage();
    const list_name = "my_book_list";

    const my_list = await store.get(list_name)    
        
    if (my_list.length > 0 && my_list.includes(addBookRequest.title)) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        data: "The same book is already in the list!"
      }

      return ctx;
    }

    await store.add(list_name, addBookRequest.title);

    ctx.status = 201;
    ctx.body = {
      books: await store.get(list_name)
    }
  } catch (e) {
    console.error(e);
  }
});

export default router;