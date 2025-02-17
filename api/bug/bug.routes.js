import express from 'express'
import { addBug, getBug, getBugs, removeBug, updateBug } from './bug.controller.js'
import { log } from '../../middlewares/log.middleware.js'

const router = express.Router()


router.get('/', log, getBugs)
router.get('/:bugId',log, getBug)
router.delete('/:bugId',log, removeBug)
router.post('/',log, addBug)
router.put('/',log, updateBug)



export const bugRoutes = router