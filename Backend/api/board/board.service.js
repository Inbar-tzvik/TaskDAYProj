const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId


// THIS IS FOR LOCAL SERVER +  JSON DB!
// const fs = require('fs')
// const gBoards = require('../../data/board.json')
// function _saveBoardsToFile() {
//     return new Promise((resolve, reject) => {
//         fs.writeFile('data/board.json', JSON.stringify(gBoards, null, 2), (err) => {
//             if (err) return reject(err)
//             resolve();
//         })
//     })
// }



async function query(filterBy) {
    // FOR MONGO + SERVER:
    try {
        // const criteria = _buildCriteria(filterBy)
        const criteria = {}

        const collection = await dbService.getCollection('board')
        var boards = await collection.find(criteria).toArray()
            // boards.sort((board1, board2) => board2.price - board1.price) WORKING!
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
    // FOR LOCAL DB + SERVER:
    // try {
    //     // const regex = new RegExp(filterBy.title, 'i')
    //     // var bugs = gBugs.filter(bug => regex.test(bug.title))

    //     return gBoards
    // } catch (err) {
    //     logger.error('cannot find boards', err)
    //     throw err
    // }
}

async function getById(boardId) {
    //  FOR MONGO + SERVER:
    try {
        const collection = await dbService.getCollection('board')
        const board = collection.findOne({ '_id': ObjectId(boardId) })
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }

    // FOR LOCAL DB + SERVER:
    // try {
    //     const board = gBoards.find(board => board._id === boardId)
    //     return board
    // } catch (err) {
    //     logger.error(`while finding board ${boardId}`, err)
    //     throw err
    // }
}

async function remove(boardId) {
    // FOR MONGO + SERVER:
    try {
        const collection = await dbService.getCollection('board')
        await collection.deleteOne({ '_id': ObjectId(boardId) })
        return boardId
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }

    // FOR LOCAL DB + SERVER:
    // try {
    //     var removeIdx = gBoards.findIndex(board => board._id === boardId)
    //     gBoards.splice(removeIdx, 1)
    //     _saveBoardsToFile()
    //     return boardId
    // } catch (err) {
    //     logger.error('cannot insert board', err)
    //     throw err
    // }
}

async function add(board) {
    // FOR MONGO + SERVER:
    try {
        const collection = await dbService.getCollection('board')
        const addedBoard = await collection.insertOne(board)
        return addedBoard
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }

    // FOR LOCAL DB + SERVER:
    // try {
    //     gBoards.push(board)
    //     _saveBoardsToFile()
    //     return board
    // } catch (err) {
    //     logger.error('cannot insert board', err)
    //     throw err
    // }
}
async function update(board) {
    // FOR MONGO + SERVER:
    try {
        var id = ObjectId(board._id)
            // TO ASK SHANI, why delete the id?
        delete board._id
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ "_id": id }, { $set: {...board } })
        return board
    } catch (err) {
        logger.error(`cannot update board ${boardId}`, err)
        throw err
    }

    // FOR LOCAL DB + SERVER:
    // try {
    //     var updateIdx = gBoards.findIndex(boardFromBoards => boardFromBoards._id === board._id)
    //     gBoards[updateIdx] = board
    //     _saveBoardsToFile()
    //     return board
    // } catch (err) {
    //     logger.error('cannot insert board', err)
    //     throw err
    // }


}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}