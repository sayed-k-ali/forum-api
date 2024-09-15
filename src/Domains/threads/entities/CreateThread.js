class CreateThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {title, body} = payload;
    this.title = title;
    this.body = body;
  }

  _verifyPayload({title, body}) {
    if (!title || !body) {
      throw new Error("CREATE_THREAD.EMPTY_PAYLOAD")
    }

    if (
      typeof title !== 'string' ||
      typeof body !== 'string'
    ) throw new Error("CREATE_THREAD.INVALID_PAYLOAD_FORMAT")
  }
}

module.exports = CreateThread