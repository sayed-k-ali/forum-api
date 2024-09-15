/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('comments', {
    id: {
      type: "VARCHAR(64)",
      primaryKey: true,
    },
    content: {
      type: "TEXT"
    },
    thread_id: {
      type: "VARCHAR(64)",
    },
    user_id: {
      type: "VARCHAR(64)"
    },
    is_deleted: {
      type: "BOOLEAN",
      default: false,
    },
    date: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
};

exports.down = pgm => {
  pgm.dropTable('comments')
};
