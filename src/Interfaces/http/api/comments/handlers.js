const AddCommentToThreadUseCase = require("../../../../Applications/use_case/AddCommentToThreadUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class CommentHandler {
  constructor(container) {
    this._container = container;
    this.addCommentToThreadHandler = this.addCommentToThreadHandler.bind(this);
    this.deleteCommentFromThreadHandler = this.deleteCommentFromThreadHandler.bind(this);
  }

  async addCommentToThreadHandler(request, h) {
    const payload = {
      content: request.payload.content,
    }
    const addCommentToThreadUseCase = this._container.getInstance(AddCommentToThreadUseCase.name);
    const addedComment = await addCommentToThreadUseCase.execute(payload, request.params.thread_id, request.auth.credentials.id)

    return h.response({
      status: 'success',
      data: {
        addedComment
      }
    }).code(201)
  }

  async deleteCommentFromThreadHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const deletedComment = await deleteCommentUseCase.execute(request.params.comment_id, request.params.thread_id, request.auth.credentials.id)

    return h.response({
      status: 'success',
    })
  }
}

module.exports = CommentHandler