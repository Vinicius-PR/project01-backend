import { Router } from 'express'

import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct
} from '../controllers/products.controller'

import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const productRouter = Router()

productRouter.get('/', getAllProducts)
productRouter.get('/:id', getProductById)
productRouter.post('/', upload.single('productImage'),  createProduct)
productRouter.put('/:id', upload.single('productImage'), updateProduct)
productRouter.delete('/:id', deleteProduct)

export default productRouter