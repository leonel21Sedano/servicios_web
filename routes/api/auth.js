const express = require('express');
const router = express.Router();
const authService = require('../../services/auth');
require('dotenv').config();

router.post("/register", async(req, res) => {
    await authService.register(req, res);
});

router.post("/login", async(req, res) => {
    await authService.login(req, res);
});

module.exports = router;