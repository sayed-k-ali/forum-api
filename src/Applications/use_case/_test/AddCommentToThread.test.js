const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CreateThreadComment = require("../../../Domains/comments/entities/CreateThreadComment");
const CreatedThreadComment = require("../../../Domains/comments/entities/CreatedThreadComment");
const AddCommentToThreadUseCase = require("../AddCommentToThreadUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe('CreateNewThreadUseCase test', () => {
  it('should be defined', () => {
    expect(AddCommentToThreadUseCase).toBeDefined();
  })

  it('should orchestrate the thread comment creation', async () => {
    // Arrange
    const authenticatedUserId = 'user-123'
    const threadId = 'thread-123'
    const useCasePayload = {
      content: "I need help to update the multiple rows in MySQL",
    };

    const mockCreatedComment = new CreatedThreadComment({
      id: 'comment-123',
      content: useCasePayload.content,
      user_id: authenticatedUserId,
    })

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.addCommentToThread = jest.fn().mockResolvedValue(new CreatedThreadComment({
      id: 'comment-123',
      content: useCasePayload.content,
      user_id: authenticatedUserId,
      thread_id: threadId,
    }));

    mockThreadRepository.verifyThreadIfExist = jest.fn().mockResolvedValue()

    const addCommentToThread = new AddCommentToThreadUseCase({ threadRepository: mockThreadRepository, commentRepository: mockCommentRepository });

    // Action
    const commentAdded = await addCommentToThread.execute(useCasePayload, threadId, authenticatedUserId)

    // Assert
    expect(mockCommentRepository.addCommentToThread).toBeCalledWith(new CreateThreadComment(useCasePayload), threadId, authenticatedUserId)
    expect(mockThreadRepository.verifyThreadIfExist).toBeCalledWith(threadId)
    expect(commentAdded).toStrictEqual(new CreatedThreadComment({
      id: 'comment-123',
      content: useCasePayload.content,
      user_id: authenticatedUserId,
    }))
  })
  
});