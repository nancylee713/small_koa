import supertest from "supertest";
import server from "../../src/server";
import request from "supertest";

afterEach((done) => {
  server.close();
  done();
});

describe("routes/books", () => {

  const books = [
    "아몬드",
    "모모",
  ]

  books.forEach((book: string) => {
    it(`should allow adding books to the list - ${book}`, async () => {
      const response = await request(server)
        .post("/books")
        .send({ book: book });
      
      expect(response.status).toEqual(201);
      expect(response.type).toEqual("application/json");
      expect(response.body).toEqual({
        books: [
          book,
        ]
      });
    });
  });
});
