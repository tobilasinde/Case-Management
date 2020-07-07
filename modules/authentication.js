const fetch = require("node-fetch");
var config = require('../config/config.global');
var CryptoJS = require("crypto-js");
var bCrypt = require('bcrypt-nodejs');


// var models = require('../modules/dbLayer');
var models = require('../models');
var User = models.user;
const { Op } = require("sequelize");
var passport = require('passport');
const auth = require('./auth');

function generateHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

var upsert = async function(values, condition) {
    return models.User
        .findOne({ where: condition })
        .then(function(obj) {
            // update
            if(obj)
                return obj.update(values);
            // insert
            return models.User.create(values);
        })
}
  
 
  
             
module.exports = function (req, res) {
  


  return async function (req, res, next) {

    let map={};
    
        /*
            * lets check authentication method
            * if it is config then pick values from config
            * if it is post then get values from post
        */
    

        if(config.authentication_method=="POST"){
            //we will get values from POST
    
            let data = req.body;
            data = JSON.parse(JSON.stringify(data));
            console.log('This is the req.body: ' + data);
            console.log('This is the app_key_hash: ' + data.app_key_hash);
            console.log('This is the module_id: ' + data.module_id);
            //let validate this data
            if(!data.hasOwnProperty('app_key_hash')){
                res.redirect('/error?error=Invalid access keys');
            }
    
            if(!data.hasOwnProperty('module_id')){
                res.redirect('/error?error=Invalid module');
            }
    
        map['module_id'] = data.module_id
        map['app_key'] = data.app_key_hash
        }
        else if(config.authentication_method=="CONFIG"){
            //we will get values from config
    
        let data = {};
        data.public_key = config.public_key
        data.private_key = config.private_key
    
        let data_json = JSON.stringify(data);
        
            //create hash key from the API keys (in POST method this hash is posted from dashboard )
        var ciphertext = CryptoJS.AES.encrypt(data_json,config.SALT);
            let app_key_hash = ciphertext.toString()
        
            map['app_key'] = app_key_hash
            //get module name from config, (in POST method this is also posted from the dashboard)
            map['module_name'] = config.module_name
    
        }
        
        // DONE WITH POST OR CONFIG ACCESS
        
        // USE APP HASH KEY GENERATED FROM POST REQUEST 
        
        map['api'] = 'module_access'

        let jsonmap = JSON.stringify(map);
        console.log('This is jsonmap: ' + jsonmap);
        
        let response = await fetch(config.API_URL,{
            method:'POST',
            async:false,
            body:jsonmap,
            headers: {'content-type': 'application/json' }
        });
        
        console.log('This is response from api call with hashkey/modulename/apiUrl: ' + response);

        req.ret_data = await response.json();
        
        console.log('This is response req ' + req);

        console.log('This is response req.ret_data ' + req.ret_data);
        
        console.log('This is response req.ret_data.data ' + req.ret_data.data);

        console.log('This is ret_data');
        
        req.session.ret_data = req.ret_data;
        
        console.log('This is req.session.ret_data '+ req.session.ret_data);
        
        if(req.ret_data.status){
            if(req.ret_data.data.permission=="" || req.ret_data.data.permission=="no" || req.ret_data.data.permission==false){
                res.redirect('error?error=You have no permissions on this module');
                next();
            } else{
                console.log('EVERYTHING IS GOOD 1');
                console.log('CREATE OR UPDATE USER RECORDS IN DB');
                
                var response_data = req.ret_data.data
                
                const username = response_data.user_detail.user_name;
            
                var password =  'mamajide2'; // only for testing
                
                //var password =  response_data.user_detail.user_name + response_data.user_detail.account_id + response_data.current_business;
                
                var userPassword = generateHash(password);
                
                const name = response_data.user_detail.name;
                const module_name = response_data.module_name;
                const email = response_data.user_detail.email;
                const module_id = response_data.module_id;
                const account_id = response_data.user_detail.account_id;
                const permission = response_data.permission;
                const profile_name = response_data.profile;
                const role_name = response_data.role_details.role_name;
                const current_business = response_data.current_business;

                // not used but for testing purpose
                // const status = 'inactive';
                
                var department_name = 'Owner';
                if (typeof response_data.department_name !== 'undefined')
                {
                    department_name = response_data.department_name;
                }  
                console.log('department_name: ' + department_name);
                console.log('module_id: ' + module_id);
                console.log('url: ' + response_data.url);
                console.log('permission ' + permission);
                console.log('account_id: ' + account_id);
                console.log('username: ' + username);
                console.log('name: ' + name);
                console.log('email ' + email);
                console.log('module_name: ' + module_name);
                console.log('current_business: ' + current_business);
                console.log('role name ' + role_name);
                console.log('profile ' + profile_name);
                
                // lets get or create the Id's of the department, profile, role and current Business coming from API.
                let department = await models.Department.findOrCreate({where: {department_name: department_name}});
                let role = await models.Role.findOrCreate({where: {role_name:  role_name}});
                let profile = await models.Profile.findOrCreate({where: {profile_name: profile_name}});
                let currentBusiness = await models.CurrentBusiness.findOrCreate({where: {current_business_name: current_business }});
                
                console.log('Department ID ' + department[0].id);
                console.log('Role ID ' + role[0].role_name);
                console.log('Profile ' + profile[0].id);
                console.log('Current Business ' + currentBusiness[0].id);
                
                // not used but for testing purpose
                // console.log('status ' + status);
                
                 // create a new user with the password hash from bcrypt
                let user = await upsert({ 
                     username: username,
                     password: userPassword,
                     name: name,
                     module_name: module_name,
                     email: email,
                     module_id: module_id,
                     account_id: account_id,
                     permission: permission,
                     ProfileId: profile[0].id,
                     DepartmentId: department[0].id,
                     CurrentBusinessId: currentBusiness[0].id,
                     RoleId: role[0].id
                     // update where email and current business matches
                }, { email: email,  CurrentBusinessId: currentBusiness[0].id });
                
                console.log(user);
                console.log('email '+ user.email);
                console.log('current business ' + user.CurrentBusinessId);
                console.log('password ' + user.password);
                
                console.log('I am done creating or updating user');

                // automatically logs user in and redirect to /user to confirm user has been logged in
                auth.checkCredentials( user.email, user.CurrentBusinessId, password, ( err, user ) => {
                    if( err ) {
                        res.redirect('https://manifestusermodule.herokuapp.com/login');
                        return next();
                    }
                    req.login(user, function() {
                        next();
                    } );

                } )
            }
            
        }
        else{
    
            var message = 'Invalid request';
            if(req.ret_data.hasOwnProperty('message') && (typeof req.ret_data.message === 'string' || req.ret_data.message instanceof String)){
                //we have message in response and that message is string
                message = req.ret_data.message
            }
            
            message = encodeURIComponent(message);
            
            res.redirect('error?error='+ message);
            next();
        }
  }
}

