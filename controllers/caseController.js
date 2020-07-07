var Case = require('../models/case');
var models = require('../models');

var async = require('async');

const loggedInUser = {id:23, CurrentBusinessId:1}
// Display case create form on GET.
exports.getCaseCreate = async function(req, res, next) {
    
    // create User GET controller logic here 
    const users = await models.User.findAll();
    const departments = await models.Department.findAll({
        include: [{
            model: models.User,
            where: {
                CurrentBusinessId: loggedInUser.CurrentBusinessId
            }
        }]
    });
    
    res.render('pages/content', {
        title: 'Create a Case Record',
        users: users,
        departments: departments,
        functioName: 'GET CASE CREATE',
        layout: 'layouts/detail'
    });
    console.log("Case form renders successfully")
};


// Handle case create on CASE.
exports.postCaseCreate = async function( req, res, next) {
    
    
    // console.log("This is user id of the user selected " + req.body.user_id)
    
    // get the user id that is creating the case
    let user_id = loggedInUser.id;
    
    try{
    // get full details of the user that is creating the case i.e. Department and Current Business
    const user = await models.User.findByPk(
        user_id,
        {
            // include:
            // [
            //     {
            //         model: models.Department 
            //     },
            //     {
            //         model: models.Role,
            //         attributes: ['id', 'role_name']
            //     },
            //     {
            //         model: models.Profile,
            //         attributes: ['id', 'profile_name']
            //     },
            //     {
            //         model: models.Permission,
            //         as: 'permissions',
            //         attributes: ['id', 'permission_name']
            //     },
            //     {
            //         model: models.CurrentBusiness,
            //         // through: { where: { user_id: `${user_id}` } },
            //         as: 'currentbusinesses',
            //         attributes: ['id', 'current_business_name']
            //     },
                        
            // ]
        }
    );
 

    console.log('This is the user details making the case' + user);
    
    var currentBusinessId;
    
    // user.currentbusinesses.forEach(function(currentBusiness) {
    //     console.log('This is the user current business id making the case ' + currentBusiness.id);
    //     currentBusinessId = currentBusiness.id;
    // });
    
    console.log('This is the user department id making the case ' + loggedInUser.DepartmentId);
    
    let departmentId = loggedInUser.DepartmentId;
    
    // create the case with user current business and department
    var cases = await models.Case.create({
            case_title: req.body.case_title,
            case_body: req.body.case_body,
            UserId: user_id,
            DepartmentId: departmentId,
            CurrentBusinessId: currentBusinessId
            
        } 
    );
    
    console.log("The case id " + cases.id);

    
    // let's do what we did for user model
    var actionType = 'create';
        
        // START MANY TO MANY RELATIONSHIP (add categories)
        
        // INSERT PERMISSION MANY TO MANY RELATIONSHIP
        var addCategories = await CreateOrUpdateCategories (req, res, cases, actionType);
        
        console.log(addCategories);
        
        if(!addCategories){
            return res.status(422).json({ status: false,  error: 'Error occured while adding Categories'});
        }
        
        // END MANY TO MANY 
        
        console.log('Case Created Successfully');
        
        // everything done, now redirect....to case listing.
        res.redirect('/main/case/' + cases.id);
        
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        // not sure if we need to detsory the case? shall we?
        models.Case.destroy({ where: {id: cases.id}});
        res.render('pages/error', {
        title: 'Error',
        message: error,
        error: error
      });
    }
};

 

 


// Display case delete form on GET.
exports.getCaseDelete = async function(req, res, next) {
    // find the case
    const cases = await models.Case.findByPk(req.params.case_id);

    // Find and remove all associations (maybe not necessary with new libraries - automatically remove. Check Cascade)
    //const categories = await case.getCategories();
    //case.removeCategories(categories);

    // delete case 
    models.Case.destroy({
        // find the case_id to delete from database
        where: {
            id: req.params.case_id
        }
    }).then(function() {
        // If an case gets deleted successfully, we just redirect to cases list
        // no need to render a page
        res.redirect('/main/cases');
        console.log("Case deleted successfully");
    });
};


