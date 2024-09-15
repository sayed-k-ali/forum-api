const CreateThread = require("../../Domains/threads/entities/CreateThread");

class CreateThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, authenticatedUserId) {
    const thread = new CreateThread(useCasePayload);
    return this._threadRepository.addThread(thread, authenticatedUserId);
  }
}

module.exports = CreateThreadUseCase;
