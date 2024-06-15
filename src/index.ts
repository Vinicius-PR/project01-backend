import express from 'express'
import userRouter from './routes/users.router'
import productRouter from './routes/products.router'
import cors from 'cors'


const app = express()
const port = 8080

app.use(express.json())
app.use(cors())
app.use('/user', userRouter)
app.use('/product', productRouter)

app.listen(port, () => {
  console.log(`Server up and running on port: ${port}`)
})