const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const CustomerModel = require('./models/Customer'); 
const ProductModel = require('./models/Products'); 
const OrderModel = require('./models/Orders');
const ProductOrderModel = require('./models/Ordered_Products');
const CategoryModel = require('./models/Categories');
const FavoritesModel = require('./models/Favorites_List');
const loyalModel = require('./models/Loyal_Customers');
const ContactModel = require('./models/Contact_Us');
const sendEmail = require('./sendEmail');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

mongoose.connect(process.env.MONGO_DB_URI);

app.use('/Categories', express.static(path.join(__dirname, '../../Images/Categories')));
app.use('/Products', express.static(path.join(__dirname, '../../Images/Products')));


const categoryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../Images/Categories'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../Images/Products'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
const uploadCategory = multer({ storage: categoryStorage });
const uploadProduct = multer({ storage: productStorage });

app.get("/getCategories", async (req, res) => {
    try {
        const categories = await CategoryModel.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/getCategoryByName/:category', async (req, res) => {
    try {
      const categoryName = req.params.category;
  
      const category = await CategoryModel.findOne({ Category: categoryName });
  
      if (category) {
        res.json(category);
      } else {
        res.json("Not Found")
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.post('/createOrderedProduct', async (req, res) => {
    try {
        const { Product_ID, Order_ID, Product_Amount } = req.body;

        if (!Product_ID || !Order_ID) {
            return res.status(400).json({ error: "Both Product_ID and Order_ID are required" });
        }

        const newOrderedProduct = new ProductOrderModel({
            Product_ID,
            Order_ID,
            Product_Amount
        });

        await newOrderedProduct.save();
        res.json(newOrderedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/getProductIDsByOrderID/:orderID", async (req, res) => {
    try {
        const orderID = req.params.orderID;
        const products = await ProductOrderModel.find({ Order_ID: orderID }).select('Product_ID Product_Amount');
        const productDataArray = products.map(product => ({
            Product_ID: product.Product_ID,
            Product_Amount: product.Product_Amount
        }));
        res.json(productDataArray);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/getOrdersByCustomerID', async (req, res) => {
  try {
      const { Customer_ID } = req.query;

      if (!Customer_ID) {
          return res.status(400).json({ error: "Customer_ID is required" });
      }

      const orders = await OrderModel.find({ Customer_ID });

      if (!orders || orders.length === 0) {
          return res.status(404).json({ error: "No orders found for the given Customer_ID" });
      }

      res.json(orders);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.post('/createOrder', async (req, res) => {
    try {
        const { Customer_ID, Order_payment_method, Order_total_price } = req.body;

        if (!Customer_ID || !Order_payment_method || !Order_total_price) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newOrder = new OrderModel({
            Customer_ID,
            Order_Date: Date.now(),
            Order_payment_method,
            Order_total_price
        });

        const customer = await CustomerModel.findOne({ Customer_ID });

        await sendEmail(
            customer.Customer_email,
            "Order Confirmation",
            `<h1>Order Performed Successfully!</h1><p>Hello ${customer.Customer_fullname}<br>Thank you for your order. Your order has been performed successfully. 
            You can view your order on the website in your account if you are authenticated.</p>`
          );

        await newOrder.save();
        res.json(newOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.patch('/updateProduct/:id', async (req, res) => {
    try {
        const { Amount } = req.body;
  
        const product = await ProductModel.findOne({ Product_ID: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.Product_current_amount -= Amount;

        if (product.Product_current_amount === 0) {
            product.Product_state = false;
        }

        await product.save();

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: error.message });
    }
});



app.get("/getProducts", async (req, res) => {
    try {
        const products = await ProductModel.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/getProductByID/:id', async (req, res) => {
    try {
        const product = await ProductModel.findOne({ Product_ID: req.params.id });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      res.status(500).json({ error: error.message });
    }
  });

app.get("/getCustomers", async (req, res) => {
    try {
        const customers = await CustomerModel.find({});
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/getCustomer", async (req, res) => {
    try {
        const { email, password } = req.query;

        if (!email || !password) {
            return res.status(400).json({ error: "A problem occured" });
        }

        const customer = await CustomerModel.findOne({ Customer_email: email });

        if (!customer) {
            return res.json("Invalid");
        }

        const isMatch = await bcrypt.compare(password, customer.Customer_password);
        if (!isMatch) {
            return res.json("Invalid");
        }
        
        if(!customer.Customer_state)
            return res.json("Banned");
        else
            res.json(customer);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.get("/getCustomerByID/:id", async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await CustomerModel.findOne({ Customer_ID: customerId });

        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.patch('/updateCustomer', async (req, res) => {
    const { Customer_ID, Customer_fullname, Customer_email, Customer_number, Customer_address, oldPassword, newPassword } = req.body;
  
    try {
        const customer = await CustomerModel.findOne({ Customer_ID });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        const isMatch = bcrypt.compareSync(oldPassword, customer.Customer_password);
        const emailchanged = await CustomerModel.findOne({ Customer_email, Customer_ID});
        const existingCustomerEmail = await CustomerModel.findOne({ Customer_email });

        if (!isMatch) {
            return res.json("IncorrectOldPassword");
        }
        else if (!emailchanged && existingCustomerEmail) {
            return res.json("EmailExists");
        } 
        else {
            if (newPassword.trim("")!="") customer.Customer_password = newPassword;
            if (Customer_fullname) customer.Customer_fullname = Customer_fullname;
            if (Customer_email) customer.Customer_email = Customer_email;
            if (Customer_number) customer.Customer_number = Customer_number;
            if (Customer_address) customer.Customer_address = Customer_address;
            const updatedCustomer = await customer.save();
            return res.json(updatedCustomer.Customer_fullname);
        }
    }catch (error) {
      console.error('Error updating customer details:', error);
      res.status(500).json({ error: 'Error updating customer details' });
    }
  });
  
  app.post('/createCustomer', async (req, res) => {
    try {
        const { Customer_fullname, Customer_email, Customer_number ,Customer_password, Customer_address } = req.body;
        const Customer_state = true;
        if (!Customer_fullname || !Customer_email || !Customer_number || !Customer_password || !Customer_address) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        const existingCustomerEmail = await CustomerModel.findOne({ Customer_email });
        if (existingCustomerEmail) {
            return res.json("EmailExists");
        } else {
            const newCustomer = new CustomerModel({
                Customer_fullname,
                Customer_email,
                Customer_number,
                Customer_password,
                Customer_address,
                Customer_state
            });

            await newCustomer.save();
            res.json(newCustomer);
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/favorites/:customerId', async (req, res) => {
    const { customerId } = req.params;
    try {
        const favorites = await FavoritesModel.find({ Customer_ID: customerId });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving favorites list', error: error.message });
    }
});

app.post('/checkFavorite', async (req, res) => {
    const { Customer_ID, Product_ID } = req.body;

    try {
        const existingFavorite = await FavoritesModel.findOne({ Customer_ID, Product_ID });
        
        if (existingFavorite) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking favorite', error: error.message });
    }
});


app.post('/Addfavorite', async (req, res) => {
    const { Customer_ID, Product_ID } = req.body;

    try {
        const existingFavorite = await FavoritesModel.findOne({ Customer_ID, Product_ID });
        
        if (existingFavorite) {
            return res.status(201).json(existingFavorite);
        }

        const newFavorite = new FavoritesModel({ Customer_ID, Product_ID });
        await newFavorite.save();
        res.status(201).json(newFavorite);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to favorites list', error: error.message });
    }
});

app.get('/Deletefavorites', async (req, res) => {
    const { Customer_ID, Product_ID } = req.query;

    const deletedFavorite = await FavoritesModel.findOneAndDelete({ Customer_ID, Product_ID });
    if (!deletedFavorite) {
        return res.status(404).json({ message: 'Favorite not found' });
    }
    res.status(200).json({ message: 'Product removed from WishList' });
});

app.get('/DeleteAllFavorites', async (req, res) => {
    const { Customer_ID } = req.query;

    try {
        const deletedFavorites = await FavoritesModel.deleteMany({ Customer_ID });
        if (deletedFavorites.deletedCount === 0) {
            return res.status(404).json({ message: 'No favorites found for this customer' });
        }
        res.status(200).json({ message: 'WhishList Cleared Suuccessfully' });
    } catch (error) {
        console.error('Error deleting favorites:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/addContact', async (req, res) => {
    const { Contact_name, Contact_email, Contact_message } = req.body;

    try {
        // Create a new contact instance
        const newContact = new ContactModel({
            Contact_name,
            Contact_email,
            Contact_message
        });

        // Save the contact to the database
        const savedContact = await newContact.save();

        try {
            // Send a confirmation email
            await sendEmail(
                Contact_email,
                "Thank you for contacting us!",
                `<h1>Your Message is Received Successfully!</h1><p>Thank you for reaching out to us. We have received your message and we will take it into our consideration.</p>`
            );
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Optionally handle email errors (e.g., log it, send a different response, etc.)
        }

        // Respond with the saved contact
        res.status(201).json(savedContact);
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Handle validation errors
            res.status(400).json({ message: error.message });
        } else {
            // Handle other server errors
            res.status(500).json({ message: 'Server error' });
        }
    }
});

app.post('/addLoyalCustomer', async (req, res) => {
    const { loyal_customer_email } = req.body;
  
    try {
      const newLoyalCustomer = new loyalModel({
        loyal_customer_email,
      });
  
      const savedLoyalCustomer = await newLoyalCustomer.save();
  
      // Send a confirmation email
      const emailContent = `<p><h1>Your Email is Received Successfully!</h1>Thank you for subscribing to our loyal customers list!</p>`;
      await sendEmail(
        loyal_customer_email,
        'Subscription Confirmation',
        emailContent
      );
  
      res.status(201).json(savedLoyalCustomer);
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({ message: error.message });
      } else if (error.code === 11000) {
        res.status(400).json({ message: 'Email already exists' });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  });

app.listen(process.env.PORT, () => {
    console.log('Server is Running');
});

