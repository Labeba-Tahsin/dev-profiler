const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const config = require('config');
const request = require('request');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

//@route  GET api/profile/me
//@desc   fetch current user's profile
//@access private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user', ['name', 'avatar']
        );

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch (error) {
        res.status(400).send('Server error');
    }
});

//@route  POST api/profile
//@desc   create or update profile
//@access private

router.post('/',
    [
        auth,
        [
            check('status')
                .not()
                .isEmpty(),

            check('skills')
                .not()
                .isEmpty(),
        ]
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            company, website, location, status,
            skills, bio, githubusername,
            youtube, facebook, twitter, linkedin, skype, instagram
        } = req.body;

        // create profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim());

        //build social profile
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (skype) profileFields.social.skype = skype;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;


        try {
            let profile = await Profile.findOne({ user: req.user.id });

            //update
            if (profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            }
            //create
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);



        } catch (error) {
            res.status(500).send('Server error');
        }
    }
);

//@route  GET api/profile
//@desc   Get all users profiles
//@access public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate(
            'user', ['name', 'avatar']
        );
        res.json(profiles);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

//@route  GET api/profile/user/:user_id
//@desc   Get user by userId
//@access public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate(
            'user', ['name', 'avatar']
        );

        if (!profile) {
            return res.status(400).send('Profile not found');
        }
        res.json(profile);
    } catch (error) {
        if (error.kind == 'ObjectId') {
            return res.status(400).send('Profile not found');
        }
        res.status(500).send('Server error');
    }
});

//@route  DELETE api/profile
//@desc   DELETE user,post,profile
//@access public

router.delete('/', auth, async (req, res) => {
    try {
        //remove posts
        //remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //remove user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User Deleted' });

    } catch (error) {
        res.status(500).send('Server error');
    }

});

//@route  PUT api/experience
//@desc   add profile experience
//@access private

router.put('/experience', [
    auth,
    [
        check('title', 'Title is required')
            .not()
            .isEmpty(),
        check('company', 'Company is required')
            .not()
            .isEmpty(),
        check('from', 'From Date is required')
            .not()
            .isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);

    } catch (error) {
        res.status(500).send('Server error');
    }

});


//@route  DELETE api/experience
//@desc   DELETE experience with exp id
//@access private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get index of experience
        const removeIndex = profile.experience.map(x => x.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).send('Server error');
    }


});


//@route  PUT api/education
//@desc   add profile education
//@access private

router.put('/education', [
    auth,
    [
        check('school', 'School is required')
            .not()
            .isEmpty(),
        check('degree', 'Degree is required')
            .not()
            .isEmpty(),
        check('fieldOfStudy', 'Field of Study is required')
            .not()
            .isEmpty(),
        check('from', 'From Date is required')
            .not()
            .isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);

    } catch (error) {
        res.status(500).send('Server error');
    }

});

//@route  DELETE api/education
//@desc   DELETE experience with exp id
//@access private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //get index of experience
        const removeIndex = profile.education.map(x => x.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).send('Server error');
    }


});

//@route  GET api/github/:username
//@desc   GET user repos from Github
//@access public

router.get('/github/:username', (req, res) => {

    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientID')}&client_secret=${config.get('githubClientSecret')}`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js'
            }
        };

        request(options, (error, response, body) => {
            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No github profile found' });
            }
            res.json(JSON.parse(body));
        });

    } catch (error) {
        res.status(500).send('Server error');
    }
});


module.exports = router;