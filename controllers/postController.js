var Post = require('../models/post');
var models = require('../models');

var async = require('async');

// Display post create form on GET.
exports.getPostCreate = async function(req, res, next) {
    
    // create User GET controller logic here 
    const users = await models.User.findAll();
    const categories = await models.Category.findAll();
    
    res.render('pages/content', {
        title: 'Create a Post Record',
        users: users,
        categories: categories,
        functioName: 'GET POST CREATE',
        layout: 'layouts/detail'
    });
    console.log("Post form renders successfully")
};


// Handle post create on POST.
exports.postPostCreate = async function( req, res, next) {
    
    
    console.log("This is user id of the user selected " + req.body.user_id)
    
    // get the user id that is creating the post
    let user_id = req.body.user_id;
    
    try{
    // get full details of the user that is creating the post i.e. Department and Current Business
    const user = await models.User.findByPk(
        user_id,
        {
            include:
            [
                        {
                            model: models.Department 
                        },
                        {
                            model: models.Role,
                            attributes: ['id', 'role_name']
                        },
                        {
                            model: models.Profile,
                            attributes: ['id', 'profile_name']
                        },
                        {
                            model: models.Permission,
                            as: 'permissions',
                            attributes: ['id', 'permission_name']
                        },
                        {
                            model: models.CurrentBusiness,
                            // through: { where: { user_id: `${user_id}` } },
                            as: 'currentbusinesses',
                            attributes: ['id', 'current_business_name']
                        },
                        
            ]
        }
    );
 

    console.log('This is the user details making the post' + user);
    
    var currentBusinessId;
    
    user.currentbusinesses.forEach(function(currentBusiness) {
        console.log('This is the user current business id making the post ' + currentBusiness.id);
        currentBusinessId = currentBusiness.id;
    });
    
    console.log('This is the user department id making the post ' + user.Department.id);
    
    let departmentId = user.Department.id
    
    // create the post with user current business and department
    var post = await models.Post.create({
            post_title: req.body.post_title,
            post_body: req.body.post_body,
            UserId: user_id,
            DepartmentId: departmentId,
            CurrentBusinessId: currentBusinessId
            
        } 
    );
    
    console.log("The post id " + post.id);

    
    // let's do what we did for user model
    var actionType = 'create';
        
        // START MANY TO MANY RELATIONSHIP (add categories)
        
        // INSERT PERMISSION MANY TO MANY RELATIONSHIP
        var addCategories = await CreateOrUpdateCategories (req, res, post, actionType);
        
        console.log(addCategories);
        
        if(!addCategories){
            return res.status(422).json({ status: false,  error: 'Error occured while adding Categories'});
        }
        
        // END MANY TO MANY 
        
        console.log('Post Created Successfully');
        
        // everything done, now redirect....to post listing.
        res.redirect('/main/post/' + post.id);
        
    } catch (error) {
        // we have an error during the process, then catch it and redirect to error page
        console.log("There was an error " + error);
        // not sure if we need to detsory the post? shall we?
        models.Post.destroy({ where: {id: post.id}});
        res.render('pages/error', {
        title: 'Error',
        message: error,
        error: error
      });
    }
};

 

 


// Display post delete form on GET.
exports.getPostDelete = async function(req, res, next) {
    // find the post
    const post = await models.Post.findByPk(req.params.post_id);

    // Find and remove all associations (maybe not necessary with new libraries - automatically remove. Check Cascade)
    //const categories = await post.getCategories();
    //post.removeCategories(categories);

    // delete post 
    models.Post.destroy({
        // find the post_id to delete from database
        where: {
            id: req.params.post_id
        }
    }).then(function() {
        // If an post gets deleted successfully, we just redirect to posts list
        // no need to render a page
        res.redirect('/main/posts');
        console.log("Post deleted successfully");
    });
};


// Display post update form on GET.
exports.getPostUpdate = async function(req, res, next) {
    // Find the post you want to update
    console.log("ID is " + req.params.post_id);
    const categories = await models.Category.findAll();
    const users = await models.User.findAll();
    // console.log('This is the user details making the post' + user);
    
    // var currentBusinessId;
    
    // user.currentbusinesses.forEach(function(currentBusiness) {
    //     console.log('This is the user current business id making the post ' + currentBusiness.id);
    //     currentBusinessId = currentBusiness.id;
    // });
    
    // console.log('This is the user department id making the post ' + user.Department.id);
    
    // let departmentId = user.Department.id
    
    models.Post.findByPk(
        req.params.post_id,
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
    ).then(function(post) {
        console.log('this is post user ' + post.User.first_name);
        // renders a post form
        res.render('pages/content', {
            title: 'Update Post',
            categories: categories,
            post: post,
            users: users,
            // departments: departments,
            // currentBusinesses: currentBusinesses,
            functioName: 'GET POST UPDATE',
            layout: 'layouts/detail'
        });
        console.log("Post update get successful");
    });

};


