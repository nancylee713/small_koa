import { DeleteBookRequest } from "../../src/request/DeleteBookRequest";
import { validate } from "class-validator";

describe("request/DeleteBookRequest", () => {

  let deleteBookRequest: DeleteBookRequest;
  const validatorOptions = {};

  beforeAll(() => {
    deleteBookRequest = new DeleteBookRequest(); 
  });

  it(`has the expected class properties`, async () => {
    deleteBookRequest.title = "아몬드";
    expect(deleteBookRequest.title).toBeDefined();
  });

  describe(`'name' validation`, () => {

    it('is valid', async () => {
      for (let i = 1; i <=20; ++i) {
        deleteBookRequest.title = "x".repeat(i);
        expect(
          await validate(deleteBookRequest, validatorOptions)
        ).toHaveLength(0);
      }
    });

    it('must have length of 1 character or greater', async () => {
      deleteBookRequest.title = '';
      expect(
        await validate(deleteBookRequest, validatorOptions)
      ).toHaveLength(1);
    });

    it('must have length of 20 characters or fewer', async () => {
      deleteBookRequest.title = 'y'.repeat(21);
      expect(
        await validate(deleteBookRequest, validatorOptions)
      ).toHaveLength(1);
    });
  });
});