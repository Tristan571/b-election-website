import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useMetaMask } from './useMetaMask';
import { IUser } from "../modules/User.module";
import { ConsoleLogger } from 'hardhat/internal/hardhat-network/stack-traces/consoleLogger';

interface UserContextType {
  userRegistered: boolean;
  setUserRegistered: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType>({
  userRegistered: false,
  setUserRegistered: () => {}
});
const API_URL=import.meta.env.VITE_API_URL;
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  var [userRegistered, setUserRegistered] = useState(false);
  var { wallet, isConnecting } = useMetaMask();
  var [user, setUser] = useState<IUser | null>(null);

  async function getData(): Promise<IUser> {
    // try {
    //     var currentUserAddress = wallet.accounts[0]
    //   var res = await fetch(`http://localhost:5000/api/users/address/${currentUserAddress}`);
    //   if (res.ok) {
    //     var data = await res.json();
    //     return data;
    //   } else {
    //     return null;
    //   }
    // } catch (error) {
    //   console.error('Error fetching user data:', error);
    //   return null;
    // }
    var currentUserAddress = wallet.accounts[0]
        var response = await fetch(
          `${API_URL}/api/users/address/${currentUserAddress}`);
          var data = await response.json();
          return data;
    // try {
    //     var currentUserAddress = wallet.accounts[0]
    //     var response = await fetch(
    //       `http://localhost:5000/api/users/address/${currentUserAddress}`
    //     );
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch voting");
    //     }
    //     const data = await response.json();
    //     return data;
    //   } catch (error: any) {
    //     console.error("Error fetching data:", error);
        
    //   }
  }

  useEffect(() => {
    

    fetchUserData();
    // console.log("user state from useuser:", userRegistered)
    // console.log(" user:", user)
    // console.log("wl:", wallet.accounts[0])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, userRegistered]);
  

  const fetchUserData = async () => {
    // if (isConnecting) {
    //   try {
    //     var data = await getData();
    //     if (data && data.isVerified) {
    //       setUser(data);
    //       userRegistered = true;
    //       setUserRegistered(true);
    //     } else {
    //       setUser(null); // Reset user state if not verified
    //       setUserRegistered(false);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching user data:', error);
    //   }
    // }
    try {
        var data = await getData();
        if (data && data.isVerified) {
          setUser(data);
          userRegistered = true;
          setUserRegistered(true);
        } else {
          setUser(null); // Reset user state if not verified
          setUserRegistered(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
  };
  return (
    <UserContext.Provider value={{ userRegistered, setUserRegistered }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  return useContext(UserContext);
};
