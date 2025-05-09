import express from 'express'
import { createResturant, getResturant, getResturantById } from '../controllers/resturant.controller.js'

const router = express.Router()

router.post('/', createResturant)
router.get('/', getResturant)
router.get('/:id', getResturantById);

export default router