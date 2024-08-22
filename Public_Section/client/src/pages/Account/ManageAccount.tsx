import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios"; 
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Customer } from '../../types/Customer';

const apiUrl = process.env.REACT_APP_API_URL;

const ManageAccount: React.FC = () => {
  const [clientName, setClientName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [checked, setChecked] = useState<boolean>(false);
  const [errClientName, setErrClientName] = useState<string>("");
  const [errEmail, setErrEmail] = useState<string>("");
  const [errPhone, setErrPhone] = useState<string>("");
  const [errAddress, setErrAddress] = useState<string>("");
  const [errOldPassword, setErrOldPassword] = useState<string>("");
  const [errNewPassword, setErrNewPassword] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [customerID, setCustomerID] = useState<number | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: any) => state.orebiReducer.isAuthenticated !== -1);
  const CustomerID = useSelector((state: any) => state.orebiReducer.isAuthenticated);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        if (!isAuthenticated) {
          navigate('/SignIn');
          return;
        }

        const response = await axios.get<Customer>(`${apiUrl}/getCustomerById/${CustomerID}`);

        const customer = response.data;
        setClientName(customer.Customer_fullname);
        setEmail(customer.Customer_email);
        setPhone(customer.Customer_number);
        setAddress(customer.Customer_address);
        setCustomerID(customer.Customer_ID);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    fetchCustomerData();
  }, [isAuthenticated, navigate, dispatch]);

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setClientName(e.target.value);
    setErrClientName("");
  };

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePhone = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setErrPhone("");
  };

  const handleAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setErrAddress("");
  };

  const handleOldPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
    setErrOldPassword("");
  };

  const handleNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setErrNewPassword("");
  };

  const EmailValidation = (email: string): boolean => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  };

  const validatePassword2 = (password: string): boolean => {
    return password === "" || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  };

  const handleManageAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let isValid = true;

    if (!clientName) {
      setErrClientName("Enter your name");
      isValid = false;
    }

    if (!email) {
      setErrEmail("Enter your email");
      isValid = false;
    } else if (!EmailValidation(email)) {
      setErrEmail("Enter a valid email");
      isValid = false;
    }

    if (!phone) {
      setErrPhone("Enter your phone number");
      isValid = false;
    }

    if (!address) {
      setErrAddress("Enter your address");
      isValid = false;
    }

    if (!oldPassword) {
      setErrOldPassword("Enter Your password");
      isValid = false;
    } else if (!validatePassword(oldPassword)) {
      setErrOldPassword("Password must contain one uppercase letter, one lowercase letter, one number, and one special character");
      isValid = false;
    }

    if (newPassword && !validatePassword(newPassword)) {
      setErrNewPassword("Password must contain one uppercase letter, one lowercase letter, one number, and one special character");
      isValid = false;
    }

    if (isValid && checked) {
      try {
        const response = await axios.patch(`${apiUrl}/updateCustomer`, {
          Customer_ID: customerID,
          Customer_fullname: clientName,
          Customer_email: email,
          Customer_number: phone,
          Customer_address: address,
          oldPassword: oldPassword,
          newPassword: newPassword
        });

        if (response.data === "IncorrectOldPassword") {
          setErrOldPassword("Password Incorrect.");
        } else if (response.data === "EmailExists") {
          setErrEmail("Email exists. Please choose another email.");
        } else {
          setSuccessMsg("Your account is updated successfully!");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        console.error("Error updating customer data:", error);
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-start">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <span className="Logo">RideRevive</span>
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">
              Stay signed in for more
            </h1>
            <p className="text-base">When you sign in, you are with us!</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Get started fast with RideRevive
              </span>
              <br />
              Enjoy a seamless and quick exploration process. Explore our 
              vast collection of tools and resources.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Access all RideRevive services
              </span>
              <br />
              Unlock the full potential of RideRevive. Access advanced tools, 
              and premium support to elevate your satisfaction.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Trusted by online Shoppers
              </span>
              <br />
              Benefit from our irreplaceable services. 
              Our platform is trusted by users worldwide for 
              its reliability and quality.
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <Link to="/">
              <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
                © RideRevive
              </p>
            </Link>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Terms
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Privacy
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Security
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lgl:w-1/2 h-full flex items-center justify-center relative">
        <form
          onSubmit={handleManageAccount}
          className="w-[85%] md:w-[450px] h-[650px] flex flex-col items-center">
          <h2 className="text-3xl font-titleFont font-bold mb-8">
            Manage Your Account
          </h2>
          {successMsg && (
            <p className="w-full text-base font-titleFont font-semibold text-green-500 border-[1px] border-green-500 py-1 text-center">
              {successMsg}
            </p>
          )}
          <div className="w-full mb-5">
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              value={clientName}
              onChange={handleName}
              className={`w-full py-1 border-b-2 ${errClientName && "border-red-500"}`}
              type="text"
            />
            {errClientName && (
              <p className="text-red-500 text-xs mt-1">{errClientName}</p>
            )}
          </div>
          <div className="w-full mb-5">
            <label className="text-sm text-gray-600">Email Address</label>
            <input
              value={email}
              onChange={handleEmail}
              className={`w-full py-1 border-b-2 ${errEmail && "border-red-500"}`}
              type="email"
            />
            {errEmail && (
              <p className="text-red-500 text-xs mt-1">{errEmail}</p>
            )}
          </div>
          <div className="w-full mb-5">
            <label className="text-sm text-gray-600">Phone Number</label>
            <input
              value={phone}
              onChange={handlePhone}
              className={`w-full py-1 border-b-2 ${errPhone && "border-red-500"}`}
              type="text"
            />
            {errPhone && (
              <p className="text-red-500 text-xs mt-1">{errPhone}</p>
            )}
          </div>
          <div className="w-full mb-5">
            <label className="text-sm text-gray-600">Address</label>
            <input
              value={address}
              onChange={handleAddress}
              className={`w-full py-1 border-b-2 ${errAddress && "border-red-500"}`}
              type="text"
            />
            {errAddress && (
              <p className="text-red-500 text-xs mt-1">{errAddress}</p>
            )}
          </div>
          <div className="w-full mb-5">
            <label className="text-sm text-gray-600">Old Password</label>
            <input
              value={oldPassword}
              onChange={handleOldPassword}
              className={`w-full py-1 border-b-2 ${errOldPassword && "border-red-500"}`}
              type="password"
            />
            {errOldPassword && (
              <p className="text-red-500 text-xs mt-1">{errOldPassword}</p>
            )}
          </div>
          <div className="w-full mb-8">
            <label className="text-sm text-gray-600">New Password</label>
            <input
              value={newPassword}
              onChange={handleNewPassword}
              className={`w-full py-1 border-b-2 ${errNewPassword && "border-red-500"}`}
              type="password"
            />
            {errNewPassword && (
              <p className="text-red-500 text-xs mt-1">{errNewPassword}</p>
            )}
          </div>
          <div className="flex items-center mb-8">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="w-5 h-5 text-primeColor"
            />
            <label className="ml-2 text-sm text-gray-600">Confirm Changes</label>
          </div>
          <button
            type="submit"
            className="w-full h-[45px] bg-primeColor text-white font-titleFont font-semibold rounded-lg hover:bg-primeColor-hover duration-300">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageAccount;