// Display case update form on GET.
exports.getCaseUpdate = async function(req, res, next) {
    // Find the case you want to update
    console.log("ID is " + req.params.case_id);
    const categories = await models.Category.findAll();
    const users = await models.User.findAll();
    // console.log('This is the user details making the case' + user);
    
    // var currentBusinessId;
    
    // user.currentbusinesses.forEach(function(currentBusiness) {
    //     console.log('This is the user current business id making the case ' + currentBusiness.id);
    //     currentBusinessId = currentBusiness.id;
    // });
    
    // console.log('This is the user department id making the case ' + user.Department.id);
    
    // let departmentId = user.Department.id
    
    models.Case.findByPk(
        req.params.case_id,
        {
            include:
            [
                        {
                            model: models.Department 
                        },
                        {
                            model: models.User 
                        },
                        {
                            model: models.CurrentBusiness
                        },
                        
            ]
        }
    ).then(function(cases) {
        console.log('this is case user ' + cases.User.first_name);
        // renders a case form
        res.render('pages/content', {
            title: 'Update Case',
            categories: categories,
            case: cases,
            users: users,
            // departments: departments,
            // currentBusinesses: currentBusinesses,
            functioName: 'GET CASE UPDATE',
            layout: 'layouts/detail'
        });
        console.log("Case update get successful");
    });

};


// Handle case update on CASE.
exports.postCaseUpdate = async function(req, res, next) {
    console.log("ID is " + req.params.case_id);

    // find the case
    const cases = await models.Case.findByPk(req.params.case_id);

    // Find and remove all associations 
    const categories = await cases.getCategories();
    cases.removeCategories(categories);


    // const category = await models.Category.findById(req.body.category_id);

    let cateoryList = req.body.categories;

    // check the size of the category list
    console.log(cateoryList.length);


    // I am checking if only 1 category has been selected
    // if only one category then use the simple case scenario
    if (cateoryList.length == 1) {
        // check if we have that category in our database
        const category = await models.Category.findByPk(req.body.categories);
        if (!category) {
            return res.status(400);
        }
        //otherwise add new entry inside CaseCategory table
        await cases.addCategory(category);
    }
    // Ok now lets do for more than 1 category, the hard bit.
    // if more than one category has been selected
    else {
        // Loop through all the ids in req.body.categories i.e. the selected categories
        await req.body.categories.forEach(async (id) => {
            // check if all category selected are in the database
            const category = await models.Category.findByPk(id);
            if (!category) {
                return res.status(400);
            }
            // add to CaseCategory after
            await cases.addCategory(category);
        });
    }

    // now update
    models.Case.update(
        // Values to update
        {
            case_title: req.body.case_title,
            case_body: req.body.case_body,
            UserId: req.body.user_id
        }, { // Clause
            where: {
                id: req.params.case_id
            }
        }
        //   returning: true, where: {id: req.params.case_id} 
    ).then(function() {
        // If an case gets updated successfully, we just redirect to cases list
        // no need to render a page
        res.redirect("/main/cases");
        console.log("Case updated successfully");
    });
};


// Display detail page for a specific case.
exports.getCaseDetails = async function(req, res, next) {
    
    console.log("I am in case details")
    // find a case by the primary key Pk
    models.Case.findByPk(
        req.params.case_id, {
            include: [
                
                {
                    model: models.User,
                    attributes: ['id', 'first_name', 'last_name']
                },
                {
                    model: models.Department,
                    attributes: ['id', 'department_name']
                },
                {
                    model: models.CurrentBusiness,
                    attributes: ['id', 'current_business_name']
                },
                {
                    model: models.Category,
                    as: 'categories',
                    required: false,
                    // Pass in the Category attributes that you want to retrieve
                    attributes: ['id', 'category_name']
                }

            ]

        }
    ).then(async function(cases) {
        console.log(cases)
        res.render('pages/content', {
            title: 'Case Details',
            functioName: 'GET CASE DETAILS',
            case: cases,
            layout: 'layouts/detail'
        });
        console.log("Case details renders successfully");
    });
};

     
                        
// Display list of all cases.
exports.getCaseList = function(req, res, next) {
    // controller logic to display all cases
    models.Case.findAll({
      
        // Make sure to include the categories
        include: [
            {
                model: models.User,
                attributes: ['id', 'first_name', 'last_name'],
                include: [
                    {
                        model: models.Department
                    },
                    {
                        model: models.CurrentBusiness
                    }
                    // ,
                    // {
                    //     model: models.CurrentBusiness,
                    //     as: 'currentbusinesses',
                    //     attributes: ['id', 'current_business_name']
                    // }
                ]
            },
            {
                model: models.Category,
                as: 'categories',
                attributes: ['id', 'category_name']
            }
        ]

    }).then(function(cases) {
        // renders a case list page
        console.log(cases);
        console.log("rendering case list");
        res.render('pages/content', {
            title: 'Case List',
            functioName: 'GET CASE LIST',
            cases: cases,
            layout: 'layouts/list'
        });
        console.log("Cases list renders successfully");
    });

};

