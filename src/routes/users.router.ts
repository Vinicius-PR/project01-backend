import { Router } from 'express'

import { getAllUsers, getUserById, createUser, updateUser, deleteUser, updateUserImage } from '../controllers/user.controller'
import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const userRouter = Router()

userRouter.get('/', getAllUsers)
userRouter.get('/:id', getUserById)
userRouter.post('/', upload.single('userImage') ,createUser)
userRouter.put('/:id', updateUser)
userRouter.put('/updateuserimage/:id', upload.single('userImage') , updateUserImage)
userRouter.delete('/:id', deleteUser)

export default userRouter