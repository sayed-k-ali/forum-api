/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableHelper = {

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },

  async createThread({
    id = 'thread-123', user_id = 'user-123', title = 'Unit Testing', body = 'Example unit testing'
  }) {
    return pool.query("INSERT INTO threads(id, title, body, user_id) VALUES($1, $2, $3, $4)", [id, title, body, user_id])

  },

  async getThreadById(threadId) {
    const queryBuilder = {
      text: `
        SELECT t.id, t.title, t.body, t.date, u.username 
        FROM threads t
        INNER JOIN users u ON t.user_id = u.id
        WHERE t.id = $1
        `,
      values: [threadId]
    }
    
    const result = await pool.query(queryBuilder)

    return result.rows[0]
  }
};

module.exports = ThreadsTableHelper;
