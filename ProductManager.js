const fs = require('fs');
const allProducts = require(`./products`)

const path = './products.json';

class ProductManager {
  static id = 0;

  constructor() {
    this.props = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
    this.path = path;
    try {
      this.products = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
    } catch (error) {
      this.products = []
    }
    ProductManager.id = this.products.reduce((prev, curr) => (
      curr.id >= prev ? curr.id : prev
    ), 0)
  }

  async getProducts() {
    try {
      return this.products;
    } catch (error) {
      console.log(error);
    }
  }

  isValidateCode(product) {
    return this.products.some(item => item.code === product.code);
  }

  async addProduct(product) {
    try {
      for (let prop of this.props) {
        if (!product.hasOwnProperty(prop) || this.isValidateCode(product)) {
          return 'Producto invalido!';
        }
      }

      this.products = [...this.products, { id: ++ProductManager.id, ...product }];
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      let productId = this.products.find(product => product.id === id);
      return productId ?? 'Not found';
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(index, field, newValue) {
    try {
      const updateProductIndex = this.products.findIndex(product => product.id === index)
      if (updateProductIndex !== -1) {
        this.products[updateProductIndex][field] = newValue;
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProducts(id) {
    try {
      this.products = this.products.filter(product => product.id !== id);
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.log(error);
    }
  }
}

const productManager = new ProductManager()

for (let i = 0; i < allProducts.length; i++) {
  const product = allProducts[i];
  productManager.addProduct(product);
}

module.exports = productManager;