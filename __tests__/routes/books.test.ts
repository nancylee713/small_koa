import server from "../../src/server";
import request from "supertest";
import * as storage from "../../src/storage/redis";

jest.mock("../../src/storage/redis");

afterEach((done) => {
  server.close();
  done();
});

describe("routes/books", () => {

  describe('post', () => {

  const books = [
    "아몬드",
    "모모",
  ]

  books.forEach((book: string) => {
    it(`should allow adding books to the list - ${book}`, async () => {
      const myList: string[] = [];
      const mockGet = jest.fn((list: string) => Promise.resolve(myList));

      storage.redisStorage = jest.fn(() => {
        return {
          get: mockGet,
          add: (list: string) => Promise.resolve(false),
          remove: (list: string) => Promise.resolve(false),
        }
      });

      const response = await request(server)
        .post("/books")
        .send({ title: book });
      
      expect(response.status).toEqual(201);
      expect(response.type).toEqual("application/json");
      expect(response.body).toEqual({
        books: myList
      });

      expect(mockGet).toHaveBeenCalled();
    });
  });

  it('should not allow adding the same book to the list', async () => {
    const list_of_books: string[] = [];
    const mockGet = jest.fn((list: string) => Promise.resolve(list_of_books));
    const mockAdd = jest.fn((list: string, title: string) => {
      list_of_books.push(title);
      return list_of_books.length > 0;
    });

    storage.redisStorage = jest.fn(() => {
      return {
        get: mockGet,
        add: mockAdd,
        remove: (list: string) => Promise.resolve(false),
      }
    });

    const book1 = { title: "book1" };
    const response1 = await request(server)
      .post("/books")
      .send(book1);

    expect(response1.status).toEqual(201);

    const response2 = await request(server)
      .post("/books")
      .send(book1);

    expect(response2.status).toEqual(400);
    expect(response2.type).toEqual("application/json");
    expect(response2.body).toEqual({
      "status": "error",
      "data": "The same book is already in the list!"
    });
  });

  it('should keep track of all books added to the list', async () => {

    const list_of_books: string[] = [];
    const mockGet = jest.fn((list: string) => Promise.resolve(list_of_books));
    const mockAdd = jest.fn((list: string, title: string) => {
      list_of_books.push(title);
      return list_of_books.length > 0;
    });


    // Define the mock function that have exactly the same signature as found on the interface  
    storage.redisStorage = jest.fn(() => {
      return {
        get: mockGet,
        add: mockAdd,
        remove: (list: string) => Promise.resolve(false),
      }
    });

    const book1 = { title: "The giver" };
    const response1 = await request(server)
      .post("/books")
      .send(book1);

    expect(response1.status).toEqual(201);
    expect(response1.type).toEqual("application/json");
    expect(response1.body).toEqual({
      books: [
        book1.title,
      ]
    })

    const book2 = { title: "The son" };
    const response2 = await request(server)
      .post("/books")
      .send(book2);

    expect(response2.status).toEqual(201);
    expect(response2.type).toEqual("application/json");
    expect(response2.body).toEqual({
      books: list_of_books
    })

    expect(mockAdd).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalled();
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


  });

  describe('delete', () => {
    it('returns an empty list when the list is empty', async () => {

      const book = "Almond";
    
      const list_of_books: string[] = [ book ];

      const mockGet = jest.fn((list: string) => Promise.resolve(list_of_books));
      const mockAdd = jest.fn();
      const mockRemove = jest.fn((list: string, title: string) => {
        const index = list_of_books.indexOf(book);
        if (index === -1) {
          return false;
        }
        list_of_books.splice(index, 1);
        return true;
      });

      storage.redisStorage = jest.fn(() => {
        return {
          get: mockGet,
          add: mockAdd,
          remove: mockRemove,
        }
      });

      const response = await request(server)
        .delete("/books")
        .send({ title: book });

      expect(response.status).toEqual(200);
      expect(response.type).toEqual("application/json");
      expect(response.body).toEqual({
        books: []
      });

      expect(mockGet).toHaveBeenCalled();
      expect(mockRemove).toHaveBeenCalled();
      expect(mockAdd).not.toHaveBeenCalled();
    });
  
    it('returns an updated list when deleting a book', async () => {
      const book = "Almond";

      const list_of_books: string[] = [
        "Momo",
        book,
        "The Giver"
      ];

      const mockGet = jest.fn((list:string) => Promise.resolve(list_of_books));
      const mockAdd = jest.fn();
      const mockRemove = jest.fn((list:string, title:string) => {
        const index = list_of_books.indexOf(book);
        if (index === -1) {
          return false;
        }
        list_of_books.splice(index, 1);
        return true;
      });

      storage.redisStorage = jest.fn(() => {
        return {
          get: mockGet,
          add: mockAdd,
          remove: mockRemove,
        }
      });

      const response = await request(server)
        .delete(`/books`)
        .send({ title: book });
      
      expect(response.status).toEqual(200);
      expect(response.type).toEqual("application/json");
      expect(response.body).toEqual({
        books: list_of_books.filter(i => i !== book)
      })

      expect(mockGet).toHaveBeenCalled();
      expect(mockRemove).toHaveBeenCalled();
      expect(mockAdd).not.toHaveBeenCalled();
    });
  });
});
