class DeleteCommentUseCase {
  constructor({
    commentRepository,
    threadRepository,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(commentId, threadId, authenticatedUserId) {
    await this._threadRepository.verifyThreadIfExist(threadId)
    await this._commentRepository.verifyCommentIfExist(commentId)
    await this._commentRepository.verifyCommentFromTheAppropriateOwner(commentId, authenticatedUserId)

    return this._commentRepository.deleteComment(commentId)

  }
}

module.exports = DeleteCommentUseCase