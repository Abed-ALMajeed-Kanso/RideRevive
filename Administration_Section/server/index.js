const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const CustomerModel = require('./models/Customer');
const AdministratorModel = require('./models/Administrators'); 
const ProductModel = require('./models/Products'); 
const OrderModel = require('./models/Orders');
const ProductOrderModel = require('./models/Ordered_Products');
const CategoryModel = require('./models/Categories');

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

app.patch('/updateCategory', uploadCategory.single('Category_image'), async (req, res) => {
  try {
      const { Category, Category_state, Category_description } = req.body;
      const Category_image = req.file ? req.file.filename : null;

      if (!Category) {
          return res.status(400).send('Category name is required');
      }

      if (typeof Category_state === 'undefined') {
          return res.status(400).send('Category state is required');
      }

      const existingCategory = await CategoryModel.findOne({ Category });
      if (!existingCategory) {
          return res.status(404).send('Category not found');
      }

      existingCategory.Category_state = Category_state === 'true';
      existingCategory.Category_description = Category_description;

      if (Category_image) {
          const oldImagePath = path.join(__dirname, '../../Images/Categories', existingCategory.Category_image);
          if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
          }
          existingCategory.Category_image = Category_image;
      }

      await existingCategory.save();

      res.send('Category updated successfully!');
  } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).send('Error updating category');
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


app.get("/getCategories", async (req, res) => {
    try {
        const categories = await CategoryModel.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/createCategory', uploadCategory.single('Category_image'), async (req, res) => {
    try {
      const { Category, Category_state, Category_description } = req.body;
      let Category_image = req.file ? req.file.filename : null;
  
      const existingCategory = await CategoryModel.findOne({ Category });
      if (existingCategory) {
        res.json("categoryExists");
        return;
      }
  
      const newCategory = new CategoryModel({
        Category,
        Category_state,
        Category_description,
        Category_image,
      });
  
      await newCategory.save();
      res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: error.message });
    }
  });

