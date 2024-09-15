const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const CreateThreadUseCase = require("../CreateThreadUseCase");

describe('CreateNewThreadUseCase test', () => {
  it('should be defined', () => {
    expect(CreateThreadUseCase).toBeDefined();
  })

  it('should orchestrate the thread creation', async () => {
    // Arrange
    const authenticatedUserId = 'user-123'
    const useCasePayload = {
      title: "I need help to update the multiple rows in MySQL",
      body: "I have the sample query. Can anyone help?"
    };

    const mockCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      user_id: authenticatedUserId,
    })

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockResolvedValue(new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      user_id: authenticatedUserId,
    }));

    const createThreadUseCase = new CreateThreadUseCase({ threadRepository: mockThreadRepository });

    // Action
    const createThreadResult = await createThreadUseCase.execute(useCasePayload, authenticatedUserId)

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(new CreateThread(useCasePayload), authenticatedUserId)
    expect(createThreadResult).toStrictEqual(mockCreatedThread)


  })
  
});