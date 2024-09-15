class ThreadRepository {
  addThread(thread, authenticatedUserId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  getThread(id) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  verifyThreadIfExist(threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  //TODO add reply comment and delete reply comment

}

module.exports = ThreadRepository;