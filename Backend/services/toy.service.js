const fs = require('fs')


// CRUDL : CREATE, READ, UPDATE, DELETE, LIST

const gToys = require('../data/toy.json')

const PAGE_SIZE = 3

function countToysByUser(userId) {
    // console.log('userId:', userId, 'currtoy:', toy);
    var toysCount = 0;
    gToys.forEach(toy => {
        console.log('toy', gToys);
        if (toy.creator._id === userId) toysCount++
    });
    // console.log(toysCount);
    return Promise.resolve({ toysCount: 3 })
}

function query(filterBy) {
    const regex = new RegExp(filterBy.name, 'i')
    var toys = gToys.filter(toy => regex.test(toy.name))

    console.log(filterBy);
    if (!filterBy.inStock) {
        toys.sort((toy1, toy2) =>
            (Number(toy1.inStock) - Number(toy2.inStock))
        )
    } else {
        toys.sort((toy1, toy2) =>
            (Number(toy2.inStock) - Number(toy1.inStock))
        )
    }

    if (filterBy.page) {
        startIdx = filterBy.page * PAGE_SIZE
        toys = toys.slice(startIdx, startIdx + PAGE_SIZE)
    }
    return Promise.resolve(toys)
}

function getById(toyId) {
    // console.log(gToys);
    const toy = gToys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = gToys.findIndex(toy => toy._id === toyId)
    gToys.splice(idx, 1)
    return _saveToysToFile()
}

function save({ _id, name, price, lables = [], inStock = true, reviews = [] }, user) {
    // function save(butToSave) {
    const toyToSave = {
        _id,
        name,
        price,
        lables,
        inStock,
        reviews
        // createdAt: new Date(),
        // creator: {
        //     _id: user._id,
        //     username: user.username,
        // }
    }

    if (_id) {
        const idx = gToys.findIndex(toy => toy._id === _id)
        gToys[idx] = toyToSave
    } else {
        // CREATE
        toyToSave._id = _makeId()
        gToys.unshift(toyToSave)
    }
    return _saveToysToFile().then(() => toyToSave)
}


function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/toy.json', JSON.stringify(gToys, null, 2), (err) => {
            if (err) return reject(err)
            resolve();
        })
    })
}

function _makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

module.exports = {
    query,
    getById,
    remove,
    save,
    countToysByUser
}