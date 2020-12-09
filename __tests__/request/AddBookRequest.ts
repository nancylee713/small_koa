import { AddBookRequest } from "../../src/request/AddBookRequest";
import { validate } from "class-validator";

describe("request/AddBookRequest", () => {

  let addBookRequest: AddBookRequest;
  const validatorOptions = {};

  beforeAll(() => {
    addBookRequest = new AddBookRequest(); 
  });

  it(`has the expected class properties`, async () => {
    addBookRequest.title = "아몬드";
    expect(addBookRequest.title).toBeDefined();
  });

  describe(`'name' validation`, () => {

    it('is valid', async () => {
      for (let i = 1; i <=20; ++i) {
        addBookRequest.title = "x".repeat(i);
        expect(
          await validate(addBookRequest, validatorOptions)
        ).toHaveLength(0);
      }
    });

    it('must have length of 1 character or greater', async () => {
      addBookRequest.title = '';
      expect(
        await validate(addBookRequest, validatorOptions)
      ).toHaveLength(1);
    });

    it('must have length of 20 characters or fewer', async () => {
      addBookRequest.title = 'y'.repeat(21);
      expect(
        await validate(addBookRequest, validatorOptions)
      ).toHaveLength(1);
    });
  });
});