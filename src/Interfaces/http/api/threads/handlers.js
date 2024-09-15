const CreateThreadUseCase = require("../../../../Applications/use_case/CreateThreadUseCase");
const GetThreadUseCase = require("../../../../Applications/use_case/GetThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.createThreadHandler = this.createThreadHandler.bind(this)
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this)
  }

  async createThreadHandler(request, h) {
    const createThreadUseCase = this._container.getInstance(CreateThreadUseCase.name);
    const createThread = await createThreadUseCase.execute(request.payload, request.auth.credentials.id)

    return h.response({
      status: 'success',
      data: {
        addedThread: createThread
      }
    }).code(201)
      
  }
  async getThreadByIdHandler(request, h) {
    const getThreadUsecase = this._container.getInstance(GetThreadUseCase.name);
    const getThread = await getThreadUsecase.execute(request.params.thread_id)

    return h.response({
      status: 'success',
      data: {
        thread: getThread
      }
    })
  }
}

module.exports = ThreadsHandler