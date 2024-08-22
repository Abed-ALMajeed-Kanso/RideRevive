import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { toast } from "react-toastify";

const apiUrl = process.env.REACT_APP_API_URL; 

const Contact: React.FC = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState<string>("");

  useEffect(() => {
    setPrevLocation(location.state?.data || "");
  }, [location]);

  const [clientName, setClientName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [messages, setMessages] = useState<string>("");

  const [errClientName, setErrClientName] = useState<string>("");
  const [errEmail, setErrEmail] = useState<string>("");
  const [errMessages, setErrMessages] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientName(e.target.value);
    setErrClientName("");
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrEmail("");
  };

  const handleMessages = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessages(e.target.value);
    setErrMessages("");
  };

  const emailValidation = (email: string): boolean => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) !== null;
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) {
      setErrClientName("Enter your Name");
    }
    if (!email) {
      setErrEmail("Enter your Email");
    } else if (!emailValidation(email)) {
      setErrEmail("Enter a Valid Email");
    }
    if (!messages) {
      setErrMessages("Enter your Messages");
    }
    if (clientName && email && emailValidation(email) && messages) {
      try {
        const response = await axios.post(`${apiUrl}/addContact`, {
          Contact_name: clientName,
          Contact_email: email,
          Contact_message: messages
        });
        setSuccessMsg(
          `Thank you dear ${clientName}, Your messages have been received successfully. Further details will be sent to you by your email at ${email}.`
        );
        toast.success("Message sent successfully!");
      } catch (error: unknown) {
        console.error('There was an error posting the contact information!', error);
        if (axios.isAxiosError(error)) {
          // Handle axios error
          if (error.response && error.response.data.message) {
            if (error.response.data.message.includes('Email already exists')) {
              setErrEmail('Email already exists');
            } else {
              setSuccessMsg(error.response.data.message);
            }
          } else {
            setSuccessMsg('Server error. Please try again later.');
          }
        } else if (error instanceof Error) {
          // Handle other errors
          setSuccessMsg(error.message);
        } else {
          // Handle unexpected cases
          setSuccessMsg('Unexpected error occurred. Please try again.');
        }
      }
    }
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Contact" prevLocation={prevLocation} />
      {successMsg ? (
        <p className="pb-20 w-96 font-medium text-green-500">{successMsg}</p>
      ) : (
        <form className="pb-20" onSubmit={handlePost}>
          <h1 className="font-titleFont font-semibold text-3xl">
            Fill up a Form
          </h1>
          <div className="w-[500px] h-auto py-6 flex flex-col gap-6">
            <div>
              <p className="text-base font-titleFont font-semibold px-2">
                Name
              </p>
              <input
                onChange={handleName}
                value={clientName}
                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                type="text"
                placeholder="Enter your name here"
              />
              {errClientName && (
                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                  <span className="text-sm italic font-bold">!</span>
                  {errClientName}
                </p>
              )}
            </div>
            <div>
              <p className="text-base font-titleFont font-semibold px-2">
                Email
              </p>
              <input
                onChange={handleEmail}
                value={email}
                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
                type="email"
                placeholder="Enter your email here"
              />
              {errEmail && (
                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                  <span className="text-sm italic font-bold">!</span>
                  {errEmail}
                </p>
              )}
            </div>
            <div>
              <p className="text-base font-titleFont font-semibold px-2">
                Messages
              </p>
              <textarea
                onChange={handleMessages}
                value={messages}
                cols={30}
                rows={3}
                className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor resize-none"
                placeholder="Enter your message here"
              ></textarea>
              {errMessages && (
                <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                  <span className="text-sm italic font-bold">!</span>
                  {errMessages}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-44 bg-primeColor text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:bg-black hover:text-white duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Contact;
