import fs from 'fs'

import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js';
import { parse } from 'path';

export const bugService = {
    query,
    getById,
    remove,
    save,
    parseBugFields
}
const PAGE_SIZE = 3
const FILE_PATH = './data/bug.json'
var bugs = utilService.readJsonFile(FILE_PATH)




async function query(filterBy = {}, sortBy = {}) {

    try {
        let bugsToReturn = [...bugs]

        // Filtering
        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            bugsToReturn = bugsToReturn.filter(bug => regExp.test(bug.title))
        }
        if (filterBy.minSeverity) {
            bugsToReturn = bugsToReturn.filter(bug => bug.severity >= +filterBy.minSeverity)
        }

        // Sorting
        if (sortBy.by === 'severity') {
            const dir = sortBy.sortDir ? +sortBy.sortDir : 1
            bugsToReturn.sort((b1, b2) => (b1.severity - b2.severity) * dir)
        } else if (sortBy.by === 'title') {
            const dir = sortBy.sortDir ? +sortBy.sortDir : 1
            bugsToReturn.sort((b1, b2) => (b1.title.localeCompare(b2.title) * dir))
        }

        // Pagination
        if (filterBy.pageIdx !== undefined) {
            const startIdx = +filterBy.pageIdx * PAGE_SIZE;
            bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
        }

        return bugsToReturn
    } catch (err) {
        loggerService.error('Couldnt get bugs : ', err)
        throw err
    }
}

async function getById(bugId) {
    try {
        var bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw `Couldn't find bug with _id ${bugId}`
        return bug
    } catch (err) {
        loggerService.error(err)
        throw (err)
    }
}

async function remove(bugId) {
    try {
        const idx = bugs.findIndex(bug => bug._id === bugId)
        if (idx === -1) throw `Couldn't find bug with _id ${bugId}`
        bugs.splice(idx, 1)

        await _saveBugsToFile(FILE_PATH)
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function save(bugToSave) {
    const fieldsToUpdate = parseBugFields(bugToSave)
    try {
        if (bugToSave._id) {
            var idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx === -1) throw `Couldn't find bug with _id ${bugToSave._id}`
            bugToSave = { ...bugs[idx], ...fieldsToUpdate }
            bugs.splice(idx, 1, bugToSave)
        } else {
            bugToSave = {
                ...fieldsToUpdate,
                _id: utilService.makeId(),
                createdAt: Date.now()
            }
            bugs.push(bugToSave)
        }
        await _saveBugsToFile(FILE_PATH)
        return bugToSave
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

function parseBugFields(bug) {
    // Peek only allwoed to update or add fields
    return {
        title: bug.title || '',
        severity: bug.severity || 0,
        labels: bug.labels || [],
        desc: bug.desc || '',
    }
}

function _saveBugsToFile(path) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
