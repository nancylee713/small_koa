import { redisStorage } from "../../src/storage/redis";

describe('storage/redis', () => {
  
  describe('get', () => {
    const list_name = "my_test_list";

    it('should initially return an empty list', async () => {
      expect(
        await redisStorage.get(list_name)
      ).toEqual(
        []
      );
    });
  });

  describe('add', () => {

    const list_name = "my_test_list_2";

    it('should allow adding an entry to a list', async () => {
      const add_book = "test_book"

      expect(
        await redisStorage.add(list_name, add_book)
      ).toBeTruthy;

      expect(
        await redisStorage.get(list_name)
      ).toEqual(
        [ add_book ]
      );

      await redisStorage.remove(list_name, add_book)
    });
  });

  describe('remove', () => {
    it('should allow removing an entry from the list', async () => {

      const list_name = "my_test_list_3";

      await redisStorage.add(list_name, "book1");
      await redisStorage.add(list_name, "book2");

      expect(
        await redisStorage.remove(list_name, "book2")
      ).toBeTruthy();

      expect(
        await redisStorage.get(list_name)
      ).toEqual(
        [ "book1" ]
      );

      await redisStorage.remove(list_name, "book1");
    });

  });

});