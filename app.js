const express = require('express');
const app = express();
const productManager = require('./ProductManager');

const PORT = 8080

app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit); 
    const products = await productManager.getProducts();
    if (limit) { 
      let productsArr = [...products]; 
      const limitProducts = productsArr.slice(0, limit); 
      return res.send(limitProducts);
    }
    return res.json(products);
  }
  catch (error) {
    res.status(500).send('Ha ocurrido un error inesperado en el servidor');
  }
})

app.get('/products/:id', async (req, res) => {
  try {
    const idProduct = req.params.id
    const products = await productManager.getProducts();

    const existProduct = products.find(product => product.id == idProduct);
    const response = existProduct ? existProduct : { error: `No se encontro ningun producto con el id ${idProduct}` };
    res.status(existProduct ? 200 : 404).send(response);
  }
  catch (error) {
    res.status(500).send('Ha ocurrido un error inesperado en el servidor');
  }
})

app.listen(PORT, () => {
  console.log(`El servidor esta escuchando en el puerto ${PORT}...`);
})

