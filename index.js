const express = require("express")
const exphbs = require("express-handlebars")
const pool = require("./db/conn") // importar o banco de dados de uma pasta que possui tudo

const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set("view engine", "handlebars")

app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("home")
})

// Basicamente estamos criando uma rota de post, para "/books/insertbook"
app.post("/books/insertbook", (req, res) => {
    // Aqui pegamos os dados que estão contidos na body
    const title = req.body.title
    const pageqty = req.body.pageqty
    // Instrução que será enviada para o banco de dados SQL
    const sql = `INSERT INTO books (??, ??) VALUES (?, ?)`
    const data = ["title", "pageqty", title, pageqty]

    pool.query(sql, data, function(err) {
        if (err) {
            console.log(err)
            return
        }
        // Voltar para o spawn
        res.redirect("/books")
    })
})
// Se a rota atual for "/books", recebe (get, tal dado)
app.get("/books", (req, res) => {
    const sql = "SELECT * FROM books"

    pool.query(sql, function(err, data) {
        if (err) {
            console.log(err)
            return
        }
        const books = data
        res.render("books", {books})
    })
})

app.get("/books/:id", (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM books WHERE ?? = ?`
    const data = ["id", id]
    pool.query(sql, data, function(err, data) {
        if (err) {
            console.log(err)
            return
        }
        const book = data[0]
        res.render("book", {book})
    })
})

app.get("/books/edit/:id", (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM books WHERE ?? = ?`
    const data = ["id", id]
    pool.query(sql, data, function(err, data) {
        if (err) {
            console.log(err)
            return
        }
        const book = data[0]
        res.render("editbook", {book})
    })
})

app.post("/books/updatebook", (req,res) => {
    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ["title", title, "pageqty", pageqty, "id", id]

    pool.query(sql, data, function(err, data) {
        if (err) {
            console.log(err)
            return
        }
        res.redirect("/books")
    })
})

app.post('/books/remove/:id', function (req, res) {
  const id = req.params.id

  const query = `DELETE FROM books WHERE ?? = ?`

  const data = ["id", id]
  pool.query(query, data, function (err) {
    if (err) {
      console.log(err)
    }

    res.redirect(`/books`)
  })
})

app.listen(3000)