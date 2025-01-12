import server from "./server-setup.js";

server.listen(3001, () => {
	console.log("server is up on", server.server.address());
});