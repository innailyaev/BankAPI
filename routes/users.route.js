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
    userController.UpdateCredit(req,res);
}).put('/withdrawMoney/:cash/:id',(req,res)=>{
    userController.WithdrawMoney(req,res);
}).put('/transferring/:cash/:userId1/:userId2',(req,res)=>{
    userController.Transferring(req,res);
}).delete('/:userId',(req,res)=>{
    userController.deleteUser(req,res);
})

module.exports = router;