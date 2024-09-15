const ThreadsHandler = require("./handlers");
const routes = require("./routes");

module.exports = {
  name: 'threads',
  register: (server, {container}) => {
    const threadsHandler = new ThreadsHandler(container);
    server.route(routes(threadsHandler))
  }
}