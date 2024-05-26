import React, { useState, ChangeEvent, MouseEvent } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { useMetaMask } from "../../hooks/useMetaMask";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigation } from "../Navigation";
import { Footer } from "../Footer";

interface Message {
  text: string;
  type: "error" | "success";
}
const API_URL=import.meta.env.VITE_API_URL;
export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    nationalId: "",
    phoneNumber: "",
    otp: "",
  });

  var [isVerified, setIsVerified] = useState(true);

  var { wallet } = useMetaMask();
  
  const [message, setMessage] = useState<Message | null>(null);
 
  const [errors, setErrors] = useState({
    dob: "",
    nationalId: "",
    formSubmit: "",
    otp: "",
  });

  const sendCode = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/send-code, { phone }`);
      
      setMessage({ text: "Code sent successfully", type: "success" });
    } catch (error) {
      setMessage({ text: "Error sending code", type: "error" });
    }
  };

  const verifyCode = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/verify-code", { phone, code }`);
      setMessage({ text: "Phone verified!", type: "success" });
      setIsVerified(true);
    } catch (error) {
      setMessage({ text: "Invalid code", type: "error" });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "nationalId" || name === "otp") {
      // Allow only numeric input
      const numericValue = value.replace(/\D/g, "");
      setFormData({
        ...formData,
        [name]: numericValue.toString(),
      });
    } else if (name === "phoneNumber") {
      // Allow only numeric input and '+' symbol
      const phoneValue = value.replace(/[^0-9+]/g, "");
      setFormData({
        ...formData,
        [name]: phoneValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm && !isVerified) {
      alert("Please fill in all fields");
      return;
    } else {
      try {
        await addNewUser();
        toast.success("Registered Successfully! Redirecting...", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setTimeout(() => {
          navigate("/", { replace: true, state: { reload: true } }); // Set state to true to trigger redirect after 5 seconds
        }, 5000); // 5000 milliseconds = 5 seconds
        console.log("Added successfully"); // log the response data if needed
      } catch (error: any) {
        console.error("Error:", error.message);
      }
    }
  };
  const addNewUser = async () => {
    await fetch(`${API_URL}/api/users`, {
      method: "POST",
      body: JSON.stringify({
        name: formData.fullName,
        dob: formData.dob,
        nationalId: formData.nationalId,
        phone: formData.phoneNumber,
        walletAddress: wallet.accounts[0],
        isVerified: true,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case "dob":
        const dobError = !validateDOB(value)
          ? "You must be over 18 years old."
          : "";
        setErrors({
          ...errors,
          dob: dobError,
        });
        break;
      case "nationalId":
        const nationalIdError = !validateNationalId(value)
          ? "National ID must be exactly 12 digits."
          : "";
        setErrors({
          ...errors,
          nationalId: nationalIdError,
        });
        break;
      case "formSubmit":
        const formSubmitError = !validateFormSubmit()
          ? "Please fill in all fields above!"
          : "";
        setErrors({
          ...errors,
          formSubmit: formSubmitError,
        });
        break;
      case "otp":
        const optError = !validateCode(value)
          ? "Please enter 6-digit code."
          : "";
        setErrors({
          ...errors,
          otp: optError,
        });
        break;

      default:
        break;
    }
  };
  const validateCode = (code: string): boolean => {
    return /^\d{6}$/.test(code);
  };

  const validateFormSubmit = (): boolean => {
    if (
      !formData.fullName ||
      !formData.dob ||
      !formData.nationalId ||
      !formData.phoneNumber ||
      !formData.otp ||
      !isVerified
    ) {
      return false;
    }
    return true;
  };

  const validateDOB = (dob: string): boolean => {
    const today = new Date();
    const birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 18;
  };

  const validateNationalId = (nationalId: string): boolean => {
    return /^\d{12}$/.test(nationalId);
  };

  const validateForm = () => {
    const dobError = !validateDOB(formData.dob)
      ? "You must be over 18 years old."
      : "";
    const nationalIdError = !validateNationalId(formData.nationalId)
      ? "National ID must be exactly 12 digits."
      : "";
    const formSubmitError = !validateFormSubmit()
      ? "Please fill in all fields above!"
      : "";
    const otpError = !validateCode(formData.otp)
      ? "Please enter 6-digit code."
      : "";

    setErrors({
      dob: dobError,
      nationalId: nationalIdError,
      formSubmit: formSubmitError,
      otp: otpError,
    });

    return dobError === "" && nationalIdError === "";
  };
  

  return (
    <>
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <Navigation/>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-2/3 xl:w-2/3 p-6 sm:p-12">
          {" "}
          {/* Adjust width here */}
          {/* <div>
            <Link to="/">
              <img
                src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
                className="w-32 mx-auto"
                alt="Logo"
              />
            </Link>
          </div> */}
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
            
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center">
                <form
                  onSubmit={handleSubmit}
                  className=" bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                  <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Full Name
                    </label>
                    <input
                      className="w-full pl-2 py-3 rounded-lg font-medium font- bg-gray-50 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                      Day of birth
                    </label>
                  <input
                    className="w-full pl-2 py-3 rounded-lg font-medium bg-gray-50 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    id="dob"
                    type="date"
                    placeholder="Date of Birth"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-xs italic">{errors.dob}</p>
                  )}

                  <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      National ID
                    </label>
                    <input
                      className="w-full pl-2 pr-20 py-3 rounded-lg font-medium bg-gray-50 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      name="nationalId"
                      placeholder="National ID"
                      value={formData.nationalId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    {errors.nationalId && (
                      <p className="text-red-500 text-xs italic">
                        {errors.nationalId}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold ">
                      Phone Number
                    </label>

                    <div className="w-full flex mt-2">
                      <input
                        className="flex-grow pl-2 pr-20  rounded-lg font-medium bg-gray-50 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="px-8 py-3 rounded-lg font-medium bg-sky-500 text-gray-100 hover:bg-sky-500 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none ml-2"
                        onClick={sendCode}
                      >
                        Send Code
                      </button>
                    </div>
                  </div>

                  <div className="w-full flex mt-2">
                    <input
                      className="flex-grow pl-2 pr-20  rounded-lg font-medium bg-gray-50 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      name="otp"
                      placeholder="OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    <button
                      type="button"
                      className="px-7 py-3 rounded-lg font-medium bg-sky-500 text-gray-100 hover:bg-sky-500 transition-all duration-300 ease-in-out focus:shadow-outline focus:outline-none ml-2"
                      onClick={verifyCode}
                    >
                      Verify Code
                    </button>
                  </div>
                  {errors.otp && (
                    <p className="text-red-500 text-xs italic">{errors.otp}</p>
                  )}
                  {message && (
                    <div
                      className={`mt-4 p-4 rounded ${
                        message.type === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <div className="mb-4 pt-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Wallet Address
                    </label>
                    <input
                      className=" text-red-200 cursor-not-allowed w-full pl-2 py-3 rounded-lg font-medium bg-gray-50 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      name="walletAddress"
                      placeholder={wallet.accounts[0]}
                      disabled
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-sky-500 text-gray-100 w-full py-4 rounded-lg hover:bg-sky-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    Submit
                  </button>
                  {errors.formSubmit && (
                    <p className="text-red-500 text-xs italic">
                      {errors.formSubmit}
                    </p>
                  )}
                  <div className="w-full max-w-xs mt-10">
                    <p className=" text-center text-gray-500 text-xs">
                      &copy;2024 B - Election. All rights reserved to NPQT.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat">
            <div className={styles.register}></div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};
