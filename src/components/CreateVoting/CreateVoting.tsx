import { useState, useEffect } from "react";
import styles from "./index.module.css";
import VotingManager from "../../artifacts/contracts/VotingManager.sol/VotingManager.json";
import { ethers } from "ethers";
import VotingManagerAddress from "../../../constants/VotingManagerAddress.json";
import { useMetaMask } from "../../hooks/useMetaMask";
import { IVoting } from "../../modules/Voting.module";

import { Button, DatePicker, Space } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Navigation } from "../Navigation/Navigation";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Footer } from "../Footer";
import { formatAddress, formatChainAsNum } from "../../utils";
import { Link } from "react-router-dom";


type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const API_URL=import.meta.env.VITE_API_URL;

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().startOf("day");
};

export const CreateVoting: React.FC = () => {
  const { wallet } = useMetaMask();
  var [votings, setVotings] = useState<IVoting[]>([]);
  const [votingName, setVotingName] = useState<string>("");
  var [votingAddress, setVotingAddress] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");
  var [startDateTime, setStartDateTime] = useState<string>("");
  var [endDateTime, setEndDateTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile]: any = useState();
  var [votingImg, setVotingImg] = useState<string>();
  const [fileName, setFileName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [status, setStatus] = useState("");

  

  const handleSearchTerm = (event: any) => setSearchTerm(event.target.value);
  const handleSearchType = (event: any) => setSearchType(event.target.value);
  const handleStatusChange = (event: any) => setStatus(event.target.value);

  const filteredVotings = votings.filter((voting) => {
    const matchesTerm =
      searchType === "name"
        ? voting.name.toLowerCase().includes(searchTerm.toLowerCase())
        : voting.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      status === "" ||
      (status === "active" && voting.votingActive) ||
      (status === "inactive" && !voting.votingActive);

    return matchesTerm && matchesStatus;
  });

  const handleImgSubmission = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      console.log(resData);
      votingImg = resData["IpfsHash"];
      console.log("candidate img:", votingImg);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTimeRangeChange = (value: any) => {
    setStartDateTime(value[0].$d);
    setEndDateTime(value[1].$d);

    console.log("Selected time range:", value[0].$d);
  };

  const SetCurrentChainId = () => {
    setChainId(VotingManagerAddress["chainId"]);
  };

  useEffect(() => {
    console.log("api", API_URL)
    fetchData();
    SetCurrentChainId();
  }, []);

  //   const now = new Date().getTime();
  //   const selectedStartTime = new Date(startDateTime).getTime();
  //   const selectedEndTime = new Date(endDateTime).getTime();

  //   if (selectedStartTime < now || selectedEndTime < now) {
  //     // If either the start time or end time is in the past, display an error message
  //     alert("Please select a future start and end time.");
  //   }

  //   if (selectedEndTime <= selectedStartTime) {
  //     // If the end time is before or equal to the start time, display an error message
  //     alert("End time must be after the start time.");
  //   }

  //   if (!selectedEndTime || !selectedStartTime) {
  //     alert("Please fill in the time required!");
  //   }
  //   setConditionCheck(true);
  // };
  const fetchData = async () => {
    try {
      const data = await getData();
      setVotings(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVotingName(event.target.value);
  };
  const fileChangeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
    if (event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  const CreateVotingInstance = async (e: any) => {
    e.preventDefault();
    // await ElectionTime();
    if (!startDateTime || !endDateTime) {
      toast.warning("Please fill out the dates! ", {
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
    } else if (!selectedFile) {
      toast.warning("Please add an image! ", {
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
    } else {
      setIsLoading(true);
      handleImgSubmission();
      const votingManagerAddress = VotingManagerAddress["address"];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      try {
        const contract = new ethers.Contract(
          votingManagerAddress,
          VotingManager.abi,
          signer
        );
        
        const tx = await contract.createVoting(votingName);
        await tx.wait(1);
        const votingInstance = await contract.getLatestVoting();
        console.log("Initial value:", votingAddress);
        setVotingAddress(votingInstance);
        votingAddress = votingInstance;
        console.log("created voting instance at:", votingInstance);
        console.log("Successfully added: ", votingAddress);
        
        setIsLoading(false);
        await addVoting();
      toast.success("Created Successfully! ", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setVotingName("");
      setStartDateTime("");
      setEndDateTime("");
      setSelectedFile(null);
        
      } catch (error: any) {
        setIsLoading(false);
       console.error("This election name has existed!")
        toast.error("This election name has already existe! ", {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
      
    }
  };

  const addVoting = async () => {
    console.log("wallet aacount", wallet.accounts[0]);
    const creator = wallet.accounts[0];
    fetch(`${API_URL}/api/votings`, {
      method: "POST",
      body: JSON.stringify({
        address: votingAddress,
        name: votingName,
        status: 0,
        votingActive: true,
        creator: creator,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        img: votingImg,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetchData();
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <ToastContainer limit={1} />
      <div className="mt-20">
        <div
          className="bg-cover bg-center h-60"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1542349314-e669385af82f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
          }}
        >
          <div className="bg-black bg-opacity-20 h-full flex items-center justify-center">
            <h1 className="text-white text-4xl font-bold">
              Create New Voting Event
            </h1>
          </div>
        </div>
        <form onSubmit={CreateVotingInstance}>
          <div className="container mx-auto p-8">
            <div className="bg-white rounded-lg shadow-lg p-20 mx-20">
              <h2 className="text-2xl font-bold mb-4">Voting Information</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Voting Name
                </label>
                <input
                  type="text"
                  value={votingName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter voting name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Voting Period
                </label>
                <Space direction="vertical" size={12} className="w-full">
                  <RangePicker
                    className="w-full"
                    disabledDate={disabledDate}
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [
                        dayjs("00:00:00", "HH:mm:ss"),
                        dayjs("11:59:59", "HH:mm:ss"),
                      ],
                    }}
                    format="DD-MM-YYYY HH:mm:ss"
                    onChange={handleTimeRangeChange}
                  />
                </Space>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Election Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG (SQUARE IMAGE EX. 800x800px)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={fileChangeHandler}
                    />
                  </label>
                </div>
                {fileName && (
                  <p className="mt-2 text-base text-green-600">
                    Selected file: {fileName}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {isLoading ? "Loading..." : "Create Voting Instance"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {votings.length > 0 && (
        <>
          <div className="container mx-auto px-4 mt-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <select
                  value={searchType}
                  onChange={handleSearchType}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="name">Search by Name</option>
                  <option value="address">Search by Address</option>
                </select>
                <input
                  type="text"
                  placeholder={`Search by ${searchType}`}
                  value={searchTerm}
                  onChange={handleSearchTerm}
                  className="p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={status}
                  onChange={handleStatusChange}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto px-5">
            <div className="min-w-full overflow-hidden rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Index
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Election Address
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Creator
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Active
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVotings.map((voting, index) => (
                    <tr key={index} className="bg-white">
                      <td className="px-3 py-2 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Link  to={`/votings/address/${voting.address}`}>
                          {voting.name}
                        </Link>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Link to={`/votings/address/${voting.address}`}>
                          {voting.address}
                        </Link>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <a
                          href={`https://amoy.polygonscan.com/address/${voting.creator}`}
                        >
                          {formatAddress(voting.creator)}
                        </a>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <a href={`https://ipfs.io/ipfs/${voting.img}`}>
                          {voting.img}
                        </a>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-left">
                        {voting.votingActive ? (
                          <span className="inline-block bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                            Active
                          </span>
                        ) : (
                          <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export async function getData(): Promise<IVoting[]> {
  const res = await fetch(`${API_URL}/api/votings`);
  const data = await res.json();
  return data;
}
