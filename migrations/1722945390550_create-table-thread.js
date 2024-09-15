/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(64)",
      primaryKey: true,
    },
    title: {
      type: "TEXT"
    },
    body: {
      type: "TEXT"
    },
    user_id: {
      type: "VARCHAR(64)"
    },
    date: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
};

exports.down = pgm => {
  pgm.dropTable("threads")
};
