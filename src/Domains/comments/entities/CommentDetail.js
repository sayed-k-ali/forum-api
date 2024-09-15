class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, date, username, content,
    } = payload;

    this.id = id;
    this.date = date;
    this.username = username;
    this.content = content;
  }

  _verifyPayload(payload) {
    const {
      id, content, date, username,
    } = payload;

    if (!id || !date || !username || !content) {
      throw new Error('COMMENT_DETAIL.EMPTY_PAYLOAD');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'string'
      || typeof username !== 'string'
      || typeof content !== 'string'
    ) {
      throw new Error('COMMENT_DETAIL.INVALID_PAYLOAD_FORMAT');
    }
  }
}

module.exports = CommentDetail