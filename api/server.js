// See https://github.com/typicode/json-server#module
const fs = require("fs")
const path = require("path")
const db = JSON.parse(fs.readFileSync(path.join("db.json")))
const jsonServer = require('json-server')

const server = jsonServer.create()

// Uncomment to allow write operations
// const fs = require('fs')
// const path = require('path')
// const filePath = path.join('db.json')
// const data = fs.readFileSync(filePath, "utf-8");
// const db = JSON.parse(data);
// const router = jsonServer.router(db)

// Comment out to allow write operations
const router = jsonServer.router(db)

const middlewares = jsonServer.defaults()

server.use(middlewares)
// Add this before server.use(router)
server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
}))

server.use((req, res, next) => {
    if (req.url.includes("/flag")) {
      const { admin, binary, id } = req.query;
      const user = db.users && db.users.find((u) => u.id === id); // match as string
  
      // Check if user exists, admin is true, and binary is 101
      if (user && admin === "true" && binary === "101") {
        return res.json({ flag: "Admin NOW HURRAY" });
      } else {
        return res.status(403).json({ error: "Unauthorized" });
      }
    }
    next();
  });
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server
