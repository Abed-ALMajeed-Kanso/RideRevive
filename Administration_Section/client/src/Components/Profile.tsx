import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { toast } from "react-toastify";
import Toast from './Toast';
import { Administrator } from '../types/Administrator';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Profile: React.FC = () => {
  const [adminName, setAdminName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [errAdminName, setErrAdminName] = useState<string>("");
  const [errEmail, setErrEmail] = useState<string>("");
  const [errPhone, setErrPhone] = useState<string>("");
  const [errAddress, setErrAddress] = useState<string>("");
  const [errOldPassword, setErrOldPassword] = useState<string>("");
  const [errNewPassword, setErrNewPassword] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [adminID, setAdminID] = useState<string>("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const ID = localStorage.getItem("adminId");
        if (!ID) throw new Error('No admin ID found');
        const url = `${apiUrl}/getAdminByID/${ID}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch admin data');
        }
        const admin: Administrator = await response.json();
        setAdminName(admin.Administrator_fullname);
        setEmail(admin.Administrator_email);
        setPhone(admin.Administrator_number);
        setAddress(admin.Administrator_address);
        setAdminID(ID);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchAdminData();
  }, []);

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setAdminName(e.target.value);
    setErrAdminName("");
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
    if (password === "") return true;
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(password);
  };

  const handleManageAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!adminName) {
      setErrAdminName("Enter your name");
      return;
    }

    if (!email) {
      setErrEmail("Enter your email");
      return;
    } else if (!EmailValidation(email)) {
      setErrEmail("Enter a valid email");
      return;
    }

    if (!phone) {
      setErrPhone("Enter your phone number");
      return;
    }

    if (!address) {
      setErrAddress("Enter your address");
      return;
    }

    if (!oldPassword) {
      setErrOldPassword("Enter Your password");
      return;
    } else if (!validatePassword(oldPassword)) {
      setErrOldPassword("Password must be at least 8 characters and contain one uppercase letter, one lowercase letter, one number, and one special character");
      return;
    }

    if (newPassword !== "" && !validatePassword(newPassword)) {
      setErrNewPassword("Password must be at least 8 characters and contain one uppercase letter, one lowercase letter, one number, and one special character");
      return;
    }

    if (adminName && email && EmailValidation(email) && phone && address && validatePassword(oldPassword) && validatePassword2(newPassword)) {
      const response = await fetch(`${apiUrl}/updateAdmin`, { 
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Administrator_ID: adminID,
          Administrator_fullname: adminName,
          Administrator_email: email,
          Administrator_number: phone,
          Administrator_address: address,
          oldPassword: oldPassword,
          newPassword: newPassword
        }),
      });

      const responseData = await response.json();

      if (responseData === "IncorrectOldPassword") {
        setErrOldPassword("Password Incorrect.");
      } else if (responseData === "EmailExists") {
        setErrEmail("Email exists. Please choose another email.");
      } else {
        localStorage.setItem("adminName", responseData);
        toast.success("Account Updated Successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Profile</h3>
        <form className="row g-1" onSubmit={handleManageAccount}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Full Name"
              value={adminName}
              onChange={handleName}
            />
            {errAdminName && <div className="text-danger">{errAdminName}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail"
              placeholder="Enter Email"
              value={email}
              onChange={handleEmail}
            />
            {errEmail && <div className="text-danger">{errEmail}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputPhone" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputPhone"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={handlePhone}
            />
            {errPhone && <div className="text-danger">{errPhone}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="Enter Address"
              value={address}
              onChange={handleAddress}
            />
            {errAddress && <div className="text-danger">{errAddress}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputOldPassword" className="form-label">
              Old Password
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputOldPassword"
              placeholder="Enter Password"
              value={oldPassword}
              onChange={handleOldPassword}
            />
            {errOldPassword && <div className="text-danger">{errOldPassword}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="inputNewPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputNewPassword"
              placeholder="Enter New Password, Leave it empty if you don't want to change it"
              value={newPassword}
              onChange={handleNewPassword}
            />
            {errNewPassword && <div className="text-danger">{errNewPassword}</div>}
          </div>
          <div>
            <br />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Update Profile
            </button>
          </div>
          {successMsg && <div className="text-success mt-3">{successMsg}</div>}
        </form>
      </div>
      <Toast />
    </div>
  );
};

export default Profile;

