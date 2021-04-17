// let uniqid = require('uniqid');
const fs = require('fs');
const usersJson = require('../users.json');
const users =usersJson;

const addUser = (req,res)=>{
    const {id,cash,credit} = req.body;
    let result = findUserById(id);

    if (!id) {
        return res.status(200).json({error: 'Enter id'})
    } 
    else if (result) {
        return res.status(200).json({error: 'User exist in DB'})
    }
    let obj={
        id: id,
        cash: cash,
        credit: credit
    };
    users.push(obj);
    try {
        fs.writeFileSync('./users.json', JSON.stringify(users));
        return res.send(obj);
    } catch(err) {
        console.error(err);
    }   
}

const getUsers = (req,res)=>{
    if(usersJson.length == 0)
        return res.status(200).send('No users yet');
    else
        return res.status(200).json({users : usersJson});
}

const getUserById = (req,res)=>{
    const {userId} = req.params;
    let user = findUserById(userId);
    if(user)
        return res.send(user);
    else
        return res.status(404).send('User not found');
}

const getUsersByAmount= (req,res)=>{
    const {amount} = req.params;
    let usersByAmount = users.filter((u)=>{
        return u.cash == amount;      
    })
    if(usersByAmount.length > 0)
        return res.send(usersByAmount);
    else
        return res.send('No results');
}

const depositing = (req,res) =>{
    if((req.params.amount) > 0){
        let result = findUserById(req.params.id);
        if(result){
            users.map((u)=>{
                if(u.id == req.params.id){
                    u.cash+=parseInt(req.params.amount);
                    try{
                        fs.writeFileSync('./users.json', JSON.stringify(users));
                        return res.status(200).json({success: 'The deposit was made successfully'});
                    }catch(err){
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                    }   
                }   
            })
        }
        else{
            return res.status(404).send('User not found');
        }
    }
    else{
        return res.status(400).send('Bad request, Negative amount is not allowed');
    }
}

const updateCredit = (req,res) =>{
    if((req.params.credit)>0){
        let result = findUserById(req.params.id);
        if(result){
            users.map((u)=>{
                if(u.id == req.params.id){
                    u.credit+=parseInt(req.params.credit);
                    try{
                        fs.writeFileSync('./users.json', JSON.stringify(users));
                        return res.status(200).json({success: 'Credit updated'});
                    }catch(err) {
                        console.error(err);
                        res.status(500).send('Internal Server Error');
                    }   
                }
            })
        }
        else{
            return res.status(404).send('User not found');
        }
        }
    else{
        return res.status(400).send('Bad request, Negative credit is not allowed');
    }  
}

const withdrawMoney = (req,res)=>{
    if((req.params.cash) > 0){
    let result = findUserById(req.params.id);
        if(result){
            users.map((u)=>{
                if(u.id == req.params.id){
                    if((u.cash+u.credit) >= req.params.cash){
                        u.cash-=parseInt(req.params.cash);
                        try{
                            fs.writeFileSync('./users.json', JSON.stringify(users));
                            return res.status(200).json({success: 'Withdrawal of funds was successful'});
                        }catch(err) {
                            console.error(err);
                            res.status(500).send('Internal Server Error');
                        }   
                    }
                    else{
                        return res.status(200).send('The requested amount could not be withdrawn');
                    }
                }
            })}
            else{
                return res.status(404).send('User not found');
            }
    }
    else{
        return res.status(400).send('Bad request, Negative cash is not allowed');
    } 
}

const transferring = (req,res)=>{
    if((req.params.cash) > 0){
        let result1 = findUserById(req.params.userId1);
        let result2 = findUserById(req.params.userId2);

            if(result1 && result2){
                users.map((u)=>{
                    if(u.id == req.params.userId1){
                        if((u.cash+u.credit) >= req.params.cash){
                            u.cash-=parseInt(req.params.cash);
                            users.map((u)=>{
                                if(u.id == req.params.userId2){
                                    u.cash+=parseInt(req.params.cash);
                                    fs.writeFileSync('./users.json', JSON.stringify(users));
                                    return res.status(200).json({success: 'Transfer completed successfully'});
                                }
                            })
                        }
                        else{
                            return res.status(200).send('The requested amount could not be transfer');
                        }
                    }
                })}
                else{
                    return res.status(404).send('User not found');
                }
    }
    else{
        return res.status(400).send('Bad request, Negative cash is not allowed');
    } 
}

const deleteUser = (req,res) =>{
    const {userId} = req.params;
    let user = findUserById(userId);
    if(user){
        users.map((u,index)=>{
            if(u.id == userId){
                users.splice(index,1);
                fs.writeFileSync('./users.json', JSON.stringify(users));
                return res.status(200).json({success: 'User deleted successfully'});
            }
        })
    }
    else
        return res.status(404).send('User not found');
}


const findUserById = (id) =>{
    let result = users.find((u) => {
        return u.id == id;
    })
    return result;
}

module.exports = {
    addUser,
    getUsers,
    getUserById,
    getUsersByAmount,
    depositing,
    updateCredit,
    withdrawMoney,
    transferring,
    deleteUser
}
