const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const CreatedThread = require("../../Domains/threads/entities/CreatedThread");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, generator) {
    super()
    this._pool = pool;
    this._idGenerator = generator;
  }
  async addThread(thread, authenticatedUserId) {
    const id = `thread-${this._idGenerator()}`

    const queryBuilder = {
      text: "INSERT INTO threads(id, title, body, user_id) VALUES ($1, $2, $3, $4) RETURNING id, title, user_id",
      values: [id, thread.title, thread.body, authenticatedUserId]
    }

    const result = await this._pool.query(queryBuilder)
    
    return new CreatedThread({...result.rows[0]})
  }

  async verifyThreadIfExist(threadId) {
    const queryBuilder = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [threadId]
    }

    const result = await this._pool.query(queryBuilder)

    if (result.rowCount == 0) {
      throw new NotFoundError("thread tidak ditemukan")
    }
  }

  async getThread(threadId) {
    const queryBuilder = {
      text: `
        SELECT t.id, t.title, t.body, t.date, u.username 
        FROM threads t
        INNER JOIN users u ON t.user_id = u.id
        WHERE t.id = $1
        `,
      values: [threadId]
    }
    
    const result = await this._pool.query(queryBuilder)

    if (result.rowCount == 0) {
      throw new NotFoundError("thread tidak ditemukan")
    }

    return result.rows[0]
  }

}

module.exports = ThreadRepositoryPostgres