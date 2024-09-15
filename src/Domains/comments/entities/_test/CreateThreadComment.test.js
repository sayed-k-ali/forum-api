const CreateThreadComment = require("../CreateThreadComment");

describe('CreateThreadComment Test', () => {
  it('should be defined', () => {
    expect(CreateThreadComment).toBeDefined();
  })

  it('should throw error when payload is empty', () => {
    expect(() => new CreateThreadComment({
      content: ""
    })).toThrowError("CREATE_THREAD_COMMENT.EMPTY_PAYLOAD")
  })

  it('should throw error when payload is in wrong format', () => {
    expect(() => new CreateThreadComment({
      content: 1234
    })).toThrowError("CREATE_THREAD_COMMENT.INVALID_PAYLOAD_FORMAT")
  })

  it('should create new thread comment object', () => {
    const payload = {
      content: "Some comment"
    }

    const createThreadComment = new CreateThreadComment(payload)

    expect(createThreadComment.content).toBe(payload.content)
  })
  
});