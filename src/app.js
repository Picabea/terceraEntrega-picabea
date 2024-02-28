const express = require('express')
const productManager = require('./ProductManager.js')

const app = express()

app.get('/products', async (req, res) => {
    let limit = req.query.limit
    let products = await productManager.getProducts()
    if(products){
        if(limit){
            products = products.slice(0, limit)
        }
    }
    res.send(products)
})
app.get('/products/:pid', async (req, res) => {
    let products = await productManager.getProducts()
    let productId = req.params.pid
    let product = products.find(prod => prod.id == productId)
    product ?res.send(product)
    :res.send('Product not found')
    
})

app.listen(8080, () => {
    console.log('server listo')
})  