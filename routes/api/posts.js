const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator');

//@route  POST api/posts
//@desc   Create a post
//@access private
router.post('/', [
    auth,
    [
        check('text', 'Text is required')
            .not()
            .isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = {
            user: req.user.id,
            name: user.name,
            avatar: user.avatar,
            text: req.body.text
        };

        const post = new Post(newPost);
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).send('server error');
    }
});

//@route  GET api/posts
//@desc   GET all posts
//@access private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).send('server error');
    }
});

//@route  GET api/posts/:post_id
//@desc   GET post by id
//@access private

router.get('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(400).send('Post not found');
        }
        res.json(post);
    } catch (error) {
        res.status(500).send('server error');
    }
});


//@route  DELETE api/posts/:post_id
//@desc   DELETE post by id
//@access private
router.delete('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(400).send('Post not found');
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(400).send('User Not Authorised');
        }
        await post.remove();
        res.json({ msg: 'Post removed' });
    } catch (error) {
        res.status(500).send('server error');
    }
});

//@route  PUT api/posts/like/:id
//@desc   Like a post
//@access private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).send('Post not found');
        }
        if (post.likes.filter(item => item.user.toString() === req.user.id).length > 0) {
            return res.status(400).send('Post already liked');
        }

        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);

    } catch (error) {
        res.status(500).send('server error');
    }
});

//@route  PUT api/posts/like/:id
//@desc   Like a post
//@access private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).send('Post not found');
        }
        if (post.likes.filter(item => item.user.toString() === req.user.id).length === 0) {
            return res.status(400).send('Post has yet not been liked');
        }

        const removedIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
        post.likes.splice(removedIndex, 1);
        await post.save();
        res.json(post.likes);

    } catch (error) {
        res.status(500).send('server error');
    }
});


//@route  PUT api/posts/comment/:id
//@desc   comment in a post
//@access private
router.put('/comment/:id', [
    auth,
    [
        check('text', 'Text is required')
            .not()
            .isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newCmnt = {
            user: req.user.id,
            name: user.name,
            avatar: user.avatar,
            text: req.body.text
        };

        post.comments.unshift(newCmnt);
        await post.save();
        res.json(post.comments);
    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
});

//@route  PUT api/posts/comment/:id/:cmnt_id
//@desc   delete a comment
//@access private
router.delete('/comment/:id/:cmnt_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        const comment = post.comments.find(x => x.id === req.params.cmnt_id);
        if (!comment) {
            return res.status(400).send('comment not found');
        }
        if (comment.user.toString() !== req.user.id) {
            return res.status(400).send('User Not Authorised');
        }

        const removedIndex = post.comments.map(item => item._id).indexOf(req.params.cmnt_id);
        post.comments.splice(removedIndex, 1);
        await post.save();
        res.json(post.comments);

    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
});



module.exports = router;