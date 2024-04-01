const express = require('express')
const authUser = require('../middlewares/authUser')
const router = express.Router()

router.post("/login", authUser);


module.exports = router;