// Handle post update on POST.
exports.postPostUpdate = async function(req, res, next) {
    console.log("ID is " + req.params.post_id);

    // find the post
    const post = await models.Post.findByPk(req.params.post_id);

    // Find and remove all associations 
    const categories = await post.getCategories();
    post.removeCategories(categories);


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
        //otherwise add new entry inside PostCategory table
        await post.addCategory(category);
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
            // add to PostCategory after
            await post.addCategory(category);
        });
    }

    // now update
    models.Post.update(
        // Values to update
        {
            post_title: req.body.post_title,
            post_body: req.body.post_body,
            UserId: req.body.user_id
        }, { // Clause
            where: {
                id: req.params.post_id
            }
        }
        //   returning: true, where: {id: req.params.post_id} 
    ).then(function() {
        // If an post gets updated successfully, we just redirect to posts list
        // no need to render a page
        res.redirect("/main/posts");
        console.log("Post updated successfully");
    });
};


// Display detail page for a specific post.
exports.getPostDetails = async function(req, res, next) {
    
    console.log("I am in post details")
    // find a post by the primary key Pk
    models.Post.findByPk(
        req.params.post_id, {
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
    ).then(async function(post) {
        console.log(post)
        res.render('pages/content', {
            title: 'Post Details',
            functioName: 'GET POST DETAILS',
            post: post,
            layout: 'layouts/detail'
        });
        console.log("Post details renders successfully");
    });
};

     
                        
// Display list of all posts.
exports.getPostList = function(req, res, next) {
    // controller logic to display all posts
    models.Post.findAll({
      
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

    }).then(function(posts) {
        // renders a post list page
        console.log(posts);
        console.log("rendering post list");
        res.render('pages/content', {
            title: 'Post List',
            functioName: 'GET POST LIST',
            posts: posts,
            layout: 'layouts/list'
        });
        console.log("Posts list renders successfully");
    });

};

exports.getPostListByDepartment = async function(req, res, next) {
    
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
     // controller logic to display all posts
    models.Post.findAll({
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

    }).then(function(posts) {
        // renders a post list page
        console.log(posts);
        console.log("rendering post list");
        res.render('pages/content', {
            title: 'Post List',
            functioName: 'GET POST LIST',
            posts: posts,
            layout: 'layouts/list'
        });
        console.log("Posts list renders successfully");
    });

};
 

exports.getPostListByEmail = async function(req, res, next) {
    
    let email = req.params.email;
    
    // const user = await models.User.findAll({ where: {email: email} });
    
    // controller logic to display all posts
    models.Post.findAll({
     
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

    }).then(function(posts) {
        // renders a post list page
        console.log(posts);
        console.log("rendering post list");
        res.render('pages/content', {
            title: 'Post List',
            functioName: 'GET POST LIST',
            posts: posts,
            layout: 'layouts/list'
        });
        console.log("Posts list renders successfully");
    });

};
 
async function CreateOrUpdateCategories(req, res, post, actionType) {

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
            // destroy the post we created and return error - but check if this is truly what you want to do
            // for instance, can a post exist without a ctaegory? if yes, you might not want to destroy
             if(actionType == 'create') models.Post.destroy({ where: {id: post.id}});
             return res.status(422).json({ status: false,  error: 'Cannot find that category selected'});
        }
        
        //  remove association before update new entry inside PostCategories table if it exist
        if(actionType == 'update') {
            const oldCategories = await post.getCategories();
            await post.removeCategories(oldCategories);
        }
        await post.addCategory(category);
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
                    // destroy the post we created - again check if this is what business wants
                    if(actionType == 'create') models.Post.destroy({ where: {id: post.id}});
                    return res.status(422).json({ status: false,  error: 'Cannot find that category selected'});
                }
                
                // remove association before if update
                if(actionType == 'update') {
                    const oldCategories = await post.getCategories();
                    await post.removeCategories(oldCategories);
                }
                 await post.addCategory(categories);
            });
            
            return true;
            
        } else {
            // destroy the user we created
            if(actionType == 'create') models.Post.destroy({ where: {id: post.id}});
            return res.status(422).json({ status: false,  error: 'Type of category list is not an object'});
        }
    }} else {
            if(actionType == 'create') { models.Post.destroy({ where: {id: post.id}});}
            return res.status(422).json({ status: false,  error: 'No category selected'});
        }
    
}