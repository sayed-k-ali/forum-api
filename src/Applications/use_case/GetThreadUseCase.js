const InvariantError = require("../../Commons/exceptions/InvariantError");
const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThread(threadId);

    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const mappedComments = comments.map(comment => {
      return {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.is_deleted? "**komentar telah dihapus**": comment.content
      }
    })

    return {
      ...thread,
      comments: mappedComments
    }
  }
}

module.exports = GetThreadUseCase