exports.getCaseListByDepartment = async function(req, res, next) {
    
    let department_name = req.params.department_name;
    
    var department = await models.Department.findAll({where: {department_name: department_name}});
    
       for (var property in department) {
          if (department.hasOwnProperty(property)) {
            console.log(property);
          }
        }
                         
    console.log(' This is the department Id ' + department);
    
    console.log('This is the department name ' + department_name);
    
    var departmentname = req.params.department_name
     // controller logic to display all cases
    models.Case.findAll({
        where: { DepartmentId: 2},
        // Make sure to include the categories
        include: [
            {
                model: models.User,
                attributes: ['id', 'first_name', 'last_name', 'email'],
                include: [
                    {
                        model: models.Department,
                    },
                    {
                        model: models.CurrentBusiness,
                        as: 'currentbusinesses',
                        attributes: ['id', 'current_business_name']
                    }
                ]
            },
            {
                model: models.Category,
                as: 'categories',
                attributes: ['id', 'category_name']
            }
        ]

    }).then(function(cases) {
        // renders a case list page
        console.log(cases);
        console.log("rendering case list");
        res.render('pages/content', {
            title: 'Case List',
            functioName: 'GET CASE LIST',
            cases: cases,
            layout: 'layouts/list'
        });
        console.log("Cases list renders successfully");
    });

};
 

exports.getCaseListByEmail = async function(req, res, next) {
    
    let email = req.params.email;
    
    // const user = await models.User.findAll({ where: {email: email} });
    
    // controller logic to display all cases
    models.Case.findAll({
     
        // Make sure to include the categories
        include: [
            {
                model: models.User,
                where: { email: email  },
                attributes: ['id', 'first_name', 'last_name', 'email'],
                include: [
                    {
                        model: models.Department
                        },
                    {
                        model: models.CurrentBusiness,
                        as: 'currentbusinesses',
                        attributes: ['id', 'current_business_name']
                    }
                ]
            },
            {
                model: models.Category,
                as: 'categories',
                attributes: ['id', 'category_name']
            }
        ]

    }).then(function(cases) {
        // renders a case list page
        console.log(cases);
        console.log("rendering case list");
        res.render('pages/content', {
            title: 'Case List',
            functioName: 'GET CASE LIST',
            cases: cases,
            layout: 'layouts/list'
        });
        console.log("Cases list renders successfully");
    });

};
 
async function CreateOrUpdateCategories(req, res, cases, actionType) {

    let categoryList = req.body.categories;
    
    console.log(categoryList);
    
    console.log('type of category list is ' + typeof categoryList);
    
    // I am checking if categoryList exist
    if (categoryList) { 
        
        // I am checking if only 1 category has been selected
        // if only one category then use the simple case scenario for adding category
        if(categoryList.length === 1) {
            
        // check if we have that category that was selected in our database model for category
        const category = await models.Category.findByPk(categoryList);
        
        console.log("These are the category " + category);
        
        // check if permission exists
        if (!category) {
            // destroy the case we created and return error - but check if this is truly what you want to do
            // for instance, can a case exist without a ctaegory? if yes, you might not want to destroy
             if(actionType == 'create') models.Case.destroy({ where: {id: cases.id}});
             return res.status(422).json({ status: false,  error: 'Cannot find that category selected'});
        }
        
        //  remove association before update new entry inside CaseCategories table if it exist
        if(actionType == 'update') {
            const oldCategories = await cases.getCategories();
            await cases.removeCategories(oldCategories);
        }
        await cases.addCategory(category);
        return true;
    
    }
    
    // Ok now lets do for more than 1 categories, the hard bit.
    // if more than one categories have been selected
    else {
        
        if(typeof categoryList === 'object') {
            // Loop through all the ids in req.body.categories i.e. the selected categories
            await categoryList.forEach(async (id) => {
                // check if all category selected are in the database
                const categories = await models.Category.findByPk(id);
                
                if (!categories) {
                    // return res.status(400);
                    // destroy the case we created - again check if this is what business wants
                    if(actionType == 'create') models.Case.destroy({ where: {id: cases.id}});
                    return res.status(422).json({ status: false,  error: 'Cannot find that category selected'});
                }
                
                // remove association before if update
                if(actionType == 'update') {
                    const oldCategories = await cases.getCategories();
                    await cases.removeCategories(oldCategories);
                }
                 await cases.addCategory(categories);
            });
            
            return true;
            
        } else {
            // destroy the user we created
            if(actionType == 'create') models.Case.destroy({ where: {id: cases.id}});
            return res.status(422).json({ status: false,  error: 'Type of category list is not an object'});
        }
    }} else {
            if(actionType == 'create') { models.Case.destroy({ where: {id: cases.id}});}
            return res.status(422).json({ status: false,  error: 'No category selected'});
        }
    
}