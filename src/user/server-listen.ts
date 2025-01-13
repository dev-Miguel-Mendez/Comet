import server from "./server-setup.js";

console.clear()


server.listen(4000, 5000, () => {
	console.log("server is up on", server.server.address());
});
// server.listen(5000, () => {
// 	console.log("server is up on", server.server.address());
// });
// server.listen(6000, () => {
// 	console.log("server is up on", server.server.address());
// });