app.get('/deleteCategory/:category', async (req, res) => {
    try {
      const category = req.params.category;
      const deletedCategory = await CategoryModel.findOneAndDelete({ Category: category });
  
      if (deletedCategory) {
        res.json({ message: 'Category deleted successfully', deletedCategory });
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
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

app.post('/createProduct', uploadProduct.single('Product_image'), async (req, res) => {
  try {
    const { Product, Product_price, Product_state, Product_amount, Product_current_amount, Category, Product_Discount } = req.body;
    let Product_image = req.file ? req.file.filename : null;

    const existingProduct = await ProductModel.findOne({ Product });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product already exists' });
    }

    const newProduct = new ProductModel({
      Product,
      Product_price,
      Product_state,
      Product_amount, 
      Product_current_amount,
      Product_image,
      Category,
      Product_Discount,
      Product_Date: Date.now()
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
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
  
  app.patch('/updateProduct/:id', uploadProduct.single('Product_image'), async (req, res) => {
    try {
      const { Product, Product_price, Product_state, Category, Product_amount, Product_current_amount, Product_Discount } = req.body;
      const Product_image = req.file ? req.file.filename : null;
  
      const product = await ProductModel.findOne({ Product_ID: req.params.id });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      product.Product = Product;
      product.Product_price = Product_price;
      product.Product_state = Product_state;
      product.Category = Category;
      product.Product_amount = Product_amount;
      product.Product_current_amount = Product_current_amount;
      product.Product_Discount = Product_Discount;
  
      if (Product_image) {
        const oldImagePath = path.join(__dirname, '../../Images/Products', product.Product_image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); 
        }
        product.Product_image = Product_image; 
      }
  
      await product.save();

      res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/deleteProduct/:id', async (req, res) => {
    try {
        const product = await ProductModel.findOne({ Product_ID: req.params.id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
    
        const oldImagePath = path.join(__dirname, '../../Images/Products', product.Product_image);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
    
        await ProductModel.findOneAndDelete({ Product_ID: req.params.id });
        res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
        console.error('Error deleting product:', error);
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

app.get('/getOrderByID/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
      const order = await OrderModel.findOne({ Order_ID: orderId });

      if (!order) {
          return res.status(404).send('Order not found');
      }

      res.send(order);
  } catch (err) {
      res.status(500).send('Server error');
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

app.patch('/toggleCustomerState/:id', async (req, res) => {
  try {
      const customerId = req.params.id;
      
      const customer = await CustomerModel.findOne({ Customer_ID: customerId });

      if (!customer) {
          return res.status(404).json({ Status: false, Error: "Customer not found" });
      }

      customer.Customer_state = !customer.Customer_state;

      await customer.save();

      res.status(200).json({ Status: true, Message: "Customer state toggled successfully" });
  } catch (error) {
      res.status(500).json({ Status: false, Error: error.message });
  }
});

app.get('/deleteCustomer/:id', async (req, res) => {
  const customerID = req.params.id;
  
  try {
      const orders = await OrderModel.find({ Customer_ID: customerID });
      
      if (orders.length > 0) {
          const orderIDs = orders.map(order => order.Order_ID);
          await ProductOrderModel.deleteMany({ Order_ID: { $in: orderIDs } });
          await OrderModel.deleteMany({ Customer_ID: customerID });
      }
      const result = await CustomerModel.deleteOne({ Customer_ID: customerID });
      
      if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Customer not found' });
      }
      
      res.status(200).json({ Status: true, Message: "Customer deleted" });
  } catch (error) {
      console.error('Error deleting customer and associated data:', error);
      res.status(500).json({ Error: error.message });
  }
});


app.get("/getAdmins", async (req, res) => {
  try {
      const admins = await AdministratorModel.find({});
      res.json(admins);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get("/getAdmin", async (req, res) => {
  try {
      const { email, password } = req.query;

      if (!email || !password) {
          return res.status(400).json({ status: "error", message: "Email and password are required" });
      }

      const admin = await AdministratorModel.findOne({ Administrator_email: email });

      if (!admin) {
          return res.json({ status: "error", message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, admin.Administrator_password);
      if (!isMatch) {
          return res.json({ status: "error", message: "Invalid email or password" });
      }

      return res.json({ status: "success", data: admin });
  } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
  }
});


app.get("/getAdminByID/:id", async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await AdministratorModel.findOne({ Administrator_ID: adminId }).lean();

        if (!admin) {
            return res.status(404).json({ error: "Administrator not found" });
        }

        const { _id, ...adminData } = admin;

        res.json(adminData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/updateAdmin', async (req, res) => {
    const { Administrator_ID, Administrator_fullname, Administrator_email, Administrator_number, Administrator_address, oldPassword, newPassword } = req.body;
  
    try {
        const admin = await AdministratorModel.findOne({ Administrator_ID });

        if (!admin) {
            return res.status(404).json({ error: 'Administrator not found' });
        }
        const isMatch = bcrypt.compareSync(oldPassword, admin.Administrator_password);
        const emailChanged = await AdministratorModel.findOne({ Administrator_email, Administrator_ID });
        const existingAdminEmail = await AdministratorModel.findOne({ Administrator_email });

        
        if (!isMatch) {
            return res.json("IncorrectOldPassword");
        }
        else if (!emailChanged && existingAdminEmail) {
            return res.json("EmailExists");
        } 
        else {
            if (newPassword.trim("") !== "") admin.Administrator_password = newPassword;
            if (Administrator_fullname) admin.Administrator_fullname = Administrator_fullname;
            if (Administrator_email) admin.Administrator_email = Administrator_email;
            if (Administrator_number) admin.Administrator_number = Administrator_number;
            if (Administrator_address) admin.Administrator_address = Administrator_address;
            const updatedAdmin = await admin.save();
            return res.json(updatedAdmin.Administrator_fullname);
        }
    } catch (error) {
        console.error('Error updating administrator details:', error);
        res.status(500).json({ error: 'Error updating administrator details' });
    }
});

app.post('/createCustomer', async (req, res) => {
    try {
        const { Customer_fullname, Customer_email, Customer_number ,Customer_password, Customer_address } = req.body;

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
                Customer_address
            });

            await newCustomer.save();
            res.json(newCustomer);
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log('Server is Running');
});
