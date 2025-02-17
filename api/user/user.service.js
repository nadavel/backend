import fs from 'fs'
import { utilService } from '../../services/util.service.js'

const FILE_PATH = './data/user.json'
let users = utilService.readJsonFile('data/user.json')

export const userService = {
    query,
    getById,
    remove,
    save,
    getByUsername
}



function query() {
    return Promise.resolve(users)
}

async function getById(userId) {
    try {
        const user = users.find(user => user._id === userId)
        if (!user) throw `User not found by userId : ${userId}`
        return user
    } catch (err) {
        loggerService.error('userService[getById] : ', err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const user = users.find(user => user.username === username)
        return user
    } catch (err) {
        loggerService.error('userService[getByUsername] : ', err)
        throw err
    }
}

async function remove(userId) {
    try {
        const idx = users.findIndex(user => user._id === userId)
        if (idx === -1) throw `Couldn't find user with _id ${causerIdrId}`

        users.splice(idx, 1)
        await _saveUsersToFile()
    } catch (err) {
        loggerService.error('userService[remove] : ', err)
        throw err
    }
}

// function save(user) {
//     user._id = utilService.makeId()
//     // TODO: severe security issue- attacker can post admins
//     users.push(user)
//     return _saveUsersToFile().then(() => user)

// }

async function save(userToSave) {
    const fieldsToUpdate = parseUserFields(userToSave)
    try {
        if (userToSave._id) {
            var idx = users.findIndex(user => user._id === userToSave._id)
            if (idx === -1) throw `Couldn't find user with _id ${userToSave._id}`
            userToSave = { ...users[idx], ...fieldsToUpdate }
            users.splice(idx, 1, userToSave)
        } else {
            userToSave = {
                ...fieldsToUpdate,
                _id: utilService.makeId(),
                createdAt: Date.now()
            }
            users.push(userToSave)
        }
        await _saveUsersToFile()
        return userToSave
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

function parseUserFields(user) {
    // Peek only allwoed to update or add fields
    return {
        fullname: user.fullname || '',
        username: user.username || '',
        password: user.password || '',
        score: 100
    }
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {

        const usersStr = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', usersStr, (err) => {
            if (err) {
                return console.log(err);
            }
            resolve()
        })
    })
}