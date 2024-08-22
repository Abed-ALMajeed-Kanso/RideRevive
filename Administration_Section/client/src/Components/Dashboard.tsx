import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    localStorage.removeItem("valid");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    navigate('/');
  };

  let adminName = localStorage.getItem("adminName") || "";
  const nameParts = adminName.split(" ").filter(part => part.trim() !== "");

  if (nameParts.length > 1) {
    const firstName = nameParts[0];
    const remainingNameParts = nameParts.slice(1);
    const nameWithoutLastPart = nameParts.slice(0, -1).join(" ");
    if (nameWithoutLastPart.length > 10) {
      const newLastName = remainingNameParts.slice(0, -1).join(" ");
      adminName = `${firstName} ${newLastName}`;
    }
  }

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link
              to="/dashboard"
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">
                Welcome {adminName}
              </span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li style={{ width: '200px' }}>
                <Link
                  to="/dashboard"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="fs-4 bi-speedometer2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>              
              <li style={{ width: '200px' }}>
                <Link
                  to="/dashboard/profile"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-person ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Profile</span>
                </Link>
              </li>
              <li style={{ width: '200px' }}>
                <Link
                  to="/dashboard/category"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-columns ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Categories</span>
                </Link>
              </li>
              <li style={{ width: '200px' }}>
                <Link
                  to="/dashboard/product"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-people ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">
                    Products
                  </span>
                </Link>
              </li>
              <li style={{ width: '200px' }}>
                <Link
                  to="/dashboard/customer"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-people ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">
                    Customers
                  </span>
                </Link>
              </li>
              <li style={{ width: '200px' }}>
                <button
                  onClick={handleLogout}
                  className="nav-link px-0 align-middle text-white"
                  style={{ background: 'none', border: 'none' }}
                >
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>RIDEREVIVE ADMINISTRATION PANEL</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
