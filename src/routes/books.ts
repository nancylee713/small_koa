import {Context} from "koa";
import Router from "koa-router";

const router = new Router();

router.post(`/books`, async (ctx: Context) => {
  try {
    ctx.status = 201;
    ctx.body = {
      books: [
        ctx.request.body.book,
      ]
    }
  } catch (e) {
    console.error(e);
  }
});

export default router;