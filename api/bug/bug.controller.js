import { bugService } from './bug.service.js'

// List
export async function getBugs(req, res) {
    try {
        const filterBy = {
            txt: req.query.filterBy.txt || '',
            minSeverity: req.query.filterBy.minSeverity || 0,
            pageIdx: req.query.filterBy.pageIdx
        }
        const sortBy = {
            by: req.query.sortBy.by || '',
            sortDir: req.query.sortBy.sortDir || ''
        }
        const bugs = await bugService.query(filterBy, sortBy)
        res.send(bugs)
    } catch (err) {
        res.status(400).send(`Couldn't get bugs`, err)
    }
}

// Get
export async function getBug(req, res) {
    try {
        const { bugId } = req.params
        let visitedBugIds = req.cookies.visitedBugIds || []
        if (!visitedBugIds.includes(bugId)) visitedBugIds.push(bugId)
        if (visitedBugIds.length > 3) return res.status(404).send('Wait for a bit')
        const bug = await bugService.getById(bugId)
        res.cookie('visitedBugIds', visitedBugIds, { maxAge: 1000 * 60 * 3 })
        res.send(bug)
    } catch (err) {
        res.status(400).send(`Couldn't get bug`, err)
    }
}

// // Delete
export async function removeBug(req, res) {
    const { bugId } = req.params

    try {
        await bugService.remove(bugId)
        res.send('Deleted OK')
    } catch (err) {
        res.status(400).send(`Couldn't remove bug`, err)
    }
}


// // Save
export async function addBug(req, res) {

    try {
        // Turn body into a bug -> only allowed fields
        // In class shown like this :
        // const bugToSave = {
        //     title: req.body.title,
        //     // Rest of allowed fields to update
        // }
        // const savedBug = await bugService.save(bugToSave)
        // Better option send the body and use a util function in the service.

        const savedBug = await bugService.save(req.body)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(`Couldn't save bug`, err)
    }
}

export async function updateBug(req, res) {
    try {
        // In class shown like this :
        // const bugToSave = {
        //     title: req.body.title,
        //     // Rest of allowed fields to update
        // }
        // const savedBug = await bugService.save(bugToSave)

        // Better option send the body and use a util function in the service.

        const savedBug = await bugService.save(req.body)
        res.send(savedBug)
    } catch (err) {
        res.status(400).send(`Couldn't save bug`, err)
    }
}