var models = require('../models');

async function CreateOrUpdateCurrentBusiness (req, res, user, actionType) {
    
        console.log('user from create update function ' + user)
        
        // get current business id from request
        let currentBusinessId = req.body.current_business_id;
        
        // check if we have that current business that was selected from front end in our database model for current business
        const currentBusiness = await models.CurrentBusiness.findByPk(currentBusinessId);
        
        console.log("This is the current business " + currentBusiness);
        
        // if currentBusiness does not exist - return with status 400
        if (!currentBusiness) {
             // destroy the user we created because we can't find current business selected for the user
             if(actionType == 'create') models.User.destroy({ where: { id: user.id}});
             return res.status(422).json({ status: false,  error: 'Cannot find that current business selected'});
        } 
        
        // remove before add - to update entry inside UserCurrentBusinesses table
        if(actionType == 'update') {
            const oldCurrentBusinesses = await user.getCurrentbusinesses();
            await user.removeCurrentbusiness(oldCurrentBusinesses);
        }
        //otherwise just add
        await user.addCurrentbusiness(currentBusiness);
        
        return true; //transation completed so back to our create post
    
}
