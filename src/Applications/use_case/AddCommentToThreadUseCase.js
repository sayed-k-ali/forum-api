const CreateThreadComment = require("../../Domains/comments/entities/CreateThreadComment");

class AddCommentToThreadUseCase {
  constructor({
    threadRepository,
    commentRepository
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }
  async execute(useCasePayload, threadId, authenticatedUserId){
    const comment = new CreateThreadComment(useCasePayload)
    await this._threadRepository.verifyThreadIfExist(threadId)
    return this._commentRepository.addCommentToThread(comment, threadId, authenticatedUserId)
  }
}

module.exports = AddCommentToThreadUseCase;