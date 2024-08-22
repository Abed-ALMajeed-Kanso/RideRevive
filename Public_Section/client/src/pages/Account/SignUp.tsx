import React, { useState } from "react";
import axios from "axios"; 
import { BsCheckCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from '../../redux/orebiSlice';

const SignUp: React.FC = () => {
  const [clientName, setClientName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confPass, setConfPass] = useState<string>(""); 
  const [address, setAddress] = useState<string>("");
  const [checked, setChecked] = useState<boolean>(false);
  const [errClientName, setErrClientName] = useState<string>("");
  const [errEmail, setErrEmail] = useState<string>("");
  const [errPhone, setErrPhone] = useState<string>("");
  const [errPassword, setErrPassword] = useState<string>("");
  const [errConfPass, setErrConfPass] = useState<string>("");
  const [errAddress, setErrAddress] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientName(e.target.value);
    setErrClientName("");
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setErrPhone("");
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const handleConfPass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfPass(e.target.value);
    setErrConfPass("");
  };

  const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setErrAddress("");
  };

  const EmailValidation = (email: string): boolean => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checked) return;

    if (!clientName) {
      setErrClientName("Enter your name");
    }

    if (!email) {
      setErrEmail("Enter your email");
    } else {
      if (!EmailValidation(email)) {
        setErrEmail("Enter a valid email");
      }
    }

    if (!phone) {
      setErrPhone("Enter your phone number");
    }

    if (!password) {
      setErrPassword("Create a password");
    } else {
      if (password.length < 8) {
        setErrPassword("Password must be at least 8 characters");
      } else if (!validatePassword(password)) {
        setErrPassword("Password must contain one uppercase letter, one lowercase letter, one number, and one special character");
      }
    }

    if (!confPass) {
      setErrConfPass("Enter your Confirm Password");
    } else if (password !== confPass) {
      setErrConfPass("Passwords do not match");
    }

    if (!address) {
      setErrAddress("Enter your address");
    }

    if (
      clientName &&
      email &&
      EmailValidation(email) &&
      phone &&
      validatePassword(password) &&
      password === confPass &&
      address
    ) {
      try {
        const response = await axios.post('http://localhost:8000/createCustomer', {
          Customer_fullname: clientName, 
          Customer_email: email, 
          Customer_number: phone,
          Customer_password: password,
          Customer_address: address
        });   
    
        if (response.data === "EmailExists") {
          setErrEmail("Email exists. Please Choose another email."); 
        } else {           
          setClientName("");
          setEmail("");
          setPhone("");
          setPassword("");
          setConfPass(""); 
          setAddress("");
          setChecked(false);
          dispatch(signIn(response.data));    
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      } catch (error) {
        console.error("There was an error creating the account:", error);
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
      <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
        {successMsg ? (
          <div className="w-[500px]">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
              {successMsg}
            </p>
          </div>
        ) : (
          <form className="w-full lgl:w-[500px] h-screen flex items-center justify-center" onSubmit={handleSignUp}>
            <div className="px-6 py-4 w-full h-[96%] flex flex-col justify-start overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">
                Create your account
              </h1>
              <div className="flex flex-col gap-3">
                {/* client name */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Full Name
                  </p>
                  <input
                    onChange={handleName}
                    value={clientName}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-2 border border-gray-400 text-base rounded-sm outline-none focus-within:border-primeColor focus-within:shadow-signUpShadow duration-200"
                    type="text"
                  />
                  {errClientName && (
                    <p className="text-xs text-red-500 -mt-1 font-medium tracking-wide">
                      {errClientName}
                    </p>
                  )}
                </div>

                {/* email */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Email
                  </p>
                  <input
                    onChange={handleEmail}
                    value={email}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-2 border border-gray-400 text-base rounded-sm outline-none focus-within:border-primeColor focus-within:shadow-signUpShadow duration-200"
                    type="email"
                  />
                  {errEmail && (
                    <p className="text-xs text-red-500 -mt-1 font-medium tracking-wide">
                      {errEmail}
                    </p>
                  )}
                </div>

                {/* phone */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Phone Number
                  </p>
                  <input
                    onChange={handlePhone}
                    value={phone}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-2 border border-gray-400 text-base rounded-sm outline-none focus-within:border-primeColor focus-within:shadow-signUpShadow duration-200"
                    type="text"
                  />
                  {errPhone && (
                    <p className="text-xs text-red-500 -mt-1 font-medium tracking-wide">
                      {errPhone}
                    </p>
                  )}
                </div>

                {/* password */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Password
                  </p>
                  <input
                    onChange={handlePassword}
                    value={password}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-2 border border-gray-400 text-base rounded-sm outline-none focus-within:border-primeColor focus-within:shadow-signUpShadow duration-200"
                    type="password"
                  />
                  {errPassword && (
                    <p className="text-xs text-red-500 -mt-1 font-medium tracking-wide">
                      {errPassword}
                    </p>
                  )}
                </div>

                {/* confirm password */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Confirm Password
                  </p>
                  <input
                    onChange={handleConfPass}
                    value={confPass}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-2 border border-gray-400 text-base rounded-sm outline-none focus-within:border-primeColor focus-within:shadow-signUpShadow duration-200"
                    type="password"
                  />
                  {errConfPass && (
                    <p className="text-xs text-red-500 -mt-1 font-medium tracking-wide">
                      {errConfPass}
                    </p>
                  )}
                </div>

                {/* address */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Address
                  </p>
                  <input
                    onChange={handleAddress}
                    value={address}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-2 border border-gray-400 text-base rounded-sm outline-none focus-within:border-primeColor focus-within:shadow-signUpShadow duration-200"
                    type="text"
                  />
                  {errAddress && (
                    <p className="text-xs text-red-500 -mt-1 font-medium tracking-wide">
                      {errAddress}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  {/* check box */}
                  <div className="flex items-center gap-1">
                    <input
                      onChange={(e) => setChecked(e.target.checked)}
                      checked={checked}
                      className="w-4 h-4"
                      type="checkbox"
                    />
                    <p className="text-sm text-gray-500">
                      Agree to{" "}
                      <span className="underline text-blue-600 decoration-[1px] underline-offset-2 hover:text-blue-800 duration-300 cursor-pointer">
                        Terms and Conditions
                      </span>
                    </p>
                  </div>
                  <button
                    type="submit"
                    className={`h-8 text-sm text-white rounded-md font-medium shadow-sm duration-300 ${
                      checked
                        ? "bg-primeColor hover:bg-primeColorHover"
                        : "bg-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!checked}
                  >
                    Sign up
                  </button>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link to="/signin">
                        <span className="underline text-blue-600 decoration-[1px] underline-offset-2 hover:text-blue-800 duration-300 cursor-pointer">
                          Sign in
                        </span>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
