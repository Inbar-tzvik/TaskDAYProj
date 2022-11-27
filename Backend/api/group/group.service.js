const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

//FOR LOCAL DATA AND SERVER
const fs = require('fs')
    // const gBoards = require('../../data/board.json')

function _saveBoardsToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/board.json', JSON.stringify(gBoards, null, 2), (err) => {
            if (err) return reject(err)
            resolve();
        })
    })
}


async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('board')
        const groups = await collection.find().toArray()
        return groups
    } catch (err) {
        logger.error('cannot find groups', err)
        throw err
    }

}
async function update(boardId, group) {
    //MONGO
    try {
        const _id = ObjectId(boardId)
        const collection = await dbService.getCollection('board')
        const resGroup = await collection.updateOne({ "_id": _id, "groups.id": group.id }, {
            $set: {
                "groups.$": group
            }
        })
        return resGroup
    } catch (err) {
        console.log(err);
        logger.error('cannot find group', err)
        throw err
    }


    // LOCAL:
    // try {
    //     const boardIdx = gBoards.findIndex(board => board._id === boardId)
    //     const groupIdx = gBoards[boardIdx].groups.findIndex(groupFromGroups => groupFromGroups.id === group.id)
    //     console.log('groupIdx', groupIdx);
    //     gBoards[boardIdx].groups[groupIdx] = group
    //     _saveBoardsToFile()
    //     return group
    // } catch (err) {
    //     console.log(err);
    //     logger.error('cannot find group', err)
    //     throw err
    // }




}

async function remove(boardId, groupId) {
    try {
        // const store = asyncLocalStorage.getStore()
        // const { userId, isAdmin } = store
        const _id = ObjectId(boardId)
        const collection = await dbService.getCollection('board')
            // remove only if user is owner/admin
            // const criteria = { _id: ObjectId(groupId) }
            // if (!isAdmin) criteria.byUserId = ObjectId(userId)
        await collection.updateOne({ "_id": _id, "groups.id": groupId }, {
            $unset: {
                "groups.$": groupId
            }
        })
    } catch (err) {
        logger.error(`cannot remove group ${groupId}`, err)
        throw err
    }
}


async function add(boardId, group) {
    try {

        const _id = ObjectId(boardId)
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ "_id": _id, }, {
            $push: {
                "groups": group
            }
        })
        return group;
    } catch (err) {
        logger.error('cannot insert group', err)
        console.log(err);
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    return criteria
}

module.exports = {
    query,
    remove,
    update,
    add
}