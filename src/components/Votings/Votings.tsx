import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IVoting } from '../../modules/Voting.module';
import { Navigation } from '../Navigation';
import { formatAddress } from '../../utils';
import { useUser } from '../../hooks/userContext';
import { Footer } from '../Footer';

const API_URL=import.meta.env.VITE_API_URL;

export const Votings:React.FC = () => {
  const [votings, setVotings] = useState<IVoting[]>([]);
  var { userRegistered } = useUser(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('all');

  const handleSearchTerm = (event:any) => setSearchTerm(event.target.value);
  const handleSearchType = (event:any) => setSearchType(event.target.value);
  const handleStartDate = (event:any) => setStartDate(event.target.value);
  const handleEndDate = (event:any) => setEndDate(event.target.value);
  const handleStatusChange = (event:any) => setStatus(event.target.value);

  const filteredVotings = votings.filter((voting) => {
    const votingStart = new Date(voting.startDateTime).getTime();
    const votingEnd = new Date(voting.endDateTime).getTime();
    const now = new Date().getTime();

    let statusMatch = false;
    if (status === 'active') {
      statusMatch = now >= votingStart && now <= votingEnd;
    } else if (status === 'inactive') {
      statusMatch = now < votingStart || now > votingEnd;
    } else {
      statusMatch = true;
    }

    return (
      statusMatch &&
      (searchType === 'name'
        ? voting.name.toLowerCase().includes(searchTerm.toLowerCase())
        : voting.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!startDate || new Date(voting.startDateTime) >= new Date(startDate)) &&
      (!endDate || new Date(voting.endDateTime) <= new Date(endDate))
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setVotings(data); // Fetching the last two votings
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    // <div>
    //   <Navigation/>
    //   <div className="min-h-screen bg-gradient-to-br mt-20 pt-20">
    //   <div className="container mx-auto px-4">
    //     <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-black mb-8">
    //       Browse Votings
    //     </h1>
    //     <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    //       {votings.map((voting) =>
    //         voting.votingActive ? (
    //           <li key={voting.id} className="list-none">
    //             {userRegistered ? (
    //               <Link
    //                 className="group block hover:shadow-xl duration-300 hover:scale-105 py-5"
    //                 to={`/votings/address/${voting.address}`}
    //               >
    //                 <img
    //                   src={`https://ipfs.io/ipfs/${voting.img}`}
    //                   alt={voting.name}
    //                   className="aspect-square w-full rounded object-cover px-2 py-2"
    //                 />
    //                 <div className="mt-3 px-2">
    //                   <h3 className="text-2xl text-gray-900 group-hover:underline group-hover:underline-offset-4">
    //                     {voting.name}
    //                   </h3>
    //                   <p className="mt-1 text-lg text-gray-700">
    //                     From:{' '}
    //                     <span className="text-blue-600">
    //                       {new Date(voting.startDateTime).toLocaleString('en-US')}
    //                     </span>
    //                   </p>
    //                   <p className="mt-1 text-lg text-gray-700">
    //                     To:{' '}
    //                     <span className="text-pink-700">
    //                       {new Date(voting.endDateTime).toLocaleString('en-US')}
    //                     </span>
    //                   </p>
    //                   <p className="mt-1 text-sm text-gray-700">
    //                     At: {formatAddress(voting.address)}
    //                   </p>
    //                 </div>
    //               </Link>
    //             ) : (
    //               <Link
    //                 to="/register"
    //                 className="group block hover:shadow-xl duration-300 hover:scale-105 py-5"
    //               >
    //                 <img
    //                   src={`https://ipfs.io/ipfs/${voting.img}`}
    //                   alt={voting.name}
    //                   className="aspect-square w-full rounded object-cover"
    //                 />
    //                 <div className="mt-3">
    //                   <h3 className="text-2xl text-gray-900 group-hover:underline group-hover:underline-offset-4">
    //                     {voting.name}
    //                   </h3>
    //                   <p className="mt-1 text-lg text-gray-700">
    //                     From:{' '}
    //                     <span className="text-blue-600">
    //                       {new Date(voting.startDateTime).toLocaleString('en-US')}
    //                     </span>
    //                   </p>
    //                   <p className="mt-1 text-lg text-gray-700">
    //                     To:{' '}
    //                     <span className="text-pink-700">
    //                       {new Date(voting.endDateTime).toLocaleString('en-US')}
    //                     </span>
    //                   </p>
    //                   <p className="mt-1 text-sm text-gray-700">
    //                     At: {voting.address}
    //                   </p>
    //                 </div>
    //               </Link>
    //             )}
    //           </li>
    //         ) : null
    //       )}
    //     </ul>
    //   </div>
    // </div>
    // </div>
    <>
    <div className="min-h-screen bg-gradient-to-br mt-20 pt-20">
      <Navigation />
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl mb-10 pb-5 font-extrabold text-center text-transparent bg-clip-text bg-sky-500 md:mb-0">
            Browse Elections
          </h1>
          <div className="flex flex-col md:flex-row items-center gap-4">
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
            <input
              type="date"
              value={startDate}
              onChange={handleStartDate}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={handleEndDate}
              className="p-2 border border-gray-300 rounded"
            />
            <select
              value={status}
              onChange={handleStatusChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="all">Status: All</option>
              <option value="active" className='bg-green-400 my-4'>Active</option>
              <option value="inactive" className='bg-red-300 my-4'>Inactive</option>
            </select>
          </div>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredVotings.map((voting) => (
            <li key={voting.id} className="list-none">
              {userRegistered ? (
                <Link
                  className="group block hover:shadow-xl duration-300 hover:scale-105 py-5"
                  to={`/votings/address/${voting.address}`}
                >
                  <img
                    src={`https://ipfs.io/ipfs/${voting.img}`}
                    alt={voting.name}
                    className="aspect-square w-full rounded object-cover px-2 py-2"
                  />
                  <div className="mt-3 px-2">
                    <h3 className="text-2xl text-gray-900 group-hover:underline group-hover:underline-offset-4">
                      {voting.name}
                    </h3>
                    <p className="mt-1 text-lg text-gray-700">
                      From:{' '}
                      <span className="text-blue-600">
                        {new Date(voting.startDateTime).toLocaleString('en-US')}
                      </span>
                    </p>
                    <p className="mt-1 text-lg text-gray-700">
                      To:{' '}
                      <span className="text-pink-700">
                        {new Date(voting.endDateTime).toLocaleString('en-US')}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      At: {formatAddress(voting.address)}
                    </p>
                  </div>
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="group block hover:shadow-xl duration-300 hover:scale-105 py-5"
                >
                  <img
                    src={`https://ipfs.io/ipfs/${voting.img}`}
                    alt={voting.name}
                    className="aspect-square w-full rounded object-cover"
                  />
                  <div className="mt-3">
                    <h3 className="text-2xl text-gray-900 group-hover:underline group-hover:underline-offset-4">
                      {voting.name}
                    </h3>
                    <p className="mt-1 text-lg text-gray-700">
                      From:{' '}
                      <span className="text-blue-600">
                        {new Date(voting.startDateTime).toLocaleString('en-US')}
                      </span>
                    </p>
                    <p className="mt-1 text-lg text-gray-700">
                      To:{' '}
                      <span className="text-pink-700">
                        {new Date(voting.endDateTime).toLocaleString('en-US')}
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
    <Footer/>
    </>
);
};

 
export async function getData(): Promise<IVoting[]> {
  const res = await fetch(`${API_URL}/api/votings`);
  const data = await res.json();
  return data;
}