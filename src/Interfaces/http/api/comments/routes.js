module.exports = (handler) => [
  {
    method: 'POST',
    path: '/threads/{thread_id}/comments',
    handler: handler.addCommentToThreadHandler,
    options: {
      auth: 'auth_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{thread_id}/comments/{comment_id}',
    handler: handler.deleteCommentFromThreadHandler,
    options: {
      auth: 'auth_jwt',
    },
  },
]