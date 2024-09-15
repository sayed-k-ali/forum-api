const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const ThreadsTableHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const CommentsTableHelper = require("../../../../tests/CommentsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe('ThreadRepositoryPostgres Test', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableHelper.cleanTable()
    await CommentsTableHelper.cleanTable();
  })
  afterAll(async () => {
    await pool.end();
  })
  describe('addThread fn', () => {
    it('should create new thread and return the expected data', async () => {
      //Arrange
      const fakeIdGen = () => '123'
      const threadOwnerId = `user-${fakeIdGen()}`
      await UsersTableTestHelper.addUser({id: threadOwnerId})
      const newThread = new CreateThread({
        title: "Some title",
        body: "Some body"
      });
  
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGen)
  
      //Action
      const threadCreated = await threadRepositoryPostgres.addThread(newThread, threadOwnerId)
      
  
      //Assert
      expect(threadCreated.id).toEqual("thread-123")
      expect(threadCreated.title).toEqual("Some title")
      expect(threadCreated.owner).toEqual("user-123")

      const expectedThreadInDB = await ThreadsTableHelper.getThreadById("thread-123")
      expect(expectedThreadInDB.id).toEqual("thread-123")
      expect(expectedThreadInDB.title).toEqual(newThread.title)
      expect(expectedThreadInDB.body).toEqual(newThread.body)

    });
    
  });

  describe('verifyThreadIfExist fn', () => {
    it('should throw notfound error when thread doesn\'t exist', async () => {
      //Arrange
      const fakeIdGen = () => '123'
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGen)
      const fakeThreadId = 'thread-456'

      //Action
      //Assert
      await expect(threadRepositoryPostgres.verifyThreadIfExist(fakeThreadId)).rejects.toThrow(NotFoundError)
    });
    it('should not throw notfound error when thread exist', async () => {
      //Arrange
      const fakeIdGen = () => '123'
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGen)
      const existThreadId = 'thread-123'

      //Action
      await ThreadsTableHelper.createThread({id: existThreadId})

      //Assert
      await expect(threadRepositoryPostgres.verifyThreadIfExist(existThreadId)).resolves.not.toThrowError(NotFoundError)
    });
  })

  describe('getThread fn', () => {
    it('should throw notfound error when thread doesn\'t exist', async () => {
      //Arrange
      const fakeIdGen = () => '123'
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGen)
      const fakeThreadId = 'thread-456'

      //Action
      //Assert
      expect(threadRepositoryPostgres.getThread(fakeThreadId)).rejects.toThrow(NotFoundError)
    });
    it('should not throw notfound error when thread exist', async () => {
      //Arrange
      const fakeIdGen = () => '123'
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGen)
      const existThreadId = 'thread-123'
      const threadOwner = 'user-123'

      //Action
      await UsersTableTestHelper.addUser({id: threadOwner, username: 'dicoding'})
      await ThreadsTableHelper.createThread({id: existThreadId, user_id: threadOwner, title: "Test Title", body: "Test Body"})

      const expectedThread = await threadRepositoryPostgres.getThread(existThreadId)

      //Assert
      expect(expectedThread.id).toEqual(existThreadId)
      expect(expectedThread.title).toEqual("Test Title")
      expect(expectedThread.body).toEqual("Test Body")
      expect(expectedThread.username).toEqual("dicoding")

    });
  })
});