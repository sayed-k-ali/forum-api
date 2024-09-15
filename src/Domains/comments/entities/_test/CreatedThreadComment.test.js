const CreatedThreadComment = require("../CreatedThreadComment");

describe('CreatedThreadComment Test', () => {
  it('should be defined', () => {
    expect(CreatedThreadComment).toBeDefined();
  })

  it('should throw error when payload is empty', () => {
    expect(() => new CreatedThreadComment({})).toThrowError("CREATED_THREAD_COMMENT.EMPTY_PAYLOAD")
  })

  it('should return a created thread comment', () => {
    const payload = {
      id: "comment-123",
      content: "Some comment",
      user_id: "user-123"
    }
    const createdThreadComment = new CreatedThreadComment(payload)

    expect(createdThreadComment.content).toBe(payload.content)
    expect(createdThreadComment.id).toBe(payload.id)
    expect(createdThreadComment.owner).toBe(payload.user_id)
  })
  
});