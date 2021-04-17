const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller')

router.post('/', (req, res) => {
    userController.addUser(req, res);
}).get('/', (req, res) => {
    userController.getUsers(req, res);
}).get('/:userId', (req, res) => {
    userController.getUserById(req, res);
}).put('/depositing/:amount/:id',(req,res)=>{
    userController.depositing(req,res);
}).put('/updateCredit/:credit/:id',(req,res)=>{
    userController.updateCredit(req,res);
}).put('/withdrawMoney/:cash/:id',(req,res)=>{
    userController.withdrawMoney(req,res);
}).put('/transferring/:cash/:userId1/:userId2',(req,res)=>{
    userController.transferring(req,res);
}).delete('/:userId',(req,res)=>{
    userController.deleteUser(req,res);
}).get('/byAmount/:amount',(req,res)=>{
    userController.getUsersByAmount(req,res);
})

module.exports = router;