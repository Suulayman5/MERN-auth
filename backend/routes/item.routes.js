import express from 'express'
import { addItem, getItem } from '../controllers/item.controller.js'


const router = express.Router()

router.post('/', addItem)
router.get('/', getItem)

export default router