class CreatedThreadComment {
  constructor(payload) {
    this._verifyPayload(payload)

    const { id, content, user_id } = payload;

    this.id = id;
    this.content = content;
    this.owner = user_id;
  }

  _verifyPayload(payload) {
    const {id, content, user_id} = payload;
    if (!id || !content || !user_id) throw new Error("CREATED_THREAD_COMMENT.EMPTY_PAYLOAD")
  }
}

module.exports = CreatedThreadComment;