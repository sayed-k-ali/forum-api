const CreatedThread = require("../CreatedThread")

describe("CreatedThread Test", () => {
  it("should be defined", () => {
    expect(CreatedThread).toBeDefined();
  })

  it("should throw error if the required payload is empty", () => {
    const payload = {
      id: "",
      title: "",
      user_id: "",
    }
    expect(() => new CreatedThread(payload)).toThrow("CREATED_THREAD.EMPTY_PAYLOAD")
  })

  it("should return new created thread", () => {
    const payload = {
      id: "thread-123",
      title: "Some title",
      user_id: "user-123"
    }

    const { id, title, owner } = new CreatedThread(payload)
    expect(title).toEqual(payload.title)
    expect(id).toEqual(payload.id)
    expect(owner).toEqual(payload.user_id)

  })
})