const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
var events = require('events').EventEmitter;
var emitter = new events.EventEmitter();

const router = express.Router();

//Home
router.get('/', (req, res) => {
  emitter.emit('userlogged', "User connected");

  let message = {};
  let user= -1;

  if (req.session!=null && req.session.message!=null) {
    message = req.session.message;
    delete req.session.message;
  }

  if (req.session!=null && req.session.user!=null) {
    user = req.session.user;
    delete req.session.user;
  }

  res.render('form', { title: 'Crea nuovo utente',message:message, user:user });
});

//Post di home, ovvero creazione utente.
//L'array che è dopo l'endpoint serve alla validazione per determinare le proprietà che devono avere i dati inseriti.
router.post('/',
[
  body('name')
  .isLength({ min: 6 })
  .withMessage('Name must be minimum 6 characters length'),
  body('email')
  .isLength({ min: 1 })
  .withMessage('Please enter an email'),
],
(req, res) => {
  //Check se ci sono errori. Se ci sono, errors conterrà dei messaggi.
  const errors = validationResult(req);

  //Se non ci sono errori procede.
  if (errors.isEmpty()) {
    let userData=req.body;

    //Cerca tra gli indirizzi email se già esiste.
    User.findAll({
      where: {
        email: userData.email
      }
    })
    .then((user) => {
      if (user.length) {
        //Se entra qui l'utente già esiste.
        req.session.message = {type : "error", text : "Esiste già un utente associato all'email!"};
        res.redirect('/');
      } else {
        //Se entra qui l'email non esiste, quindi procede alla creazione.
        User.create({ name: userData.name, email: userData.email })
        .then((user) => {
          console.log("New user added:", user.id);
          req.session.message = {type : "success", text : "Nuovo utente creato!"};
          req.session.user = user;
          res.redirect('/');
        })
        .catch((err) => { console.log(err); });
      }
    })
    .catch((err) => { console.log(err); });
  }
  //Se ci sono errori rendera la stessa pagina e gli passa l'array con gli errori, che poi saranno mostrati a schermo.
  else {
    res.render('form', {
      title: 'Ricontrolla i tuoi dati',
      errors: errors.array(),
      data: req.body,
    });
  }
});

//Tutti gli utenti.
router.get('/users', (req, res) => {
  let message = {};

  if (req.session!=null && req.session.message!=null) {
    message = req.session.message;
    delete req.session.message;
  }

  User.findAll().then(users => {
    res.render('index',{users:users,title:"Lista Utenti",message:message});
  })
  .catch((err) => { console.log(err); });
});

//Cancellazione utente.
router.delete('/users', (req, res) => {
  User.findByPk(req.body.id)
  .then(user => {
    user.destroy();
    req.session.message = {type : "success", text : "Utente cancellato!"};
    res.redirect('/users');
  })
  .catch((err) => { console.log(err); });
});

router.get('/admin', (req, res) => {
  res.render('admin-form', {title:"Accedi come admin"})
});

//Pannello admin.
router.post('/admin', (req, res) => {
  emitter.on('userlogged', function(message){
    console.log(message);
  });

  let userData=req.body;

  User.findAll({
    where: {
      admin: 1,
      name: userData.name,
      email: userData.email
    }
  })
  .then(user => {
    if (user.length) {
      res.render('admin',{title:"Registrazione utenti in tempo reale"});
    } else {
      req.session.message = {type : "error", text : "Non sei autorizzato a entrare nel pannello di amministrazione!"};
      res.redirect('/');
    }
  })
  .catch((err) => { console.log(err); });

});

module.exports = router;
