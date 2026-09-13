const http = require("http")
const fs = require("fs")
const path = require("path")

const PORT = process.env.PORT || 3000
const PUBLIC_DIR = path.join(__dirname, "public")

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".json": "application/json",
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0])
  let filePath = path.join(PUBLIC_DIR, urlPath === "/" ? "index.html" : urlPath)

  // Prevent path traversal outside the public directory.
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403)
    res.end("Forbidden")
    return
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fall back to the bundled page for any unknown route (SPA-style).
      fs.readFile(path.join(PUBLIC_DIR, "index.html"), (e, html) => {
        if (e) {
          res.writeHead(404)
          res.end("Not found")
          return
        }
        res.writeHead(200, { "Content-Type": MIME[".html"] })
        res.end(html)
      })
      return
    }
    const ext = path.extname(filePath)
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" })
    res.end(data)
  })
})

server.listen(PORT, () => {
  console.log(`[v0] Portfolio server running on http://localhost:${PORT}`)
})
