import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Login'
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Home from './Components/Home'
import Customer from './Components/Customer'
import Profile from './Components/Profile'
import Category from './Components/Category'
import AddCategory from './Components/AddCategory'
import EditCategory from './Components/EditCategory'
import Product from './Components/Product'
import AddProduct from './Components/AddProduct'
import EditProduct from './Components/EditProduct'
import PrivateRoute from './Components/PrivateRoute'
import ViewCustomerOrders from './Components/ViewCustomerOrders';
import OrderDetails from './Components/OrderDetails';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />}></Route>
      <Route path='/dashboard' element={
        <PrivateRoute >
          <Dashboard />
        </PrivateRoute>
      }>
        <Route path='' element={<Home />}></Route>
        <Route path='/dashboard/customer' element={<Customer />}></Route>
        <Route path='/dashboard/orders' element={<ViewCustomerOrders />}></Route>
        <Route path='/dashboard/order_details' element={<OrderDetails />}></Route>
        <Route path='/dashboard/profile' element={<Profile />}></Route>
        <Route path='/dashboard/category' element={<Category />}></Route>
        <Route path='/dashboard/add_category' element={<AddCategory />}></Route>
        <Route path='/dashboard/edit_category' element={<EditCategory />}></Route>
        <Route path='/dashboard/product' element={<Product />}></Route>
        <Route path='/dashboard/add_product' element={<AddProduct />}></Route>
        <Route path='/dashboard/edit_product' element={<EditProduct />}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
