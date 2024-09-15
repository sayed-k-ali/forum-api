const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const createServer = require('../createServer');
const container = require('../../container');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads/{thread_id}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{thread_id}/comments', () => {
    it('should response 201 and persisted addedComment', async () => {
      // Arrange
      const requestPayload = {
        content: "some example comment"
      };

      const threadId = 'thread-456'

      const accessToken = await ServerTestHelper.getAccessToken({});
      const server = await createServer(container);

      await ThreadsTableTestHelper.createThread({id: threadId})

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.owner).toEqual('user-123');
    });

    it('should return 400 when payload is empty', async () => {
       // Arrange
      const requestPayload = {
        content: ""
      };

      const threadId = 'thread-456'

      const accessToken = await ServerTestHelper.getAccessToken({});
      const server = await createServer(container);

      await ThreadsTableTestHelper.createThread({id: threadId})

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
     
    });
  })

  describe('when DELETE /threads/{thread_id}/comments/{comment_id}', () => {
    it('should fail when comment doesn\'t exist', async () => {
      // Arrange
      const threadId = 'thread-456'

      const accessToken = await ServerTestHelper.getAccessToken({});
      const server = await createServer(container);

      await ThreadsTableTestHelper.createThread({id: threadId})
      await Promise.all([
        CommentsTableTestHelper.addCommentToThread({
          id: 'comment-1',
          content: 'First Comment',
          thread_id: threadId,
          user_id: 'user-123'
        })
      ])

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/comments-xxx`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
     

    })
    it('should fail when the thread itself doesn\'t exist', async () => {
      // Arrange
      const threadId = 'thread-456'

      const accessToken = await ServerTestHelper.getAccessToken({});
      const server = await createServer(container);

      await ThreadsTableTestHelper.createThread({id: threadId})
      await Promise.all([
        CommentsTableTestHelper.addCommentToThread({
          id: 'comment-1',
          content: 'First Comment',
          thread_id: threadId,
          user_id: 'user-123'
        })
      ])

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-xxx/comments/comments-yyy`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
     


    })
    it('should fail when the user trying to delete other\'s comment', async () => {
      // Arrange
      const threadId = 'thread-456'
      const commentId = 'comment-1'
      const commentOwnerFakeUserId = 'user-789'

      const accessToken = await ServerTestHelper.getAccessToken({});
      const server = await createServer(container);

      await ThreadsTableTestHelper.createThread({id: threadId})
      await Promise.all([
        CommentsTableTestHelper.addCommentToThread({
          id: commentId,
          content: 'First Comment',
          thread_id: threadId,
          user_id: commentOwnerFakeUserId,
        })
      ])

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
     
    })
    it('should delete the comment, and return success response', async () => {
      // Arrange
      const threadId = 'thread-456'
      const commentId = 'comment-1'
      const commentOwnerUserId = 'user-123'

      const accessToken = await ServerTestHelper.getAccessToken({});
      const server = await createServer(container);

      await ThreadsTableTestHelper.createThread({id: threadId})
      await Promise.all([
        CommentsTableTestHelper.addCommentToThread({
          id: commentId,
          content: 'First Comment',
          thread_id: threadId,
          user_id: commentOwnerUserId,
        })
      ])

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
     

    })
  })

});