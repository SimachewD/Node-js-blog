const express = require('express');
const router = express.Router();
const blog = require('../models/blog_model');

//routes

// GET
// All Blogs

router.get('', async (req, res)=>{

    try {
        let perPage = 1;
        let page = req.query.page || 1;

        const blogs = await blog.aggregate()
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();

        const count = await blog.countDocuments();
        const nextPage = parseInt(page)+1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);
        const previousPage = parseInt(page)-1;
        const hasPreviousPage = previousPage >= 1;


        res.render('index', { title:'All Blogs',
                              blogs:blogs,
                              nextPage: hasNextPage ? nextPage : null,
                              previousPage: hasPreviousPage ? previousPage : null});
    } catch (error) {
        console.error("Error! Couldn't fetch data:", error);
    }
});

// GET
// Details: id
router.get('/details/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const blogDetail = await blog.findById(id);
        res.render('blogDetail', {title: 'Details', blogDetail:blogDetail});
    } catch (error) { 
        console.log(error);
    }
});

// GET
// Details: id
router.post('/search', async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        const blogSearch = await blog.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
            ]
        });
        res.render('searchResult', {title: 'Search Results', searchResult:blogSearch});
    } catch (error) { 
        console.log(error);
    }
});

// GET
// About Page

router.get('/about', (req, res)=>{
    res.render('about', { title:'About' });
});


module.exports = router;