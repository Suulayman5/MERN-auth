import express from 'express'
import { addCategory, getCategory, getCategoryWithItems } from '../controllers/category.controller.js';

const router = express.Router()

router.post('/', addCategory)
router.get('/', getCategory)
router.get('/:categoryId/items', getCategoryWithItems);

export default router
