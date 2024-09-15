const CommentHandler = require("./handlers");
const routes = require("./routes");

module.exports = {
  name: 'comments',
  register: (server, {container}) => {
    const commentHandler = new CommentHandler(container);
    server.route(routes(commentHandler))
  }
}