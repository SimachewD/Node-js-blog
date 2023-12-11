const express = require('express');
const router = express.Router();
const blog = require('../models/blog_model');
const User = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user_model = require('../models/user_model');


const layout = 'layouts/admin_layout';//../layouts/admin_layout is possible since express looks for a view in views folder relative
const jwtSecret = process.env.JWT_SECRET;


//Prevent an autherized access
//Admin dashboard

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({Message: 'Unautherized'});
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({Message: '__Unautherized'});
    }
}


//routes
 
// GET
// Admin Log in Page

router.get('/admin', async (req, res)=>{
    try {

        res.render('admin/index', {title:'Admin LogIn', layout:layout});

    } catch (error) {
        console.log(error);
    }
});

// POST
// Check login

router.post('/admin', async (req, res) => {
    try {

        const { username, password} = req.body;
        const user = await User.findOne({username});

        if (!user) {
            return res.status(401).json({ message: 'User not found'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Credintials'});
        }

        const token = jwt.sign({userId: user._id}, jwtSecret);
        res.cookie('token', token, {httpOnly: true});
        res.redirect('/dashboard');

        
    } catch (error) {
        
    }
});

//GET
//ADMIN DASHBOARD

router.get('/dashboard', authMiddleware, async (req, res)=>{
    try {

        const newBlog = req.query.blogAdded;
        const updateBlog = req.query.blogUpdated;
        const deleteBlog = req.query.blogDeleted; 


        const blogs = await blog.find();

        res.render('admin/dashboard', {title: 'Admin Dashboard',newBlog, updateBlog, deleteBlog, blogs, layout:layout});

    } catch (error) {
        console.log(error);
    }
});



//GET
//ADD NEW BLOG
//form

router.get('/add-blogs', authMiddleware, async (req, res)=>{
    try {

        res.render('admin/add-blogs', {title: 'Add Blogs', layout:layout});

    } catch (error) {
        console.log(error);
    }
});


//GET
//Update BLOG
//form

router.get('/edit-blog/:id', authMiddleware, async (req, res)=>{
    try {

        const blogs = await blog.findById(req.params.id);

        res.render('admin/edit-blog', {title: 'Edit Blog', blogs, layout:layout});

    } catch (error) {
        console.log(error);
    }
});



//POST
//NEW BLOG Added

router.post('/add-blogs', authMiddleware, async (req, res)=>{
    try {

        const { title, body} = req.body;

        try {

            const newBlog = await blog.create({title: title, body: body});

            let addSuccess = false;

            if(newBlog){
                addSuccess = true;
            }

             res.redirect(`/dashboard?blogAdded=${addSuccess}`);
             
        } catch (error) {
            res.status(501).json({error:error.message});
        }

    } catch (error) {
        console.log(error);  
    }
});
   
//PUT
//BLOG Updated

router.put('/edit-blog/:id', authMiddleware, async (req, res)=>{
    try {

        const { title, body} = req.body;
        const id = req.params.id; 

        try {

            const updatedBlog = await blog.findByIdAndUpdate(id, {title: title, body: body});
            let updateSuccess = false; 

            if(updatedBlog){
                updateSuccess = true; 
            }


             res.redirect(`/dashboard?blogUpdated=${updateSuccess}`);
             
        } catch (error) {
            res.status(501).json({error:error.message});
        }

    } catch (error) {
        console.log(error); 
    }
});



//DELETE
//BLOG Deleted

router.delete('/delete-blog/:id', authMiddleware, async (req, res)=>{
    try {

        const id = req.params.id; 

        try {

            const deleteBlog = await blog.deleteOne({_id: id});
            let deleteSuccess = false; 

            if(deleteBlog){
                deleteSuccess = true;  
            }


             res.redirect(`/dashboard?blogDeleted=${deleteSuccess}`);
             
        } catch (error) {
            res.status(501).json({error:error.message});
        }

    } catch (error) {
        console.log(error); 
    }
});




//GET
//Admin logout

router.get('/logout', (req, res)=>{
    try {
        res.clearCookie('token');
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}); 

 
   
// POST
// Check Register

// router.post('/register', async (req, res) => {
//     try {

//         const { username, password} = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);

//         try {  
             
//             const user = await user_model.create({username, password:hashedPassword});
//             res.status(201).json({message:'User Created', user});

//         } catch (error) {
            
//             if (error.code === 11000) {
//                 res.status(409).json({message:'User Already Exists'});
//             }
//             res.status(500).json({message:'Internal Server Error'});
//         }
        
//     } catch (error) {
//         console.log(error);
//     }
// });


module.exports = router;