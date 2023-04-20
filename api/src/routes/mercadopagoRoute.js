const express = require('express');
const app = express();
require("dotenv").config();
const { PROD_ACCESS_TOKEN } = process.env;

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
  access_token: PROD_ACCESS_TOKEN,
});

//Routes
app.get('/', (req, res) =>{
    console.log(req.query);
    // Crea un objeto de preferencia
    let preference = {
        items: [
        {
            title: req.query.title,
            unit_price: parseInt(req.query.price),
            quantity: 1,
        },
        ],
        back_urls: {
            success: "http://127.0.0.1:5173/donate",
            failure: "http://www.tu-sitio/failure",
            pending: "http://www.tu-sitio/pending"
        },
        // auto_return: "succes",
    };
    
    mercadopago.preferences
        .create(preference)
        .then(function (response) {
        // En esta instancia deberás asignar el valor dentro de response.body.id por el ID de preferencia solicitado en el siguiente paso

        
        res.redirect(response.body.init_point);

        })
        .catch(function (error) {
        console.log(error);
        });
    })


  

module.exports = app;