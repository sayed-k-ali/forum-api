const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError")
const InvariantError = require("../../../Commons/exceptions/InvariantError")
const NotFoundError = require("../../../Commons/exceptions/NotFoundError")
const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const DeleteCommentUseCase = require("../DeleteCommentUseCase")

describe('DeleteCommentUseCase Test', () => {
  it('should be defined', () => {
    expect(DeleteCommentUseCase).toBeDefined()
  })

  it('should failed when the user trying to delete other\'s comment', async () => {
    //Arrange
    const commentId = 'comment-123'
    const threadId = 'thread-123'
    const authenticatedUser = 'user-123'
    
    const commentRepository = new CommentRepository()
    const threadRepository = new ThreadRepository()

    commentRepository.verifyCommentFromTheAppropriateOwner = jest.fn().mockImplementation(() => { throw new AuthorizationError("You are not the comment owner") })
    commentRepository.verifyCommentIfExist = jest.fn().mockResolvedValue();
    threadRepository.verifyThreadIfExist = jest.fn().mockResolvedValue();


    const deleteCommentUsecase = new DeleteCommentUseCase({
      commentRepository,
      threadRepository,
    })


    try {
      await deleteCommentUsecase.execute(commentId, threadId, authenticatedUser)
    } catch (error) {
      expect(error).toBeInstanceOf(AuthorizationError)
      expect(threadRepository.verifyThreadIfExist).toBeCalledWith(threadId)
      expect(commentRepository.verifyCommentIfExist).toBeCalledWith(commentId)
      expect(commentRepository.verifyCommentFromTheAppropriateOwner).toBeCalledWith(commentId, authenticatedUser)
    }
  })
  it('should failed when the comment is not exist', async () => {
    //Arrange
    const commentId = 'comment-123'
    const threadId = 'thread-123'
    const authenticatedUser = 'user-123'
    
    const commentRepository = new CommentRepository()
    const threadRepository = new ThreadRepository()

    commentRepository.verifyCommentFromTheAppropriateOwner = jest.fn().mockResolvedValue();
    commentRepository.verifyCommentIfExist = jest.fn().mockImplementation(() => { throw new NotFoundError("comment is not exist") });
    threadRepository.verifyThreadIfExist = jest.fn().mockResolvedValue();


    const deleteCommentUsecase = new DeleteCommentUseCase({
      commentRepository,
      threadRepository,
    })


    try {
      await deleteCommentUsecase.execute(commentId, threadId, authenticatedUser)
      
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError)
      expect(threadRepository.verifyThreadIfExist).toBeCalledWith(threadId)
      expect(commentRepository.verifyCommentIfExist).toBeCalledWith(commentId)
      expect(commentRepository.verifyCommentFromTheAppropriateOwner).not.toBeCalled()

    }

  })
  it('should be failed when thread is not exist', async () => {
    //Arrange
    const commentId = 'comment-123'
    const threadId = 'thread-123'
    const authenticatedUser = 'user-123'
    
    const commentRepository = new CommentRepository()
    const threadRepository = new ThreadRepository()

    commentRepository.verifyCommentFromTheAppropriateOwner = jest.fn().mockResolvedValue()
    commentRepository.verifyCommentIfExist = jest.fn().mockResolvedValue();
    threadRepository.verifyThreadIfExist = jest.fn().mockImplementation(()=>{throw new NotFoundError("thread not exist")});


    const deleteCommentUsecase = new DeleteCommentUseCase({
      commentRepository,
      threadRepository,
    })


    try {
      await deleteCommentUsecase.execute(commentId, threadId, authenticatedUser)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError)
      expect(threadRepository.verifyThreadIfExist).toBeCalledWith(threadId)
      expect(commentRepository.verifyCommentIfExist).not.toBeCalled()
      expect(commentRepository.verifyCommentFromTheAppropriateOwner).not.toBeCalled()
    }


  })
 
  it('should orchestrate the comment deletion', async () => {
    const commentId = 'comment-123'
    const threadId = 'thread-123'
    const authenticatedUser = 'user-123'
    
    const commentRepository = new CommentRepository()
    const threadRepository = new ThreadRepository()

    commentRepository.verifyCommentFromTheAppropriateOwner = jest.fn();
    commentRepository.verifyCommentIfExist = jest.fn().mockResolvedValue();
    commentRepository.deleteComment = jest.fn().mockResolvedValue({
      id: commentId,
      is_deleted: true,
      content: "Some mock content"
    });
    threadRepository.verifyThreadIfExist = jest.fn().mockResolvedValue();


    const deleteCommentUsecase = new DeleteCommentUseCase({
      commentRepository,
      threadRepository,
    })

    //Action
    const result = await deleteCommentUsecase.execute(commentId, threadId, authenticatedUser)

    //Assert
    expect(result).toEqual({
      id: commentId,
      is_deleted: true,
      content: "Some mock content"
    })

    expect(commentRepository.verifyCommentFromTheAppropriateOwner).toBeCalledWith(commentId, authenticatedUser)
    expect(commentRepository.verifyCommentIfExist).toBeCalledWith(commentId)
    expect(threadRepository.verifyThreadIfExist).toBeCalledWith(threadId)
    expect(commentRepository.deleteComment).toBeCalledWith(commentId)

  })
})