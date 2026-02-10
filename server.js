import express from 'express'
const app = express()

app.use(express.json())

app.get('/', (request, response) => {
  return response.json({ message: "Olá, mundo. Estou utilizando Gimini AI" })
})

app.listen(3333, () => {
  console.log(`Servidor rodando na porta http://localhost:3333`)
})