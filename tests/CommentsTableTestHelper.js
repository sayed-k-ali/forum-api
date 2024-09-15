/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableHelper = {

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
  async addCommentToThread({
    id = 'comment-123', thread_id = 'thread-123', user_id = 'user-123', content = 'Unit Testing', is_deleted = false
  }) {
    return pool.query("INSERT INTO comments(id, content, thread_id, user_id, is_deleted) VALUES($1, $2, $3, $4, $5)", [id, content, thread_id, user_id, is_deleted])

  },
  async getCommentById(commentId) {
    return (await pool.query("SELECT * FROM comments WHERE id = $1", [commentId])).rows[0];
  }

};

module.exports = CommentsTableHelper;
