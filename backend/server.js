import server from "./app.js";

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
