const ThreadDetail = require("../ThreadDetail")

describe("ThreadDetail Test", () => {
  it("should be defined", () => {
    expect(ThreadDetail).toBeDefined();
  })

  it("should throw error if the required payload is empty", () => {
    const payload = {
      title: "",
      body: ""
    }
    expect(() => new ThreadDetail(payload)).toThrow("THREAD_DETAIL.EMPTY_PAYLOAD")
  })

  it("should throw error if one of the required payload is having invalid format", () => {
    const payload = {
      title: "some title",
      body: "some body",
      comments: "single comment only",
      id: 123,
      username: "dicoding",
      comments: [],
      date: "2024-09-11",
    }
    expect(() => new ThreadDetail(payload)).toThrow("THREAD_DETAIL.INVALID_PAYLOAD_FORMAT")
  })

  it("should return new created thread", () => {
    const payload = {
      title: "some title",
      body: "some body",
      username: "dicoding",
      date: "2024-09-11",
      comments: [],
      id: "thread-123",
    }

    const thread = new ThreadDetail(payload)

    expect(thread).toEqual(payload)

  })
})