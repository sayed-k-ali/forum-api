const CommentsTableHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const CreateThreadComment = require("../../../Domains/comments/entities/CreateThreadComment");
const CreatedThreadComment = require("../../../Domains/comments/entities/CreatedThreadComment");
const comments = require("../../../Interfaces/http/api/comments");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe('CommentRepositoryPostgres Test', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableHelper.cleanTable()
    await CommentsTableHelper.cleanTable()
  })
  afterAll(async () => {
    await pool.end();
  })
  describe('addCommentToThread fn', () => {
    it('should add comment to the existing thread', async () => {
      //Arrange
      const fakeIdGen = () => '123'
      const authenticatedUserId = `user-${fakeIdGen()}`
      const threadId = `thread-${fakeIdGen()}`
      await UsersTableTestHelper.addUser({id: authenticatedUserId})
  
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGen)

      await ThreadsTableHelper.createThread({});

      const threadComment = new CreateThreadComment({
        content: "some comment wrote"
      })
 
      //Action
      const result = await commentRepositoryPostgres.addCommentToThread(threadComment, threadId, authenticatedUserId)
  
      //Assert
      expect(result).toStrictEqual(new CreatedThreadComment({
        id: "comment-123",
        content: threadComment.content,
        user_id: authenticatedUserId,
      }))

      const expectedCommentInDB = await CommentsTableHelper.getCommentById("comment-123")

      expect(expectedCommentInDB.id).toEqual("comment-123")
      expect(expectedCommentInDB.content).toEqual(threadComment.content)
      expect(expectedCommentInDB.user_id).toEqual(authenticatedUserId)
      expect(expectedCommentInDB.thread_id).toEqual(threadId)
      expect(expectedCommentInDB.is_deleted).toBeFalsy()
      expect(expectedCommentInDB.date).not.toBeNull()

      //
      
    });
    
    
  });

  describe('getCommentsByThreadId fn', () => {

    it('should return comments on a thread as expected', async () => {
      //Arrange
      const fakeIdGen = () => '123'
      const authenticatedUserId = `user-${fakeIdGen()}`
      const threadId = `thread-${fakeIdGen()}`
      await UsersTableTestHelper.addUser({id: authenticatedUserId})
  
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGen)

      await ThreadsTableHelper.createThread({});
      await Promise.all([
        CommentsTableHelper.addCommentToThread({
          id: 'comment-1', thread_id: threadId, user_id: authenticatedUserId, content: 'Content of comment 1'
        }),
        CommentsTableHelper.addCommentToThread({
          id: 'comment-2', thread_id: threadId, user_id: authenticatedUserId, content: 'Content of comment 2'
        }),
      ]);


      //Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId)

      expect(comments[0].id).toEqual("comment-1")
      expect(comments[0].content).toEqual("Content of comment 1")
      expect(comments[0].username).toEqual("dicoding")
      expect(comments[0].is_deleted).toBeFalsy()

      expect(comments[1].id).toEqual("comment-2")
      expect(comments[1].content).toEqual("Content of comment 2")
      expect(comments[1].username).toEqual("dicoding")
      expect(comments[1].is_deleted).toBeFalsy()
    })
  })
  describe('verifyCommentIfExist fn', () => {
    it('should throw error when comment id not found', async () => {
       //Arrange
      const fakeIdGen = () => '123'
      const authenticatedUserId = `user-${fakeIdGen()}`
      const threadId = `thread-${fakeIdGen()}`
      await UsersTableTestHelper.addUser({id: authenticatedUserId})
  
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGen)

      await ThreadsTableHelper.createThread({});
      await Promise.all([
        CommentsTableHelper.addCommentToThread({
          id: 'comment-1', thread_id: threadId, user_id: authenticatedUserId
        }),
        CommentsTableHelper.addCommentToThread({
          id: 'comment-2', thread_id: threadId, user_id: authenticatedUserId, is_deleted: true
        })
      ]);


      //Action
      await expect(commentRepositoryPostgres.verifyCommentIfExist('comment-3')).rejects.toThrow(NotFoundError)

    })

    it('should not throw error when the comment is exist', async () => {
       //Arrange
      const fakeIdGen = () => '123'
      const authenticatedUserId = `user-${fakeIdGen()}`
      const threadId = `thread-${fakeIdGen()}`
      await UsersTableTestHelper.addUser({id: authenticatedUserId})
  
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGen)

      await ThreadsTableHelper.createThread({});
      await Promise.all([
        CommentsTableHelper.addCommentToThread({
          id: 'comment-1', thread_id: threadId, user_id: authenticatedUserId
        }),
        CommentsTableHelper.addCommentToThread({
          id: 'comment-2', thread_id: threadId, user_id: authenticatedUserId, is_deleted: true
        })
      ]);


      //Action
      await expect(commentRepositoryPostgres.verifyCommentIfExist('comment-2')).resolves.not.toThrow(NotFoundError)

    })
  })

  describe('verifyCommentFromTheAppropriateOwner fn', () => {
    it('should throw error when comment owner is different with the requester', async () => {
       //Arrange
      const fakeIdGen = () => '123'
      const authenticatedUserId = `user-${fakeIdGen()}`
      const threadId = `thread-${fakeIdGen()}`
      await UsersTableTestHelper.addUser({id: authenticatedUserId})
  
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGen)

      await ThreadsTableHelper.createThread({});
      await Promise.all([
        CommentsTableHelper.addCommentToThread({
          id: 'comment-1', thread_id: threadId, user_id: authenticatedUserId
        }),
        CommentsTableHelper.addCommentToThread({
          id: 'comment-2', thread_id: threadId, user_id: authenticatedUserId, is_deleted: true
        })
      ]);


      //Action
     await expect(commentRepositoryPostgres.verifyCommentFromTheAppropriateOwner('comment-1', 'user-456')).rejects.toThrow(AuthorizationError)

    })

    it('should not throw error when the comment owner is appropriate', async () => {
       //Arrange
      const fakeIdGen = () => '123'
      const authenticatedUserId = `user-${fakeIdGen()}`
      const threadId = `thread-${fakeIdGen()}`
      await UsersTableTestHelper.addUser({id: authenticatedUserId})
  
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGen)

      await ThreadsTableHelper.createThread({});
      await Promise.all([
        CommentsTableHelper.addCommentToThread({
          id: 'comment-1', thread_id: threadId, user_id: authenticatedUserId
        }),
        CommentsTableHelper.addCommentToThread({
          id: 'comment-2', thread_id: threadId, user_id: authenticatedUserId, is_deleted: true
        })
      ]);


      //Action
     await expect(commentRepositoryPostgres.verifyCommentFromTheAppropriateOwner('comment-1', 'user-123')).resolves.not.toThrow(AuthorizationError)

    })
  })

  describe('deleteComment fn', () => {
    it('should set is_deleted to true when delete the comment', async () => {
       //Arrange
      const fakeIdGen = () => '123'
      const authenticatedUserId = `user-${fakeIdGen()}`
      const threadId = `thread-${fakeIdGen()}`
      await UsersTableTestHelper.addUser({id: authenticatedUserId})
  
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGen)

      await ThreadsTableHelper.createThread({});
      await Promise.all([
        CommentsTableHelper.addCommentToThread({
          id: 'comment-1', thread_id: threadId, user_id: authenticatedUserId
        }),
      ]);


      //Action
      const deletedComment = await commentRepositoryPostgres.deleteComment('comment-1')

      //Assertion
      expect(deletedComment.is_deleted).toBeTruthy()

      const comment = await CommentsTableHelper.getCommentById('comment-1')
      expect(comment.is_deleted).toBeTruthy()
    })
  })
});