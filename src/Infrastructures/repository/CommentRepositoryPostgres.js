const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const CreatedThreadComment = require("../../Domains/comments/entities/CreatedThreadComment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentToThread(comment, threadId, authenticatedUserId) {
    const id = `comment-${this._idGenerator()}`;

    const queryBuilder = {
      text: "INSERT INTO comments(id, content, thread_id, user_id) VALUES ($1, $2, $3, $4) RETURNING id, content, thread_id, user_id",
      values: [id, comment.content, threadId, authenticatedUserId]
    }

    const result = await this._pool.query(queryBuilder)

    return new CreatedThreadComment({...result.rows[0]})
  }

  async getCommentsByThreadId(threadId) {
    const queryBuilder = {
      text: `SELECT comments.id, comments.date, comments.content, comments.is_deleted, users.username
        FROM comments
        INNER JOIN users ON comments.user_id = users.id
        WHERE thread_id = $1
        ORDER BY DATE ASC`,
      values: [threadId],
    }

    const result = await this._pool.query(queryBuilder)

    return result.rows
  }

  async verifyCommentIfExist(commentId) {
    const queryBuilder = {
      text: "SELECT id FROM comments WHERE id = $1",
      values: [commentId]
    }

    const result = await this._pool.query(queryBuilder)

    if (result.rowCount == 0) {
      throw new NotFoundError("komentar tidak ditemukan")
    }
  }

  async verifyCommentFromTheAppropriateOwner(commentId, authenticatedUserId) {
    const queryBuilder = {
      text: "SELECT id FROM comments WHERE id = $1 AND user_id = $2",
      values: [commentId, authenticatedUserId]
    }

    const result = await this._pool.query(queryBuilder)

    if (result.rowCount == 0) {
      throw new AuthorizationError("anda bukan pemilik komentar")
    }

  }

  async deleteComment(commentId) {
    const queryBuilder = {
      text: "UPDATE comments SET is_deleted = true WHERE id = $1 RETURNING id, content, is_deleted",
      values: [commentId]
    }

    const result = await this._pool.query(queryBuilder)

    return result.rows[0]

  }
}

module.exports = CommentRepositoryPostgres