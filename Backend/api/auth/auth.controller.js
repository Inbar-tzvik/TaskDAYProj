const authService = require('./auth.service')
const logger = require('../../services/logger.service')

async function login(req, res) {
    const currUser = req.body
    try {
        const user = await authService.login(currUser.username, currUser.password)
        req.session.user = user
            // console.log('try one from postman one from front, user:', user)
        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function getLoggedInUser(req, res) {
    try {
        // console.log(req.session.user);
        res.json(req.session.user)
        res.send({ msg: (user._id, 'is logged in') })
    } catch (err) {
        // TODO writh the right erroR!
        // res.status(500).send({ err: 'Failed to logout' })
    }
}

async function signup(req, res) {
    try {
        const { username, password, fullname } = req.body
            // Never log passwords
            // logger.debug(fullname + ', ' + username + ', ' + password)
        const account = await authService.signup(username, password, fullname)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(username, password)
        req.session.user = user
        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function logout(req, res) {
    try {
        // console.log('itzik:', req.session);
        req.session.destroy()
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}



module.exports = {
    login,
    signup,
    logout,
    getLoggedInUser
}