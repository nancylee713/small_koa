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
        .send({ title: book });
      
      expect(response.status).toEqual(201);
      expect(response.type).toEqual("application/json");
      expect(response.body).toEqual({
        books: [
          book,
        ]
      });
    });
  });


  it('should return a validation failure if the book data is incorrect', async () => {
    const response = await request(server)
      .post("/books")
      .send({ title: ""});
    
    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual(
      {
        "status": "error",
        "data": [
          {
            "target": {
                "title": ""
            },
            "value": "",
            "property": "title",
            "children": [],
            "constraints": {
                "length": "title must be longer than or equal to 1 characters"
            }
          }
        ]
      }
    );

});
