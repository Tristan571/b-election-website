import { useState, useEffect } from "react";

import { BrowserRouter as Router, Link } from "react-router-dom";

import { Card } from "antd";
import { IVoting } from "../../modules/Voting.module";
import { useMetaMask } from "../../hooks/useMetaMask";

import { useUser } from "../../hooks/userContext";

import "react-toastify/dist/ReactToastify.css";
import { Footer } from "../Footer";

import Usage from "../Usage";

const API_URL=import.meta.env.VITE_API_URL;

export const Display: React.FC = () => {
  var [lastTenVotings, setLastTenVotings] = useState<IVoting[]>([]);

  var { wallet } = useMetaMask();

  var { userRegistered } = useUser();

  useEffect(() => {
    FetchData();
    console.log("User state from DL:", userRegistered);
  }, [userRegistered, wallet]);

  const FetchData = async () => {
    try {
      const data = await getData();

      await setLastTenVotings(data.slice(-2));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <div>
        <div className="mx-auto mb-20 max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32 pt-50 ">
          <p className="mx-auto -mt-4 max-w-2xl text-lg tracking-tight text-slate-700 sm:mt-6">
            Welcome to
            <span className="border-b border-dotted border-slate-300">
              {" "}
              B - Election
            </span>
          </p>

          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            <span className="inline-block">
              Your
              <span className="relative whitespace-nowrap text-sky-500">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
                </svg>
                <span className="relative">
                  {" "}
                  Election <br />{" "}
                </span>{" "}
              </span>
            </span>
            <span> Choice</span>
          </h1>

          <p className="mx-auto mt-9 max-w-2xl text-lg tracking-tight text-slate-700 sm:mt-6">
            <span className="inline-block">
              Shape Tomorrow with Your Vote Today –{" "}
            </span>
            <span> Your Voice, Your Choice.</span>
          </p>

          <div className="mt-12 flex flex-col justify-center gap-y-5 sm:mt-10 sm:flex-row sm:gap-y-0 sm:gap-x-6">
            <div
              className="relative flex flex-1 flex-col items-stretch sm:flex-none"
              data-headlessui-state=""
            >
              {userRegistered ? (
                <Link to="create-voting">
                  <button
                    className="group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none ring-slate-200 text-slate-700 hover:text-slate-900  hover:bg-zinc-100 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300 animate-fade-in-right"
                    id="headlessui-menu-button-:r4:"
                    aria-haspopup="true"
                    aria-expanded="false"
                    data-headlessui-state=""
                    type="button"
                  >
                    <span>Create an Election</span>
                  </button>
                </Link>
              ) : (
                <Link to="/register">
                  <button
                    className="group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none ring-slate-200 text-slate-700 hover:text-slate-900  hover:bg-zinc-100 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300 animate-fade-in-right"
                    id="headlessui-menu-button-:r4:"
                    aria-haspopup="true"
                    aria-expanded="false"
                    data-headlessui-state=""
                    type="button"
                  >
                    <span>Create an Election</span>
                  </button>
                </Link>
              )}
            </div>
            <a className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2  text-white hover:bg-cyan-700 bg-sky-500 hover:text-slate-100 active:bg-cyan-800 active:text-slate-300 focus-visible:outline-cyan-900 animate-fade-in-left">
              <span className="">Explore more</span>
            </a>
          </div>
        </div>

        <div className="bg-gray-50 px-2 py-10">
          <div id="features" className="mx-auto max-w-6xl">
            <p className="text-center text-base font-semibold leading-7 text-primary-500">
              Empowering Elections with Blockchain Technology
            </p>
            <h2 className="text-center font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Why you should use Blockchain Election ?
            </h2>
            <ul className="mt-16 grid grid-cols-1 gap-6 text-center text-slate-700 md:grid-cols-3">
              <li className="rounded-xl bg-white px-6 py-8 shadow-sm">
                <svg
                  className="mx-auto h-10 w-10"
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#000000"
                  stroke-width="0.00024000000000000003"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M9 16C9 16.5523 8.55229 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55229 15 9 15.4477 9 16Z"
                      fill="#1C274C"
                    ></path>{" "}
                    <path
                      d="M13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16Z"
                      fill="#1C274C"
                    ></path>{" "}
                    <path
                      d="M16 17C16.5523 17 17 16.5523 17 16C17 15.4477 16.5523 15 16 15C15.4477 15 15 15.4477 15 16C15 16.5523 15.4477 17 16 17Z"
                      fill="#1C274C"
                    ></path>{" "}
                    <path
                      fillRule="evenodd"
                      d="M5.25 8V9.30277C5.02317 9.31872 4.80938 9.33948 4.60825 9.36652C3.70814 9.48754 2.95027 9.74643 2.34835 10.3483C1.74643 10.9503 1.48754 11.7081 1.36652 12.6082C1.24996 13.4752 1.24998 14.5775 1.25 15.9451V16.0549C1.24998 17.4225 1.24996 18.5248 1.36652 19.3918C1.48754 20.2919 1.74643 21.0497 2.34835 21.6516C2.95027 22.2536 3.70814 22.5125 4.60825 22.6335C5.47522 22.75 6.57754 22.75 7.94513 22.75H16.0549C17.4225 22.75 18.5248 22.75 19.3918 22.6335C20.2919 22.5125 21.0497 22.2536 21.6517 21.6516C22.2536 21.0497 22.5125 20.2919 22.6335 19.3918C22.75 18.5248 22.75 17.4225 22.75 16.0549V15.9451C22.75 14.5775 22.75 13.4752 22.6335 12.6082C22.5125 11.7081 22.2536 10.9503 21.6517 10.3483C21.0497 9.74643 20.2919 9.48754 19.3918 9.36652C19.1906 9.33948 18.9768 9.31872 18.75 9.30277V8C18.75 4.27208 15.7279 1.25 12 1.25C8.27208 1.25 5.25 4.27208 5.25 8ZM12 2.75C9.10051 2.75 6.75 5.10051 6.75 8V9.25344C7.12349 9.24999 7.52152 9.24999 7.94499 9.25H16.0549C16.4783 9.24999 16.8765 9.24999 17.25 9.25344V8C17.25 5.10051 14.8995 2.75 12 2.75ZM4.80812 10.8531C4.07435 10.9518 3.68577 11.1322 3.40901 11.409C3.13225 11.6858 2.9518 12.0743 2.85315 12.8081C2.75159 13.5635 2.75 14.5646 2.75 16C2.75 17.4354 2.75159 18.4365 2.85315 19.1919C2.9518 19.9257 3.13225 20.3142 3.40901 20.591C3.68577 20.8678 4.07435 21.0482 4.80812 21.1469C5.56347 21.2484 6.56459 21.25 8 21.25H16C17.4354 21.25 18.4365 21.2484 19.1919 21.1469C19.9257 21.0482 20.3142 20.8678 20.591 20.591C20.8678 20.3142 21.0482 19.9257 21.1469 19.1919C21.2484 18.4365 21.25 17.4354 21.25 16C21.25 14.5646 21.2484 13.5635 21.1469 12.8081C21.0482 12.0743 20.8678 11.6858 20.591 11.409C20.3142 11.1322 19.9257 10.9518 19.1919 10.8531C18.4365 10.7516 17.4354 10.75 16 10.75H8C6.56459 10.75 5.56347 10.7516 4.80812 10.8531Z"
                      fill="#1C274C"
                    ></path>{" "}
                  </g>
                </svg>
                <h3 className="my-3 font-display font-medium  hover:text-sky-500">
                  Unmatched Security
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-secondary-500">
                  Blockchain's decentralized nature ensures that votes cannot be
                  tampered with, providing the highest level of security.
                </p>
              </li>
              <li className="rounded-xl bg-white px-6 py-8 shadow-sm">
                <svg
                  className="mx-auto h-10 w-10"
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#000000"
                  stroke-width="0.00024000000000000003"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M18.2892 2.88976C17.2615 2.75159 15.9068 2.75 14 2.75C13.5858 2.75 13.25 2.41421 13.25 2C13.25 1.58579 13.5858 1.25 14 1.25H14.0564C15.8942 1.24998 17.3498 1.24997 18.489 1.40314C19.6615 1.56076 20.6104 1.89288 21.3588 2.64124C22.0432 3.32568 22.417 3.97665 22.5924 4.98199C22.7501 5.88571 22.7501 7.1045 22.75 8.90369L22.75 9C22.75 9.41422 22.4142 9.75 22 9.75C21.5858 9.75 21.25 9.41422 21.25 9C21.25 7.08092 21.2471 5.9986 21.1147 5.23984C20.9973 4.56666 20.7852 4.18904 20.2981 3.7019C19.8749 3.27869 19.2952 3.02503 18.2892 2.88976Z"
                      fill="#1C274C"
                    ></path>{" "}
                    <path
                      d="M2.75001 15C2.75001 14.5858 2.41422 14.25 2.00001 14.25C1.58579 14.25 1.25001 14.5858 1.25001 15L1.25 15.0963C1.24995 16.8955 1.24992 18.1143 1.40762 19.018C1.58304 20.0233 1.95681 20.6743 2.64125 21.3588C3.38961 22.1071 4.33856 22.4392 5.51098 22.5969C6.6502 22.75 8.10583 22.75 9.94359 22.75H10C10.4142 22.75 10.75 22.4142 10.75 22C10.75 21.5858 10.4142 21.25 10 21.25C8.09318 21.25 6.73852 21.2484 5.71085 21.1102C4.70476 20.975 4.12512 20.7213 3.70191 20.2981C3.21477 19.811 3.00275 19.4333 2.88529 18.7602C2.75289 18.0014 2.75001 16.9191 2.75001 15Z"
                      fill="#1C274C"
                    ></path>{" "}
                    <path
                      d="M22.75 15C22.75 14.5858 22.4142 14.25 22 14.25C21.5858 14.25 21.25 14.5858 21.25 15C21.25 16.9191 21.2471 18.0014 21.1147 18.7602C20.9973 19.4333 20.7852 19.811 20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25C13.5858 21.25 13.25 21.5858 13.25 22C13.25 22.4142 13.5858 22.75 14 22.75H14.0564C15.8942 22.75 17.3498 22.75 18.489 22.5969C19.6615 22.4392 20.6104 22.1071 21.3588 21.3588C22.0432 20.6743 22.417 20.0233 22.5924 19.018C22.7501 18.1143 22.7501 16.8955 22.75 15.0963L22.75 15Z"
                      fill="#1C274C"
                    ></path>{" "}
                    <path
                      d="M10 1.25H9.94359C8.10584 1.24998 6.65019 1.24997 5.51098 1.40314C4.33856 1.56076 3.38961 1.89288 2.64125 2.64124C1.95681 3.32568 1.58304 3.97665 1.40762 4.98199C1.24992 5.8857 1.24995 7.10448 1.25 8.90364L1.25001 9C1.25001 9.41422 1.58579 9.75 2.00001 9.75C2.41422 9.75 2.75001 9.41422 2.75001 9C2.75001 7.08092 2.75289 5.9986 2.88529 5.23984C3.00275 4.56666 3.21477 4.18904 3.70191 3.7019C4.12512 3.27869 4.70476 3.02503 5.71085 2.88976C6.73852 2.75159 8.09319 2.75 10 2.75C10.4142 2.75 10.75 2.41421 10.75 2C10.75 1.58579 10.4142 1.25 10 1.25Z"
                      fill="#1C274C"
                    ></path>{" "}
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12 9.25C10.4812 9.25 9.25001 10.4812 9.25001 12C9.25001 13.5188 10.4812 14.75 12 14.75C13.5188 14.75 14.75 13.5188 14.75 12C14.75 10.4812 13.5188 9.25 12 9.25ZM10.75 12C10.75 11.3096 11.3096 10.75 12 10.75C12.6904 10.75 13.25 11.3096 13.25 12C13.25 12.6904 12.6904 13.25 12 13.25C11.3096 13.25 10.75 12.6904 10.75 12Z"
                      fill="#1C274C"
                    ></path>{" "}
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.32438 9.45049C6.59435 7.97738 8.77637 6.25 12 6.25C15.2236 6.25 17.4057 7.97738 18.6756 9.45049L18.7079 9.48791C18.9789 9.80202 19.2576 10.125 19.4491 10.5121C19.6632 10.9448 19.75 11.4094 19.75 12C19.75 12.5906 19.6632 13.0552 19.4491 13.4879C19.2576 13.875 18.9789 14.198 18.7079 14.5121L18.6756 14.5495C17.4057 16.0226 15.2236 17.75 12 17.75C8.77637 17.75 6.59435 16.0226 5.32438 14.5495L5.29211 14.5121C5.0211 14.198 4.7424 13.875 4.5509 13.4879C4.33676 13.0552 4.25001 12.5906 4.25001 12C4.25001 11.4094 4.33676 10.9448 4.5509 10.5121C4.74241 10.125 5.02109 9.80202 5.2921 9.48791L5.32438 9.45049ZM12 7.75C9.369 7.75 7.56642 9.14707 6.46048 10.4299C6.14652 10.7941 5.99368 10.9785 5.89533 11.1773C5.81198 11.3457 5.75001 11.566 5.75001 12C5.75001 12.434 5.81198 12.6543 5.89533 12.8227C5.99368 13.0215 6.14652 13.2059 6.46048 13.5701C7.56642 14.8529 9.369 16.25 12 16.25C14.631 16.25 16.4336 14.8529 17.5395 13.5701C17.8535 13.2059 18.0063 13.0215 18.1047 12.8227C18.188 12.6543 18.25 12.434 18.25 12C18.25 11.566 18.188 11.3457 18.1047 11.1773C18.0063 10.9785 17.8535 10.7941 17.5395 10.4299C16.4336 9.14707 14.631 7.75 12 7.75Z"
                      fill="#1C274C"
                    ></path>{" "}
                  </g>
                </svg>
                <h3 className="my-3 font-display font-medium  hover:text-sky-500">
                  Transparent Voting
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-secondary-500">
                  Every vote is recorded on a public ledger, making the entire
                  election process transparent and verifiable.
                </p>
              </li>
              <li className="rounded-xl bg-white px-6 py-8 shadow-sm">
                <svg
                  className="mx-auto h-10 w-10"
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.26279 3.25871C7.38317 2.12953 8.33887 1.25 9.5 1.25H14.5C15.6611 1.25 16.6168 2.12953 16.7372 3.25871C17.5004 3.27425 18.1602 3.31372 18.7236 3.41721C19.4816 3.55644 20.1267 3.82168 20.6517 4.34661C21.2536 4.94853 21.5125 5.7064 21.6335 6.60651C21.75 7.47348 21.75 8.5758 21.75 9.94339V16.0531C21.75 17.4207 21.75 18.523 21.6335 19.39C21.5125 20.2901 21.2536 21.048 20.6517 21.6499C20.0497 22.2518 19.2919 22.5107 18.3918 22.6317C17.5248 22.7483 16.4225 22.7483 15.0549 22.7483H8.94513C7.57754 22.7483 6.47522 22.7483 5.60825 22.6317C4.70814 22.5107 3.95027 22.2518 3.34835 21.6499C2.74643 21.048 2.48754 20.2901 2.36652 19.39C2.24996 18.523 2.24998 17.4207 2.25 16.0531V9.94339C2.24998 8.5758 2.24996 7.47348 2.36652 6.60651C2.48754 5.7064 2.74643 4.94853 3.34835 4.34661C3.87328 3.82168 4.51835 3.55644 5.27635 3.41721C5.83977 3.31372 6.49963 3.27425 7.26279 3.25871ZM7.26476 4.75913C6.54668 4.77447 5.99332 4.81061 5.54735 4.89253C4.98054 4.99664 4.65246 5.16382 4.40901 5.40727C4.13225 5.68403 3.9518 6.07261 3.85315 6.80638C3.75159 7.56173 3.75 8.56285 3.75 9.99826V15.9983C3.75 17.4337 3.75159 18.4348 3.85315 19.1901C3.9518 19.9239 4.13225 20.3125 4.40901 20.5893C4.68577 20.866 5.07435 21.0465 5.80812 21.1451C6.56347 21.2467 7.56458 21.2483 9 21.2483H15C16.4354 21.2483 17.4365 21.2467 18.1919 21.1451C18.9257 21.0465 19.3142 20.866 19.591 20.5893C19.8678 20.3125 20.0482 19.9239 20.1469 19.1901C20.2484 18.4348 20.25 17.4337 20.25 15.9983V9.99826C20.25 8.56285 20.2484 7.56173 20.1469 6.80638C20.0482 6.07261 19.8678 5.68403 19.591 5.40727C19.3475 5.16382 19.0195 4.99664 18.4527 4.89253C18.0067 4.81061 17.4533 4.77447 16.7352 4.75913C16.6067 5.87972 15.655 6.75 14.5 6.75H9.5C8.345 6.75 7.39326 5.87972 7.26476 4.75913ZM9.5 2.75C9.08579 2.75 8.75 3.08579 8.75 3.5V4.5C8.75 4.91421 9.08579 5.25 9.5 5.25H14.5C14.9142 5.25 15.25 4.91421 15.25 4.5V3.5C15.25 3.08579 14.9142 2.75 14.5 2.75H9.5ZM8.96967 11.5303C8.67678 11.2375 8.67678 10.7626 8.96967 10.4697C9.26256 10.1768 9.73744 10.1768 10.0303 10.4697L12 12.4394L13.9697 10.4697C14.2626 10.1768 14.7374 10.1768 15.0303 10.4697C15.3232 10.7626 15.3232 11.2375 15.0303 11.5304L13.0607 13.5L15.0303 15.4697C15.3232 15.7626 15.3232 16.2374 15.0303 16.5303C14.7374 16.8232 14.2625 16.8232 13.9697 16.5303L12 14.5607L10.0304 16.5303C9.73746 16.8232 9.26259 16.8232 8.96969 16.5304C8.6768 16.2375 8.6768 15.7626 8.96969 15.4697L10.9394 13.5L8.96967 11.5303Z"
                      fill="#1C274C"
                    ></path>{" "}
                  </g>
                </svg>
                <h3 className="my-3 font-display font-medium  hover:text-sky-500">
                  Immutable Records
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-secondary-500">
                  Once recorded, votes cannot be altered or deleted, ensuring
                  the integrity of election results.
                </p>
              </li>
              <li className="rounded-xl bg-white px-6 py-8 shadow-sm">
                <svg
                  className="mx-auto h-10 w-10"
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.62436 4.4241C3.96537 5.18243 2.75 6.98614 2.75 9.13701C2.75 11.3344 3.64922 13.0281 4.93829 14.4797C6.00072 15.676 7.28684 16.6675 8.54113 17.6345C8.83904 17.8642 9.13515 18.0925 9.42605 18.3218C9.95208 18.7365 10.4213 19.1004 10.8736 19.3647C11.3261 19.6292 11.6904 19.7499 12 19.7499C12.3096 19.7499 12.6739 19.6292 13.1264 19.3647C13.5787 19.1004 14.0479 18.7365 14.574 18.3218C14.8649 18.0925 15.161 17.8642 15.4589 17.6345C16.7132 16.6675 17.9993 15.676 19.0617 14.4797C20.3508 13.0281 21.25 11.3344 21.25 9.13701C21.25 6.98614 20.0346 5.18243 18.3756 4.4241C16.7639 3.68739 14.5983 3.88249 12.5404 6.02065C12.399 6.16754 12.2039 6.25054 12 6.25054C11.7961 6.25054 11.601 6.16754 11.4596 6.02065C9.40166 3.88249 7.23607 3.68739 5.62436 4.4241ZM12 4.45873C9.68795 2.39015 7.09896 2.10078 5.00076 3.05987C2.78471 4.07283 1.25 6.42494 1.25 9.13701C1.25 11.8025 2.3605 13.836 3.81672 15.4757C4.98287 16.7888 6.41022 17.8879 7.67083 18.8585C7.95659 19.0785 8.23378 19.292 8.49742 19.4998C9.00965 19.9036 9.55954 20.3342 10.1168 20.6598C10.6739 20.9853 11.3096 21.2499 12 21.2499C12.6904 21.2499 13.3261 20.9853 13.8832 20.6598C14.4405 20.3342 14.9903 19.9036 15.5026 19.4998C15.7662 19.292 16.0434 19.0785 16.3292 18.8585C17.5898 17.8879 19.0171 16.7888 20.1833 15.4757C21.6395 13.836 22.75 11.8025 22.75 9.13701C22.75 6.42494 21.2153 4.07283 18.9992 3.05987C16.901 2.10078 14.3121 2.39015 12 4.45873Z"
                      fill="#1C274C"
                    ></path>{" "}
                  </g>
                </svg>
                <h3 className="my-3 font-display font-medium hover:text-sky-500">
                  Increased Voter Trust
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-secondary-500">
                  The transparency and security of blockchain technology
                  increase trust among voters in the electoral process.
                </p>
              </li>
              <li className="rounded-xl bg-white px-6 py-8 shadow-sm">
                <svg
                  className="mx-auto h-10 w-10"
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2.25 6C2.25 5.58579 2.58579 5.25 3 5.25H21C21.4142 5.25 21.75 5.58579 21.75 6C21.75 6.41421 21.4142 6.75 21 6.75H3C2.58579 6.75 2.25 6.41421 2.25 6ZM2.25 10C2.25 9.58579 2.58579 9.25 3 9.25H21C21.4142 9.25 21.75 9.58579 21.75 10C21.75 10.4142 21.4142 10.75 21 10.75H3C2.58579 10.75 2.25 10.4142 2.25 10ZM20.4613 12.9086C20.7879 13.1634 20.8461 13.6347 20.5914 13.9613L16.6914 18.9613C16.5522 19.1397 16.3399 19.2458 16.1136 19.2499C15.8873 19.254 15.6713 19.1557 15.5257 18.9824L13.4257 16.4824C13.1593 16.1652 13.2004 15.6921 13.5176 15.4257C13.8348 15.1593 14.3079 15.2004 14.5743 15.5176L16.0784 17.3082L19.4086 13.0387C19.6634 12.7121 20.1347 12.6539 20.4613 12.9086ZM2.25 14C2.25 13.5858 2.58579 13.25 3 13.25H10C10.4142 13.25 10.75 13.5858 10.75 14C10.75 14.4142 10.4142 14.75 10 14.75H3C2.58579 14.75 2.25 14.4142 2.25 14ZM2.25 18C2.25 17.5858 2.58579 17.25 3 17.25H10C10.4142 17.25 10.75 17.5858 10.75 18C10.75 18.4142 10.4142 18.75 10 18.75H3C2.58579 18.75 2.25 18.4142 2.25 18Z"
                      fill="#1C274C"
                    ></path>{" "}
                  </g>
                </svg>
                <h3 className="my-3 font-display font-medium  hover:text-sky-500">
                  Efficient Vote Counting
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-secondary-500">
                  Automated and instantaneous vote tallying reduces human error
                  and speeds up the election results.{" "}
                </p>
              </li>
              <li className="rounded-xl bg-white px-6 py-8 shadow-sm">
                <svg
                  className="mx-auto h-10 w-10"
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#000000"
                  stroke-width="0.00024000000000000003"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M18.0035 1.49982C18.2797 1.19118 18.7539 1.16491 19.0625 1.44116C21.3246 3.4658 22.75 6.41044 22.75 9.687C22.75 15.4384 18.3612 20.1647 12.75 20.6996V21.25H14C14.4142 21.25 14.75 21.5858 14.75 22C14.75 22.4142 14.4142 22.75 14 22.75H10C9.58579 22.75 9.25001 22.4142 9.25001 22C9.25001 21.5858 9.58579 21.25 10 21.25H11.25V20.7415C8.14923 20.621 5.37537 19.2236 3.44116 17.0625C3.16491 16.7539 3.19118 16.2797 3.49982 16.0035C3.80847 15.7272 4.28261 15.7535 4.55886 16.0622C6.31098 18.0198 8.85483 19.25 11.687 19.25C16.9685 19.25 21.25 14.9685 21.25 9.687C21.25 6.85483 20.0198 4.31098 18.0622 2.55886C17.7535 2.28261 17.7272 1.80847 18.0035 1.49982ZM7.2218 5.97099C6.30349 7.05894 5.75001 8.46484 5.75001 10C5.75001 13.4518 8.54823 16.25 12 16.25C12.0963 16.25 12.192 16.2478 12.2872 16.2435C12.2005 15.6345 12.2439 14.8905 12.6285 14.1657C13.1159 13.2472 14.1093 12.8691 14.7862 12.7027C15.1485 12.6137 15.4829 12.57 15.7251 12.5483C15.8471 12.5373 15.948 12.5317 16.0202 12.5289C16.0564 12.5274 16.0855 12.5267 16.1067 12.5263L16.1324 12.5259L16.1377 12.5259C16.8873 12.5181 17.3089 12.3432 17.5563 12.1648C17.8046 11.9857 17.9513 11.7499 18.0576 11.485C18.0669 11.4618 18.0772 11.4394 18.0885 11.4176C18.1942 10.9622 18.25 10.4876 18.25 10C18.25 8.31604 17.584 6.78762 16.5011 5.66377C16.3786 6.02084 16.2225 6.35649 16.0597 6.61271C15.8488 6.94459 15.4509 7.26677 15.143 7.49617C14.9312 7.65397 14.7121 7.78702 14.5199 7.90192C14.4965 7.91589 14.4736 7.92956 14.451 7.943C14.2793 8.04543 14.1309 8.13396 13.9881 8.23182C13.6814 8.44195 13.4566 8.65882 13.3044 8.98436C13.2636 9.07161 13.2596 9.15859 13.2878 9.26509C13.3463 9.48633 13.3867 9.73647 13.3873 9.99317C13.3901 11.1142 12.3502 11.7596 11.4915 11.7499C9.50666 11.7274 8.33638 10.0614 8.18391 8.30154C8.11154 7.46619 7.68135 6.6229 7.2218 5.97099ZM8.32838 4.94163C8.91808 5.73757 9.56822 6.90135 9.67831 8.17207C9.78839 9.44264 10.5469 10.2391 11.5085 10.25C11.6091 10.2511 11.7211 10.211 11.8005 10.1446C11.8744 10.0828 11.8874 10.03 11.8873 9.9969C11.887 9.89046 11.8696 9.76932 11.8377 9.64899C11.7401 9.28039 11.7249 8.82078 11.9456 8.34889C12.2508 7.69642 12.7046 7.29293 13.1403 6.99441C13.325 6.86785 13.5165 6.75371 13.6839 6.65396C13.7065 6.64051 13.7287 6.62731 13.7503 6.61439C13.9415 6.50008 14.1022 6.40111 14.2468 6.29334C14.5712 6.05161 14.7501 5.87677 14.7936 5.80831C14.9625 5.54254 15.1509 5.06019 15.2218 4.64333C14.281 4.07624 13.1786 3.75001 12 3.75001C10.628 3.75001 9.35921 4.19211 8.32838 4.94163ZM16.8186 13.9807C16.6101 14.0081 16.3885 14.0234 16.1533 14.0258L16.1455 14.0259L16.1347 14.026C16.1233 14.0263 16.1046 14.0267 16.0795 14.0277C16.0291 14.0297 15.9533 14.0338 15.8591 14.0423C15.6691 14.0593 15.4133 14.0932 15.1443 14.1594C14.5587 14.3033 14.1248 14.5459 13.9535 14.8688C13.7528 15.247 13.7256 15.6562 13.767 15.9967C14.9773 15.6407 16.035 14.9282 16.8186 13.9807ZM4.25001 10C4.25001 5.7198 7.7198 2.25001 12 2.25001C16.2802 2.25001 19.75 5.7198 19.75 10C19.75 14.2802 16.2802 17.75 12 17.75C7.7198 17.75 4.25001 14.2802 4.25001 10Z"
                      fill="#1C274C"
                    ></path>{" "}
                  </g>
                </svg>
                <h3 className="my-3 font-display font-medium  hover:text-sky-500">
                  Global Accessibility
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-secondary-500">
                  Blockchain technology allows for secure online voting, making
                  it easier for citizens worldwide to participate in elections.
                </p>
              </li>
            </ul>
          </div>
        </div>

        <section>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
              <div className="grid place-content-center rounded bg-gray-100 p-6 sm:p-8">
                <div className="mx-auto max-w-md text-center lg:text-left">
                  <header>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                      Recent Elections
                    </h2>

                    <p className="mt-4 text-gray-500">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Quas rerum quam amet provident nulla error!
                    </p>
                  </header>

                  <Link
                    to="/votings"
                    className="mt-8 inline-block rounded border border-sky-500 bg-sky-500 px-12 py-3 text-sm font-medium text-white transition hover:shadow focus:outline-none focus:ring"
                  >
                    Browse All
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-2 lg:py-8">
                <ul className="grid grid-cols-2 gap-4">
                  {lastTenVotings.map((voting) => (
                    <li key={voting.id}>
                      {userRegistered ? (
                        <Link
                          className="group block hover:shadow-xl duration-300 hover:scale-105 py-5"
                          to={`/votings/address/${voting.address}`}
                        >
                          {/* <a  className="group block hover:shadow-xl duration-300 hover:scale-105 py-5"> */}
                          <img
                            src={`https://ipfs.io/ipfs/${voting.img}`}
                            alt=""
                            className="aspect-square w-full rounded object-cover px-2 py-2"
                          />

                          <div className="mt-3 px-2">
                            <h3 className=" text-2xl  text-gray-900 group-hover:underline group-hover:underline-offset-4">
                              {voting.name}
                            </h3>

                            <p className="mt-1 text-lg text-gray-700">
                              From:{" "}
                              <span className="text-blue-600">
                                {new Date(voting.startDateTime).toLocaleString(
                                  "en-US"
                                )}
                              </span>
                            </p>
                            <p className="mt-1 text-lg text-gray-700">
                              {" "}
                              To:{" "}
                              <span className="text-pink-700">
                                {new Date(voting.endDateTime).toLocaleString(
                                  "en-US"
                                )}
                              </span>
                            </p>
                            <p className="mt-1 text-sm text-gray-700">
                              At: {voting.address}
                            </p>
                          </div>
                          {/* </a> */}
                        </Link>
                      ) : (
                        <Link
                          to="/register"
                          className="group block hover:shadow-xl duration-300 hover:scale-105 py-5"
                        >
                          <img
                            src={`https://ipfs.io/ipfs/${voting.img}`}
                            alt=""
                            className="aspect-square w-full rounded object-cover"
                          />

                          <div className="mt-3">
                            <h3 className=" text-2xl  text-gray-900 group-hover:underline group-hover:underline-offset-4">
                              {voting.name}
                            </h3>

                            <p className="mt-1 text-lg text-gray-700">
                              From:{" "}
                              <span className="text-blue-600">
                                {new Date(voting.startDateTime).toLocaleString(
                                  "en-US"
                                )}
                              </span>
                            </p>
                            <p className="mt-1 text-lg text-gray-700">
                              {" "}
                              To:{" "}
                              <span className="text-pink-700">
                                {new Date(voting.endDateTime).toLocaleString(
                                  "en-US"
                                )}
                              </span>
                            </p>
                            <p className="mt-1 text-sm text-gray-700">
                              At: {voting.address}
                            </p>
                          </div>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        <div>
          <Usage />
        </div>

        {/* <div className={styles.userStatus}>
        <h3>User status: {userRegistered ? "True" : "False"}</h3>

        
      </div> */}
      </div>
      <Footer />
    </div>
  );
};

export async function getData(): Promise<IVoting[]> {
  const res = await fetch(`${API_URL}/api/votings`);
  const data = await res.json();
  return data;
}
