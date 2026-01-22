const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()
const PORT = 3000
const dataPath = path.join(__dirname, "data.json")

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  next()
})

app.get("/items", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath))
  res.json(data.items)
})

app.post("/items", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath))

  data.items.push(req.body)

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
  res.json({ success: true })
})

app.put("/items/:id", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath))
  const index = data.items.findIndex(i => i.id == req.params.id)

  if (index === -1) {
    return res.status(404).json({ error: "Item not found" })
  }

  data.items[index] = req.body

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
  res.json({ success: true })
})
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
})
