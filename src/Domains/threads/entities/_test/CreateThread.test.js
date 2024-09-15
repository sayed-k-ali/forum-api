const CreateThread = require("../CreateThread")

describe("CreateThread Test", () => {
  it("should be defined", () => {
    expect(CreateThread).toBeDefined();
  })

  it("should throw error if the required payload is empty", () => {
    const payload = {
      title: "",
      body: ""
    }
    expect(() => new CreateThread(payload)).toThrow("CREATE_THREAD.EMPTY_PAYLOAD")
  })

  it("should throw error if the the payload format is invalid", () => {
    const payload = {
      title: true,
      body: "Some Body"
    }
    expect(() => new CreateThread(payload)).toThrow("CREATE_THREAD.INVALID_PAYLOAD_FORMAT")
  })

  it("should return new created thread", () => {
    const payload = {
      title: "Some title",
      body: "Some thread content"
    }

    const { title, body } = new CreateThread(payload)
    expect(title).toEqual(payload.title)
    expect(body).toEqual(payload.body)

  })
})