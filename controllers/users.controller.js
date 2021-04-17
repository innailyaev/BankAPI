// let uniqid = require('uniqid');
const fs = require('fs');
const { use } = require('../routes/users.route');
const usersJson = require('../users.json');
const users =usersJson;

const addUser = (req,res)=>{
    const {id,cash,credit} = req.body;
    let result = findUserById(id);

    if (!id) {
        return res.status(200).json({error: 'enter id'})
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
    fs.writeFileSync('./users.json', JSON.stringify(users));
    return res.send(obj);
}

const getUsers = (req,res)=>{
    console.log(usersJson.length);
    if(usersJson.length == 0)
        return res.send('No users yet');
    else
        return res.status(200).json({users : usersJson});
}

const getUserById = (req,res)=>{
    const {userId} = req.params;
    let user = findUserById(userId);
    if(user)
        return res.send(user);
    else
        return res.send('This user is not exist');
}

const depositing = (req,res) =>{
    let result = findUserById(req.params.id);
    if(result){
        users.map((u)=>{
            console.log(u);
            if(u.id == req.params.id){
                u.cash+=parseInt(req.params.amount);
                fs.writeFileSync('./users.json', JSON.stringify(users));
                return res.status(200).json({success: 'Amount of cash added to the user'});
            }   
        })
    }
    else{
        return res.status(200).json({success: 'This user is not exist'});
    }
}

const UpdateCredit = (req,res) =>{
    if((req.params.credit)>0){
        let result = findUserById(req.params.id);
        if(result){
            users.map((u)=>{
                if(u.id == req.params.id){
                    u.credit+=parseInt(req.params.credit);
                    fs.writeFileSync('./users.json', JSON.stringify(users));
                    return res.status(200).json({success: 'Credit updated'});
                }
            })
        }
        else{
            return res.status(200).json({success: 'This user is not exist'});
            }
        }
    else{
        return res.status(200).json({success: 'Negative credit is not allowed'});
    }  
}

const WithdrawMoney = (req,res)=>{
    if((req.params.cash) > 0){
    let result = findUserById(req.params.id);
        if(result){
            users.map((u)=>{
                if(u.id == req.params.id){
                    if((u.cash+u.credit) >= req.params.cash){
                        u.cash-=parseInt(req.params.cash);
                        fs.writeFileSync('./users.json', JSON.stringify(users));
                        return res.status(200).json({success: 'Withdrawal of funds was successful'});
                    }
                    else{
                        return res.status(200).json({success: 'The requested amount could not be withdrawn'});
                    }
                }
            })}
            else{
                return res.status(200).json({success: 'This user is not exist'});
            }
    }
    else{
        return res.status(200).json({success: 'Negative cash is not allowed'});
    } 
}

const Transferring = (req,res)=>{
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
                            return res.status(200).json({success: 'The requested amount could not be transfer'});
                        }
                    }
                })}
                else{
                    return res.status(200).json({success: 'User is not exist'});
                }
        }
        else{
            return res.status(200).json({success: 'Negative cash is not allowed'});
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
        return res.send('This user is not exist');
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
    depositing,
    UpdateCredit,
    WithdrawMoney,
    Transferring,
    deleteUser
}
