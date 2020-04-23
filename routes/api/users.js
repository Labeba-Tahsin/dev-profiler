const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route  POST api/users
//@desc   register user
//@access public
router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),

    check('email', 'Please include a valid email')
        .isEmail(),

    check('password', 'Password should be minimum 6 charecters')
        .isLength({ min: 6 })



], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body;

    try {
        //check if user exists already

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
        //get gravatar for user

        const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
        user = new User({
            name,
            email,
            password,
            avatar
        });
        //encrypt password
        const salt = await bcrypt.genSaltSync(10);
        user.password = await bcrypt.hashSync(password, salt);

        await user.save();

        //return json webtoken

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jwtToken'), { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (error) {
        console.log(error.message);
        res.status(500).send('server error');
    }


});

module.exports = router;