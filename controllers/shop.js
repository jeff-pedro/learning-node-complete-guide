const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/products-list', {
        products: rows,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(([product]) => {
      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: 'Details',
        path: '/products',
      });
    })
    .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/index', {
        products: rows,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
  Product.fetchAll((products) => {
    Cart.getCart((cart) => {
      const cartProducts = [];
      for (let product of products) {

        if (cart !== null) {
          const cartProductData = cart.products.find(prod => prod.id === product.id)

          if (cartProductData) {
            cartProducts.push({ productData: product, qty: cartProductData.qty });
          }
        }

      }
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cartProducts
      });
    });
  });

}

exports.postCart = (req, res, next) => {
  const productId = req.body.id;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', { pageTitle: 'Orders', path: '/orders' })
}
