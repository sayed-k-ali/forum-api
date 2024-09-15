const ThreadRepository = require("../ThreadRepository")

describe("ThreadRepository Test", () => {
  it("should throw error when instantiate ThreadRepository directly from abstraction", () => {
    const threadRepository = new ThreadRepository();

    expect(() => threadRepository.addThread()).toThrow("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    expect(() => threadRepository.getThread()).toThrow("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
    expect(() => threadRepository.verifyThreadIfExist()).toThrow("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED")
  })
})