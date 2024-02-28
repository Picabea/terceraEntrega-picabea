const fs = require('fs');

class ProductManager{
    #id = null

    constructor(path){
      this.products = [],
      this.path = path
    }

    async addProduct(title, description, price, thumbnail, code, stock){
      let objects = this.getProducts()


      if(title && description && price && thumbnail && code && stock){
        if(this.verifyCode(code, objects)){
          if(!this.#id){
            this.#id = this.getId()
          }
          let object = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            id: this.#id
          }
          
          objects.push(object)
          let JsonList = JSON.stringify(objects)

          await fs.promises.writeFile(this.path, JsonList)

          this.#id += 1
        }
      }else{
        console.log("El producto no es correcto")
      }
    }

    verifyCode(newCode, products){
        let codes = []
        console.log(products)
        if(products.length >= 1){
          products.forEach(product => codes.push(product.code))
          if(!codes.includes(newCode)){
              return(true)
          }else{
              console.log("El codigo se encuentra repetido")
              return(false)
          }
        }
        
    }

    getId(){
      let products = this.getProducts()
      let maxId = 0
      products.forEach(
        (prod) => {
          if(prod.id>maxId){
            maxId = prod.id
          } 
        }
      )
      return(maxId)
    }

    async getProducts(){
      const archivo = await fs.promises.readFile(this.path, 'utf-8')
      let archivoAdaptado = JSON.parse(archivo)
      return(archivoAdaptado)
      return new Promise((resolve) => {
        resolve(archivo)
      })      
  }

    async getProductById(id){
      let productos = await this.getProducts()
      // let adaptedProducts = JSON.parse(productos)
      let filteredProducts = productos.find(prod => prod.id === id)
      if(filteredProducts){
        return(filteredProducts)
      }else{
          return("Not found")
      } 
      
    }

    updateProduct(id, newValues){
      //Buscamos la lista del archivo
      let products = this.getProducts()
      //Seleccionamos el producto
      let productToUpdate = products.find(prod => prod.id == id)
      let index = -1

      if(productToUpdate){
        //Se guarda el index para poder reasignar el objeto mas adelante
        index = products.indexOf(productToUpdate)
      }else{
        return("Not found")
      }
      //Keys posibles a editar
      let validKeys = ["title", "description", "price", "thumbnail", "code", "stock"]
      //Keys a editar
      let newKeys = Object.keys(newValues) 
      let valid = true

      //se controla que se esten updateando campos correctos
      newKeys.forEach((key) => {
        if(!validKeys.includes(key)){
          valid = false
        }
      })

      //En caso de estar actualizando el codigo
      if(newKeys.includes("code")){
        let newCode = newValues.code
        //Se verifica que sea valido
        if(!this.verifyCode(newCode, products)){
          return("Error: Code is repeated")
        }
      }
      if(newKeys.includes("id")){
        return("Error: Id can not be modified")
      }
      //Si las keys fueron correctas se actualiza el objeto
      if(valid){
        //Se actualiza y reasigna el objeto
        let updatedProduct = Object.assign(productToUpdate, newValues)
        products[index] = updatedProduct
        let JsonProducts = JSON.stringify(products)
        fs.writeFileSync(this.path, JsonProducts)
      }else{
        return("Error: Enter a valid key")
      }
    }

    deleteProduct(id){
      let products = this.getProducts()
      let filteredProducts = products.filter(prod => prod.id != id)
      let adaptedProducts = JSON.stringify(filteredProducts)
      fs.writeFileSync(this.path, adaptedProducts)
    }
  }
  
const productManager = new ProductManager(String.raw`.\test.json`)
  
//productManager.addProduct("Coca Cola 500ml", "Esta sabroza cola premium resalta por si sola gracias a su perfecta efervecencia y buen balance de sabores", 950, "www.imagen.com", "cc500", 43)
// productManager.addProduct("Pepsi 500ml", "Refrescante cola con un toque de limón, perfecta para cualquier ocasión.", 850, "www.imagen.com/pepsi", "p500", 50)
// productManager.addProduct("Fanta Naranja 355ml", "Bebida gaseosa con sabor a naranja natural, ideal para acompañar tus comidas.", 750, "www.imagen.com/fanta-naranja", "f355", 60)
// productManager.addProduct("Sprite Zero 330ml", "Refresco burbujeante con sabor a lima-limón, sin calorías y sin azúcar.", 700, "www.imagen.com/sprite-zero", "s330", 30)
// productManager.addProduct("Schweppes Tónica 250ml", "Tónica clásica con un equilibrado sabor a quinina, perfecta para combinar con tu ginebra favorita.", 600, "www.imagen.com/schweppes-tonica", "s250", 25)

//productManager.getProducts()
// productManager.getProducts()
// .then(res => console.log(res))

// productManager.deleteProduct(3)
// console.log(productManager.getProductById(2))
// console.log(productManager.getProductById(2))
// console.log(productManager.getProductById(25))


// productManager.updateProduct(0, {price: 1050})
// console.log(productManager.updateProduct(0, {id: 10}))
// console.log(productManager.updateProduct(0, {code: "c500"}))
// console.log(productManager.updateProduct(0, {code: "p500"}))
// console.log(productManager.getProducts())

module.exports = productManager