const CommentDetail = require("../CommentDetail");

describe('CommentDetail Test', () => {
  it('should be defined', () => {
    expect(CommentDetail).toBeDefined();
  })

  it('should throw error when payload is empty', () => {
    expect(() => new CommentDetail({})).toThrowError("COMMENT_DETAIL.EMPTY_PAYLOAD")
  })

  it('should throw error when payload is in wrong format', () => {
    expect(() => new CommentDetail({
      id: 1234,
      date: 2024,
      username: 'dicoding 2',
      content: 1234
    })).toThrowError("COMMENT_DETAIL.INVALID_PAYLOAD_FORMAT")
  })

  it('should create new thread comment object', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2024-09-11',
      content: "Some comment"
    }

    const commentDetail = new CommentDetail(payload)

    expect(commentDetail).toEqual(payload)
  })
  
});