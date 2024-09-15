module.exports = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.createThreadHandler,
    options: {
      auth: 'auth_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{thread_id}',
    handler: handler.getThreadByIdHandler,
  },
]