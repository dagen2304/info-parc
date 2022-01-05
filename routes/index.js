const express = require('express');
const router = express.Router();
const computerModel = require('../model/Computer')
const XLSX = require('xlsx')
/* GET home page. */
router.get('/', async (req, res, next) =>  {
    const computers = await computerModel.find()
    res.render('index', { title: 'Parc Info' , computers: computers });
});

router.get('/computer-list', function(req, res, next) {
  res.render('computer-list', { title: 'Parc Info' });
});

router.get('/create', function(req, res, next) {
  res.render('create-computer', { title: 'Add computer' });
});

router.get('/extraction', function(req, res, next) {
    res.render('extraction', { title: 'Extraction' });
});

router.post('/export', async (req, res, next) => {
   const wb = XLSX.utils.book_new()

    computerModel.find()
        .then((computers)=> {
            const temp = JSON.stringify(computers)
            const ws = XLSX.utils.json_to_sheet(JSON.parse(temp))
            const down = './public/ComplutersList.xlsx'
            console.log(down)
            XLSX.utils.book_append_sheet(wb,ws , "Computers List")
            XLSX.writeFile(wb,down)
            res.download(down)
        })
        .catch(err => {
            req.flash('type',"error");
            req.flash('message',"Une erreur s'est produite lors de la récuperation des ordinateurs !");
            res.redirect("/")
        })
});

router.post('/save-computer', async (req, res, next) => {

 const oldComputer = await computerModel.findOne({$or: [ {serialNumber: req.body.serialNumber} , {hostname:req.body.hostname}]})

 if (oldComputer) {
     req.flash('type',"error");
     req.flash('message',"L'ordinateur " + oldComputer.hostname + " existe déjà!");
     res.redirect("/create")
 } else {
      const computer = new computerModel(req.body)
      computer
          .save()
          .then(computer => {
              req.flash('type',"success");
              req.flash('message',"L'ordinateur " + computer.hostname + " a été ajouter avec succès!");
              res.redirect("/")
          })
          .catch(err => {
              req.flash('type',"error");
              req.flash('message',"Une erreur s'est produite lors de l'ajout de l'ordinateur !");
              res.redirect("/create")
          })
 }

});


router.get('/:id/delete', function(req, res, next) {
    const id = req.params.id

    computerModel.findOneAndRemove({_id: id})
        .then( computer => {
            req.flash('type',"success");
            req.flash('message',"L'ordinateur " + computer.hostname + " a été supprimer avec succès!");
            res.redirect("/")
        })
        .catch(err => {
            req.flash('type',"error");
            req.flash('message',"Une erreur s'est produite lors de la suppression de l'ordinateur !");
            res.redirect("/")
        })
});

router.get('/:id/edit', function(req, res, next) {
    const id = req.params.id

    computerModel.findOne({_id: id})
        .then( computer => {
            res.render('edit-computer', { title: 'Edit computer' , computer: computer  });
        })
        .catch(err => {
            req.flash('type',"error");
            req.flash('message',"Une erreur s'est produite lors de la suppression de l'ordinateur !");
            res.redirect("/")
        })
});

router.post('/update-computer', async (req, res, next) => {
    const id = req.body.id
    const oldComputer = await computerModel.findOne({_id: id})

    if (oldComputer) {
        const arrayProps = [
            "username",
            "cuid",
            "status",
            "direction",
            "site",
            "hostname",
            "serialNumber",
            "osVersion",
            "type",
            "model",
            "sac",
            "clavier",
            "souris",
            "ecran",
            "imprimente",
            "token",
            "cableSecure",
            "filtreSecure",
            "anneeAttr"
        ]

        arrayProps.forEach((props) => {
            oldComputer[props] = req.body[props]
        })

        oldComputer
            .save()
            .then(computer => {
                req.flash('type',"success");
                req.flash('message',"L'ordinateur " + oldComputer.hostname + " a été modifier avec succès!");
                res.redirect("/")
                console.log('success')
            })
            .catch(err => {
                req.flash('type',"error");
                req.flash('message',"Une erreur s'est produite lors de la modification de l'ordinateur !");
                res.redirect( id+ "/edit")
            })
    } else {
        req.flash('type',"error");
        req.flash('message',"L'ordinateur selectionner n'existe pas!");
        res.redirect(id+ "/edit")
    }

});

module.exports = router;
