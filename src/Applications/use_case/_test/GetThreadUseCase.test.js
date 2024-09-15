const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CommentDetail = require("../../../Domains/comments/entities/CommentDetail");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const GetThreadUseCase = require("../GetThreadUseCase");

describe('GetThreadUseCase', () => {
  it('should be defined', () => expect(GetThreadUseCase).toBeDefined())

  it('should orchestrated the Get Thread detail process', async () => {

    const threadId = 'thread-123'

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThread = jest.fn().mockResolvedValue(
      {
        id: threadId,
        title: 'Some title',
        body: 'Some body',
        username: 'dicoding 1',
        date: '2024-09-11',
      }
    )
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue([
      {
        id: 'comment-123',
        username: 'dicoding 2',
        date: '2024-09-11',
        content: 'test comment',
        is_deleted: false,
      },
    ])

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    })


    //Action
    const threadDetail = await getThreadUseCase.execute(threadId)

    //Assert
    expect(threadDetail).toEqual({
      id: threadId,
      title: 'Some title',
      body: 'Some body',
      username: 'dicoding 1',
      date: '2024-09-11',
      comments: [{
        id: 'comment-123',
        username: 'dicoding 2',
        date: '2024-09-11',
        content: 'test comment',
      }],
    })
    expect(mockThreadRepository.getThread).toBeCalledWith(threadId)
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId)
  })

  it('should get thread comments deleted with message **komentar telah dihapus**', async () => {

    const threadId = 'thread-123'

    const expectedComments = [
      new CommentDetail({
        id: 'comment-123',
        username: 'dicoding 2',
        date: '2024-09-11',
        content: '**komentar telah dihapus**'
      }),
    ]

    const expectedThreadDetail = new ThreadDetail({
      id: threadId,
      title: 'Some title',
      body: 'Some body',
      username: 'dicoding 1',
      date: '2024-09-11',
      comments: []
    })



    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThread = jest.fn().mockResolvedValue(
      {
        id: threadId,
        title: 'Some title',
        body: 'Some body',
        username: 'dicoding 1',
        date: '2024-09-11',
      }
    )
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue([
      {
        id: 'comment-123',
        username: 'dicoding 2',
        date: '2024-09-11',
        content: 'test comment',
        is_deleted: true,
      },
    ])

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    })


    //Action
    const threadDetail = await getThreadUseCase.execute(threadId)

    //Assert
    expect(threadDetail).toEqual({
      id: threadId,
      title: 'Some title',
      body: 'Some body',
      username: 'dicoding 1',
      date: '2024-09-11',
      comments: [{
        id: 'comment-123',
        username: 'dicoding 2',
        date: '2024-09-11',
        content: '**komentar telah dihapus**',
      }],
    })
    expect(mockThreadRepository.getThread).toBeCalledWith(threadId)
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId)
    
    //explicitly check the comment content
    expect(threadDetail.comments[0].content).not.toEqual("test comment")
    expect(threadDetail.comments[0].content).toEqual("**komentar telah dihapus**")
  })
});