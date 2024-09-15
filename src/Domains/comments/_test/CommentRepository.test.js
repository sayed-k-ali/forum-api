const CommentRepository = require("../CommentRepository");

describe("CommentRepository Test", () => {
  it('should throw error when calling directly from the abstract class', () => {
    //Arrange
    const commentRepository = new CommentRepository

    //Action & Assert
    expect(() => commentRepository.addCommentToThread()).toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    expect(() => commentRepository.getCommentsByThreadId()).toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    expect(() => commentRepository.deleteComment()).toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    expect(() => commentRepository.verifyCommentIfExist()).toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    expect(() => commentRepository.verifyCommentFromTheAppropriateOwner()).toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  });
})