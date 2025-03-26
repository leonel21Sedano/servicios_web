const express = require('express');
const router = express.Router();
require('dotenv').config();

const authRouter = require('./api/auth');
router.use( process.env.BASE_URL, authRouter );

module.exports = router;