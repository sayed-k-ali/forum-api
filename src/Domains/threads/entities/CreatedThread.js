class CreatedThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {id, title, user_id} = payload;
    this.owner = user_id
    this.title = title;
    this.id = id;
  }

  _verifyPayload({id, title, user_id}) {
    if (!id || !title || !user_id) {
      throw new Error("CREATED_THREAD.EMPTY_PAYLOAD")
    }
  }
}

module.exports = CreatedThread