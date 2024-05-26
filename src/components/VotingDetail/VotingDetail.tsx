import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IVoting } from "../../modules/Voting.module";
import Voting from "../../artifacts/contracts/VotingManager.sol/Voting.json";
import { ethers } from "ethers";
import { ICandidate } from "../../modules/Candidate.module";
import { IntegerType } from "mongodb/src";
import { useMetaMask } from "../../hooks/useMetaMask";
import { Navigation } from "../Navigation";
import { ErrorPage } from "../ErrorPage";

import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "antd";
import { Footer } from "../Footer";
import { formatAddress } from "../../utils";

interface SearchCandidate {
  name: string;
  dob: string;
  walletAddress: string;
}
const API_URL=import.meta.env.VITE_API_URL;
export const VotingDetail: React.FC = () => {
  const { wallet } = useMetaMask();

  const [selectedFile, setSelectedFile]: any = useState();
  const { address } = useParams();
  const [voting, setVoting] = useState<IVoting | null>(null);
  const [error, setError] = useState<string | null>(null);
  var [candidateList, setCandidateList] = useState<ICandidate[]>([]);
  const [candidateName, setCandidateName] = useState<string>(""); //have to initailize the variable first
  var [candidateImg, setCandidateImg] = useState<string>("");

  const [winner, setWinner] = useState<ICandidate | null>(null);
  const [winners, setWinners] = useState<ICandidate[]>([]);

  var [searchedCandidate, setSearchedCandidate] =
    useState<SearchCandidate | null>(null);
  const [searchError, setSearchError] = useState("");

  const [timeRemaining, setTimeRemaining] = useState("");
  const [countdownExpired, setCountdownExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addCandidateLoading, setAddCandidateLoading] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [votingAvailable, setVotingAvailable] = useState(false);
  const [votingEnd, setVotingEnd] = useState<boolean>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCandidates, setFilteredCandidates] = useState(candidateList);
  

  useEffect(() => {
    setFilteredCandidates(
      candidateList.filter((candidate) =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, candidateList]);

  useEffect(() => {
    calculateTimeRemaining();
    resetSearch();
   

    console.log("remaining: ", timeRemaining);
  }, [wallet, voting, address, countdownExpired]);

  useEffect(() => {
    calculateTimeRemaining();
    
  }, []);

  useEffect(() => {
    fetchCandidatesFromContract();
  }, [voting]);

  useEffect(() => {
    getVotingAddress();
  }, [address]);

  const resetSearch = async () => {
    setSearchedCandidate(null);
    setUserAddress("");
  };

  const handleSearch = async () => {
    if(!userAddress){
      toast.error("Please provide a wallet address! ", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    else {
      try {
      
        var searchAddress = userAddress.toLowerCase();
        const response = await fetch(
          `${API_URL}/api/users/votings/users-address/${searchAddress}`
        );
        if (!response.ok) {
          setSearchError("Candidate not found");
          toast.error("Not found! ", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
  
          setSearchedCandidate(null); // Clear the previous candidate data
          return;
        }
        const data = await response.json();
        setSearchedCandidate(data);
        setSearchError(""); // Reset searchError state in case it was previously set
      } catch (error) {
        console.error("Error searching candidate:", error);
        setSearchError("Error searching candidate. Please try again later."); // Set custom error message
        setSearchedCandidate(null); // Clear the previous candidate data
      }
    }
    
  };
  async function calculateTimeRemaining() {
    if (!voting) return;

    var startTime = voting.startDateTime
      ? new Date(voting.startDateTime).getTime()
      : 0;
    var endTime = voting.endDateTime
      ? new Date(voting.endDateTime).getTime()
      : 0;

    var interval = setInterval(async () => {
      var now = new Date().getTime();

      if (now < startTime) {
        // Display "Time to start" if the current time is before the start time
        var distanceToStart = startTime - now;
        var days = Math.floor(distanceToStart / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distanceToStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor(
          (distanceToStart % (1000 * 60 * 60)) / (1000 * 60)
        );
        var seconds = Math.floor((distanceToStart % (1000 * 60)) / 1000);
        setTimeRemaining(
          `Time to start: ${days}d ${hours}h ${minutes}m ${seconds}s`
        );
      } else if (now >= startTime && now <= endTime) {
        // Display remaining time if the current time is between the start and end times
        var distanceToEnd = endTime - now;
        var days = Math.floor(distanceToEnd / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distanceToEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor(
          (distanceToEnd % (1000 * 60 * 60)) / (1000 * 60)
        );
        var seconds = Math.floor((distanceToEnd % (1000 * 60)) / 1000);
         setTimeRemaining(
          `Time remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`
        );
        setVotingAvailable(true);
      } else {
        // Display "Countdown expired" if the current time is after the end time
        clearInterval(interval);
        setTimeRemaining("This election has expired!");
        setCountdownExpired(true);
        setVotingAvailable(false);
        endVoting();
        updateVoting();
        getWinningCandidate();
      }
    }, 1000);

    // Clear the interval when component unmounts
    return () => clearInterval(interval);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserAddress(event.target.value);
  };

  const getVotingAddress = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/votings/address/${address}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch voting");
      }
      const data = await response.json();
      setVoting(data);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.message);
    }
  };
  const addOneCandidate = async () => {
    console.log("wallet aacount", wallet.accounts[0]);

    const votingAddress = address;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    if (!votingAddress) {
      throw new Error("Address is undefined");
    }

    try {
      if (!searchedCandidate?.name && !searchedCandidate?.walletAddress) {
        toast.error("Please add a candidate by searching wallet address!", {
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
      }
      const contract = new ethers.Contract(votingAddress, Voting.abi, signer);
      const result = await contract.addCandidate(
        searchedCandidate?.name,
        candidateImg,
        searchedCandidate?.walletAddress
      );
      await result.wait(1);
      console.log(
        `Add a new condidate with name: ${searchedCandidate?.name} successfully`
      );
      await fetchCandidatesFromContract();
      setTimeout(() => {
        setAddCandidateLoading(false);
      }, 5000);
      toast.success("Candidate added successfully!", {
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

      resetSearch();
      setSelectedFile(null);
    } catch (error: any) {
      setTimeout(() => {
        setAddCandidateLoading(false);
      }, 5000);
      toast.error("Candidate already exists!", {
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
    }
  };

  async function fetchCandidatesFromContract() {
    const votingAddress = address;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    if (!votingAddress) {
      throw new Error("Address is undefined");
    }
    try {
      const contract = new ethers.Contract(votingAddress, Voting.abi, signer);
      // Call the Solidity function that returns an array of structs
      const candidates: ICandidate[] = await contract.getAllCandidate();

      // Process each candidate struct
      const candidatesData: ICandidate[] = candidates.map(
        (candidate: ICandidate, index: number) => ({
          id: index,
          name: candidate.name,
          userAddress: candidate.userAddress,
          voteCount: Number(candidate.voteCount), // Convert BigInt to number
          img: candidate.img,
        })
      );

      await setCandidateList(candidatesData);
      await console.log("Candidates List", candidateList);

      // Optionally, you can further process or use the data here
    } catch (error) {
      console.error("Error fetching candidates from contract:", error);
    }
  }

  const voteForCandidate = async (candidateId: IntegerType) => {
    setIsLoading(true);
    console.log("Current candidate id: ", candidateId);
    const votingAddress = address;
    console.log("Voting address", votingAddress);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    if (!votingAddress) {
      throw new Error("Address is undefined");
    }
    console.log("voting abi:", Voting["abi"]);
    try {
      const contract = new ethers.Contract(
        votingAddress,
        Voting["abi"],
        signer
      );
      const tx: any = await contract.voteFor(candidateId);
      console.log("Waiting for confirmations....");
      await tx.wait();
      console.log("Transaction has successfully finished!");
      await fetchCandidatesFromContract();
      toast.success("You have voted successfully! ", {
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
        setIsLoading(false);
      }, 4000);
    } catch (error: any) {
      toast.error("You have adready voted! ", {
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
        setIsLoading(false);
      }, 4000);
    }
  };

  const changeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async () => {
    if (!searchedCandidate?.name && !searchedCandidate?.walletAddress) {
      toast.error("Please add a candidate by searching wallet address!", {
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
      throw new Error("Please add a candidate by searching wallet address!");
    }
    try {
      setAddCandidateLoading(true);
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
      candidateImg = resData["IpfsHash"];
      console.log("candidate img:", candidateImg);
      addOneCandidate();
    } catch (error) {
      console.log(error);
      setAddCandidateLoading(false);
    }
  };
  const endVoting = async () => {
    if (countdownExpired && !votingEnd) {
      const votingAddress = address;
      console.log("Voting address", votingAddress);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (!votingAddress) {
        throw new Error("Address is undefined");
      }
      console.log("voting abi:", Voting["abi"]);
      try {
        const contract = new ethers.Contract(
          votingAddress,
          Voting["abi"],
          signer
        );
        console.log("Voting Expired!");

        const votingStatus1 = await contract.getVotingStatus();
        console.log("Current status: ", votingStatus1);
        if (votingStatus1) {
          const tx = await contract.endVoting();
          await tx.wait(1);
          const votingStatus = await contract.getVotingStatus();
          console.log("After end status", votingStatus);
          setVotingEnd(true);
        }
      } catch (error: any) {
        throw new Error("Contract status error");
      }

      // if (countdownExpired) {

      // }

      // const votingStatus1 = await contract.getVotingStatus();
      //   console.log("Current status: ", votingStatus1);
      //   const tx = await contract.endVoting();
      //   await tx.wait(1);
      //   const votingStatus = await contract.getVotingStatus();
      //   console.log("After end status", votingStatus);
    }
  };
  const getWinningCandidate1 = async () => {
    if (countdownExpired) {
      const votingAddress = address;
      console.log("Voting address", votingAddress);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (!votingAddress) {
        throw new Error("Address is undefined");
      }

      try {
        const contract = new ethers.Contract(votingAddress, Voting.abi, signer);

        const winningCandidate = await contract.getWinningCandidate();
        setWinner(winningCandidate);
      } catch (e: any) {}
    }

    // const votingAddress = address;

    //   const provider = new ethers.BrowserProvider(window.ethereum);
    //   const signer = await provider.getSigner();

    //   if (!votingAddress) {
    //     throw new Error("Address is undefined");
    //   }

    //   try {
    //     const contract = new ethers.Contract(votingAddress, Voting.abi, signer);

    //     const winningCandidate = await contract.getWinningCandidate();
    //     console.log("Winner: ", winningCandidate)
    //     setWinner(winningCandidate)
    //   } catch (e: any) {
    //     console.log("Winner error: ", e)
    //   }
  };

  const getWinningCandidate = async () => {
    if(countdownExpired){
      const votingAddress = address;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    if (!votingAddress) {
      throw new Error("Address is undefined");
    }
    try {
      const contract = new ethers.Contract(votingAddress, Voting.abi, signer);
      const winnerIds = await contract.getWinningCandidates();

      if (winnerIds.length > 1) {
        // Process each candidate struct
        const candidatesData: ICandidate[] = winnerIds.map(
          (candidate: ICandidate, index: number) => ({
            id: index,
            name: candidate.name,
            userAddress: candidate.userAddress,
            voteCount: Number(candidate.voteCount), // Convert BigInt to number
            img: candidate.img,
          })
        );

        setWinners(candidatesData);
      } else {
        const candidatesData: ICandidate[] = winnerIds.map(
          (candidate: ICandidate, index: number) => ({
            id: index,
            name: candidate.name,
            userAddress: candidate.userAddress,
            voteCount: Number(candidate.voteCount), // Convert BigInt to number
            img: candidate.img,
          })
        );

        setWinners(candidatesData);
      }
    } catch (error) {
      console.error("Error fetching winning candidates:", error);
    }
    }
  };
  const updateVoting = async () => {
    await fetch(`${API_URL}/api/votings/address/${address}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        votingActive: false,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log("Voting active: false");
      });
  };

  return (
    <div>
      {error ? (
        <ErrorPage />
      ) : voting ? (
        <div className="min-h-screen">
          <Navigation />
          <ToastContainer limit={2} />

          <div className="mt-20 px-8">
            <div
              className="bg-cover bg-center h-60"
              style={{
                backgroundImage: `url(https://ipfs.io/ipfs/${voting.img})`,
              }}
            >
              
            </div>
            <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 mt-8">
            
            
            <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 mt-8 mx-4 md:mx-20 lg:mx-40">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">{voting.name}</h2>
                {countdownExpired?(
                  <h3 className="text-2xl font-semibold text-red-600">{timeRemaining}</h3>
                ):(
                  <h3 className="text-2xl font-semibold text-green-600">{timeRemaining}</h3>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  
                  <p className="text-xl text-gray-700 mb-2">
                    <strong className="text-gray-900">Address:</strong> <a className="text-sky-600" href={`https://amoy.polygonscan.com/address/${voting.address}`}>{formatAddress(voting.address)}</a>
                  </p>
                  <p className="text-xl text-gray-700 mb-2">
                    <strong className="text-gray-900">Creator:</strong> <a className="text-yellow-600" href={`https://amoy.polygonscan.com/address/${voting.creator}`}>{formatAddress(voting.creator)}</a>
                  </p>
                </div>
                <div>
                  <p className="text-xl text-gray-700 mb-2">
                    <strong className="text-gray-900">Start time:</strong>{' '}
                    {new Date(voting.startDateTime).toLocaleString('en-US')}
                  </p>
                  <p className="text-xl text-gray-700 mb-2">
                    <strong className="text-gray-900">End time:</strong>{' '}
                    {new Date(voting.endDateTime).toLocaleString('en-US')}
                  </p>
                </div>
              </div>
            </div>

              {countdownExpired ? (
                <div>
                  {winners.length > 0 && (
                <div className="flex flex-col items-center justify-center min-h-screen ">
                  <div className="winner-card-container rounded-xl bg-white">
                    <div className="bg-white rounded-3xl p-12 relative overflow-hidden shadow-full confetti-container">
                      {/* Confetti Effect */}
                      <div className="confetti">
                        {Array.from({ length: 50 }).map((_, index) => (
                          <div key={index} className="confetti-piece"></div>
                        ))} 
                      </div>

                      <h2 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-yellow-400 mb-4">
                        {winners.length > 1
                          ? "It's a tie!"
                          : "Congratulations!"}
                      </h2>

                      {/* Winners List */}
                      <div className="flex flex-wrap justify-center">
                        {winners.map((winner, index) => (
                          <div
                            key={index}
                            className="winner-card flex flex-col items-center justify-center text-center mb-8 mx-4 p-4 bg-white rounded-lg shadow-lg"
                            style={{ maxWidth: "300px" }}
                          >
                            <img
                              src={`https://ipfs.io/ipfs/${winner.img}`}
                              alt="Winner"
                              className="w-64 h-64 rounded-full mx-auto border-4 border-white shadow-lg object-cover mb-4"
                            />
                            <p className="text-2xl text-yellow-500 font-semibold">
                              {winner.name}
                            </p>
                            <p className="text-2xl text-sky-700 font-semibold">
                              Total Votes: {winner.voteCount}
                            </p>
                            <a
                              href={`https://amoy.polygonscan.com/address/${winner.userAddress}`}
                              className="hover:text-white"
                            >
                              <p className="text-base text-sky-900 font-semibold">
                                At address: {formatAddress(winner.userAddress)}
                              </p>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
                </div>
              ):null}

              {votingAvailable && voting.creator === wallet.accounts[0] && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Add a new candidate
                  </h2>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Candidate Image
                    </label>
                    <input
                      type="file"
                      onChange={changeHandler}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Check Candidate by Wallet Address
                    </h2>
                    <div className="mb-4 flex items-center">
                      <input
                        type="text"
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                        placeholder="Enter user address"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      />
                      <button
                        onClick={handleSearch}
                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                      >
                        Check
                      </button>
                    </div>

                    {searchedCandidate && (
                      <div className="p-4 border rounded-lg shadow-md bg-white mt-4">
                        <div className="mb-4">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            value={searchedCandidate.name}
                            className="mt-1 block w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none"
                            disabled
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="dob"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Date of Birth
                          </label>
                          <input
                            id="dob"
                            type="text"
                            value={new Date(
                              searchedCandidate.dob
                            ).toLocaleDateString("en-US")}
                            className="mt-1 block w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none"
                            disabled
                          />
                        </div>
                        <p className="text-sm text-gray-700">
                          Address: {searchedCandidate.walletAddress}
                        </p>
                      </div>
                    )}
                  </div>
                  {votingAvailable && (
                    <Button
                      onClick={handleSubmission}
                      loading={addCandidateLoading}
                      className="px-4 my-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                    >
                      {addCandidateLoading ? "Loading..." : "Add new Candidate"}
                    </Button>
                  )}

                 
                </div>
              )}

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Candidates List</h2>
                <div className="mb-4 flex items-center">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for candidate name"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="flex flex-col items-center w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
                    >
                      <div>
                        <img
                          src={`https://ipfs.io/ipfs/${candidate.img}`}
                          alt="Product"
                          className="h-80 w-72 object-cover rounded-t-xl"
                        />
                        <div className="px-4 py-3 w-full text-center">
                          <p className="text-lg font-bold text-black truncate block capitalize">
                            {candidate.name}
                          </p>
                          <div className="flex justify-center items-center mt-2">
                            <p className="text-lg font-semibold text-black">
                              Total Votes: {candidate.voteCount}
                            </p>
                          </div>

                          <a
                            href={`https://amoy.polygonscan.com/address/${candidate.userAddress}`}
                          >
                            <p className="text-sm font-semibold text-slate-500 hover:text-sky-600">
                              At address: {formatAddress(candidate.userAddress)}
                            </p>
                          </a>
                          {votingAvailable ? (
                            <Button
                              type="primary"
                              onClick={() => voteForCandidate(candidate.id)}
                              loading={isLoading}
                              className="bg-sky-500 text-base rounded-full my-3 hover:bg-blue-800 text-white font-bold px-4  focus:outline-none focus:shadow-outline"
                            >
                              {isLoading
                                ? "Loading..."
                                : "Vote for this Candidate"}
                            </Button>
                          ) : (
                            <Button
                              disabled
                              className="bg-gray-300 text-base rounded-full my-3 text-white font-bold px-4 focus:outline-none focus:shadow-outline"
                            >
                              Unavailable to Vote
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};
export async function getData(
  userAddress: string
): Promise<SearchCandidate | null> { 
  try {
    const lowerCaseAddress = userAddress.toLowerCase();
    const res = await fetch(
      `${API_URL}/api/users/votings/users-address/${lowerCaseAddress}`
    );

    if (!res.ok) {
      throw new Error("Candidate not found");
    }

    const data = await res.json();
    console.log("User at: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching candidate:", error);
    throw new Error("Candidate not found");
  }
}
