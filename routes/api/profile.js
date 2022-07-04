const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Person Model
const Person = require('../../models/Person');

//Load Profile Model
const Profile = require('../../models/Profile');

// @type      GET
// @route     /api/profile/
// @desc      route for personal user profile
// @acess     PRIVATE
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.status(404).json({ profilenotfound: 'No Profile found' });
        }
        return res.status(200).json(profile);
      })
      .catch(err => console.log('got some error n profile' + err));
}); 

// @type      POST
// @route     /api/profile/
// @desc      route for UPDATING/SAVING personal user profile
// @acess     PRIVATE
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const profileValues = {}
    profileValues.user = req.user.id;
    if (req.body.username) {
      profileValues.username = req.body.username;
    }
    if (req.body.website) {
      profileValues.website = req.body.website;
    }
    if (req.body.country) {
      profileValues.country = req.body.country;
    }
    if (req.body.portfolio) {
      profileValues.portfolio = req.body.portfolio;
    }
    if (typeof req.body.languages != undefined) {
      profileValues.languages = req.body.languages.split(",");
    }
    // get social links
    profileValues.social = {}

    if (req.body.youtube) {
      profileValues.social.youtube = req.body.youtube;
    }
    if (req.body.facebook) {
      profileValues.social.facebook = req.body.facebook;
    }
    if (req.body.instagram) {
      profileValues.social.instagram = req.body.instagram;
    }

    // Do database stuff
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          ).then(profile => res.json(profile)).catch(err => console.log("Problem in update" + err));
        } else {
          Profile.findOne({ username: profileValues.username })
            .then(profile => {
              // Username already exits
              if (profile) {
                res.status(400).json({ username: 'Username already exits' });
              }
              // save user
              new Profile(profileValues)
                .save()
                .then(profile => res.json(profile))
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in fetching profile" + err));
  }
);

// @type      GET
// @route     /api/profile/:username
// @desc      route for getting user profile based on USERNAME
// @acess     PUBLIC
router.get('/:username', (req, res) => {
  Profile.findOne({ username: req.params.username })
    .populate('user', ['name', 'profilepic'])
    .then(profile => {
      if (!profile) {
        res.status(404).json({ usernotfound: 'User not found ' });
      }
      res.json(profile);
    })
    .catch(err => console.log('Error in fetching username ') + err);
});

// @type      GET
// @route     /api/profile/everyone
// @desc      route for getting user profile of everyone
// @acess     PUBLIC
router.get('/find/everyone', (req, res) => {
  Profile.find()
    .populate('user', ['name', 'profilepic'])
    .then(profiles => {
      if (!profiles) {
        res.status(404).json({ usernotfound: 'No Profile was found' });
      }
      res.json(profiles);
    })
    .catch(err => console.log('Error in fetching profiles ') + err);
});

// @type      DELETE
// @route     /api/profile/
// @desc      route for deleting user based on ID
// @acess     PRIVATE
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      Person.findByIdAndRemove({ _id: req.user.id })
        .then(() => res.json({success: 'delete was success'}))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

// @type      POST
// @route     /api/profile/workrole
// @desc      route for adding work profile of a person
// @acess     PRIVATE
router.post('/workrole', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        res.status(404).json({ profilenotfound: 'No profile found with this id' });
      }
      const newWork = {
        role: req.body.role,
        company: req.body.company,
        country: req.body.country,
        from: req.body.from,
        to: req.body.to,
        currnet: req.body.current,
        details: req.body.details
      };
      profile.workrole.unshift(newWork);
      profile.save().then(profile => res.json(profile)).catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

// @type      DELETE
// @route     /api/profile/workrole/:w_id
// @desc      route for deleteing a specific work
// @acess     PRIVATE
router.delete('/workrole/:w_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(
    profile => {
      const removethis = profile.workrole
        .map(item => item.id)
        .indexOf(req.params.w_id);
      profile.workrole.splice(removethis, 1);
      profile.save().then(profile => res.json(profile)).catch(err => console.log(err));
    }
  ).catch(err => console.log(err))
});

module.exports = router;