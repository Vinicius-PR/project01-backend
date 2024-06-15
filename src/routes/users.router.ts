import { Router } from 'express'

import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller'
import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const userRouter = Router()

userRouter.get('/', getAllUsers)
userRouter.get('/:id', getUserById)
userRouter.post('/', upload.single('userImage') ,createUser)
userRouter.put('/:id', upload.single('userImage') , updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter