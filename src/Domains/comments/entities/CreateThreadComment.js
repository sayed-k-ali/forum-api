
class CreateThreadComment {
  constructor(payload) {
    this._verifyPayload(payload)

    this.content = payload.content;
  }

  _verifyPayload(payload) {
    const { content } = payload;
    if (!content) {
      throw new Error("CREATE_THREAD_COMMENT.EMPTY_PAYLOAD")
    }
    if (typeof content !== 'string') throw new Error("CREATE_THREAD_COMMENT.INVALID_PAYLOAD_FORMAT")
  }
}

module.exports = CreateThreadComment;