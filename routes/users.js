const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')

const userModel = require('../model/Users')

/* GET users listing. */
router.get('/signin', function(req, res, next) {
  res.render('login', { title: 'Connecter vous' , layout: false });
});

router.post('/login', async (req, res, next) => {
  const dataForm = ['cuid' , 'password']
  for (const prop of Object.keys(req.body)) {
    if (!dataForm.includes(prop)) {
      res.json({
        success: false,
        message: "champs incorrects"
      });
    }
  }

  const user = await userModel.findOne({cuid: req.body.cuid})

  if (!user)  {
    req.flash('type',"error");
    req.flash('message',"Le Nom d'utilisateur est incorrect !");
    res.redirect("/users/signin")
  }

  if (user.passwordChanged) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      req.flash('type',"success");
      req.flash('message',"Bienvenue " + user.fullname);
      req.session.user = user
      console.log(req.session)
      res.redirect("/")
    } else {
      req.flash('type',"error");
      req.flash('message',"Le mot de passe est incorrect !");
      res.redirect("/users/signin")
    }
  } else {
    req.session.user = user
    console.log(req.session)
    req.flash('type',"success");
    req.flash('message',"Bien vouloir Réinitialiser votre mot de passe ");
    res.redirect("/users/reset-password")
  }

});

router.get('/reset-password', function(req, res, next) {
  res.render('reset-password', { title: 'Reset Password' , layout: false});
});

router.get('/logout', function(req, res, next) {
    req.session.destroy()
   res.redirect('/users/signin')
});

router.post('/reset', function(req, res, next) {
  const dataForm = ['password', 'confirmPassword']
  const userid = req.session.user?.cuid;

  for (const prop of Object.keys(req.body)) {
    if (!dataForm.includes(prop)) {
      req.flash('type',"error");
      req.flash('message',"champs incorrects !");
      res.redirect("/users/reset-password")

    }
  }
  console.log(req.body)

  if (req.body.password !== req.body.confirmPassword) {
    req.flash('type',"error");
    req.flash('message',"Les deux mots de passe doivent être identique !");
    res.redirect("/users/reset-password")
  }
userModel.findOne({cuid: userid})
    .then(newUser => {
      bcrypt.hash(req.body.password , 10 )
          .then(passwordHash => {

            newUser.password = passwordHash
            newUser.passwordChanged = true

            newUser
                .save()
                .then(user => {
                  req.flash('type',"success");
                  req.flash('message',"Bienvenue " + user.fullname);
                  req.session.user = user
                  console.log(req.session)
                  res.redirect("/")
                })
                .catch(err => {
                  req.flash('type',"error");
                  req.flash('message', "Erreur lors de la réinitialisation du mot de passe!");
                  res.redirect("/users/reset-password")
                })
          })
          .catch(err => {
            req.flash('type',"error");
            req.flash('message', err.message);
            res.redirect("/users/reset-password")
          })
    })
    .catch(err => {
      req.flash('type',"error");
      req.flash('message', err.message);
      res.redirect("/users/reset-password")
    })


});

module.exports = router;
