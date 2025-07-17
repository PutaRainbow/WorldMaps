const express = require('express');
const router = express.Router();
const userService = require('../services/user')

router.get('/', userService.getUsers);
router.get('/:id', userService.getUserById);
router.post('/', userService.addUser);
router.put('/:id', userService.updateUser);
router.delete('/:id', userService.deleteUser);

module.exports = router;