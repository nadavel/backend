import { userService } from './user.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getUser(req, res) {
    loggerService.info(`getUser called with id ${req.params.id}`)
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        loggerService.error('Failed to get user', err)
        res.status(400).send({ err: 'Failed to get user' })
    }
}

export async function getUsers(req, res) {
    loggerService.info(`getUsers called`)
    try {
        const filterBy = {
            txt: req.query.txt || '',
            minBalance: +req.query.minBalance || 0
        }
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        loggerService.error('Failed to get users', err)
        res.status(400).send({ err: 'Failed to get users' })
    }
}

export async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        loggerService.error('Failed to delete user', err)
        res.status(400).send({ err: 'Failed to delete user' })
    }
}

export async function updateUser(req, res) {
    loggerService.info(`updateUser called with ${JSON.stringify(req.body, null, 2)}`)
    try {
        const user = req.body
        const savedUser = await userService.save(user)
        res.send(savedUser)
        loggerService.info(`updateUser saved ${JSON.stringify(savedUser, null, 2)}`)
    } catch (err) {
        loggerService.error('Failed to update user', err)
        res.status(400).send({ err: 'Failed to update user' })
    }
}

export async function addUser(req, res) {
    console.log(req.body)
    loggerService.info(`addUser called with ${JSON.stringify(req.body, null, 2)}`)
    try {
        // Turn body into a bug -> only allowed fields
        // In class shown like this :
        // const bugToSave = {
        //     title: req.body.title,
        //     // Rest of allowed fields to update
        // }
        // const savedBug = await bugService.save(bugToSave)
        // Better option send the body and use a util function in the service.

        const savedUser = await userService.save(req.body)
        console.log(savedUser);
        
        loggerService.info(`addUser saved ${JSON.stringify(savedUser, null, 2)}`)
        res.send(savedUser)
    } catch (err) {
        loggerService.error(err)
        res.status(400).send(`Couldn't save bug`, err)
    }
}