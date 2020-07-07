var models = require('../models');

async function CreateOrUpdatePermissions(req, res, user, actionType) {

    let permissionList = req.body.permissions;
    
    console.log(permissionList);
    
    console.log('type of permission list is ' + typeof permissionList);
    
    // check the size of the category list
    // console.log(permissionList.length);
    
    // I am checking if permissionList exist
    if (permissionList) { 
        
        // I am checking if only 1 permission has been selected
        // if only one permission then use the simple case scenario for adding permission
        if(permissionList.length === 1) {
            
        // check if we have that permission that was selected in our database model for permission
        const permission = await models.Permission.findByPk(permissionList);
        
        console.log("These are the permissions " + permission);
        
        // check if permission exists
        if (!permission) {
            // destroy the user we created
             if(actionType == 'create') models.User.destroy({ where: {id: user.id}});
             return res.status(422).json({ status: false,  error: 'Cannot find that permission selected'});
        }
        
        //  remove association before update new entry inside UserPermission table if it exist
        if(actionType == 'update') {
            const oldPermissions = await user.getPermissions();
            await user.removePermissions(oldPermissions);
        }
        await user.addPermission(permission);
        return true;
    
    }
    
    // Ok now lets do for more than 1 permissions, the hard bit.
    // if more than one permissions have been selected
    else {
        
        if(typeof permissionList === 'object') {
            // Loop through all the ids in req.body.permissions i.e. the selected permissions
            await permissionList.forEach(async (id) => {
                // check if all permission selected are in the database
                const permission = await models.Permission.findByPk(id);
                
                if (!permission) {
                    // return res.status(400);
                    // destroy the user we created
                    if(actionType == 'create') models.User.destroy({ where: {id: user.id}});
                    return res.status(422).json({ status: false,  error: 'Cannot find that permission selected'});
                }
                
                // remove association before if update
                if(actionType == 'update') {
                    const oldPermissions = await user.getPermissions();
                    await user.removePermissions(oldPermissions);
                }
                 await user.addPermission(permission);
            });
            
            return true;
            
        } else {
            // destroy the user we created
            if(actionType == 'create') models.User.destroy({ where: {id: user.id}});
            return res.status(422).json({ status: false,  error: 'Type of permission list is not an object'});
        }
    }} else {
            if(actionType == 'create') { models.User.destroy({ where: {id: user.id}});}
            return res.status(422).json({ status: false,  error: 'No permission selected'});
        }
    
}