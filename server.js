const express = require("express")

const APIrouter = require("./routes/router")


const app = express()
const PORT = 8080

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(__dirname + "/public"))
app.use("/api/products", APIrouter)

const server = app.listen(PORT, () => {
    console.log(`Express HTTP server running on port ${PORT}`)
})

server.on("error", error => console.log(`Server error: ${error}`))