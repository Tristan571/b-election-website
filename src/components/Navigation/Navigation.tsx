import { useEffect, useState } from "react";
import { useMetaMask } from "../../hooks/useMetaMask";
import { formatAddress, formatChainAsNum } from "../../utils";
import styles from "./Navigation.module.css";
import { Button } from "antd";
import { Link } from "react-router-dom";
import VotingManagerAddress from "../../../constants/VotingManagerAddress.json";
import { useUser } from "../../hooks/userContext";

const networks = {
  polygonAmoy: {
    chainId: `0x${Number(80002).toString(16)}`,
    chainName: "Polygon Amoy",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-amoy.polygon.technology/"],
    blockExplorerUrls: ["https://amoy.polygonscan.com/"],
  },
  localhost: {
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: "Localhost Hardhat",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["http://127.0.0.1:8545/"],
    blockExplorerUrls: ["http://127.0.0.1:8545/"],
  },
};

export const Navigation = () => {
  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask();
  const [supportedNetwork, setSupportedNetwork] = useState<boolean | null>(null);
  const { userRegistered } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [renderedButton, setRenderedButton] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const init = async () => {
      const button = await renderNetworkButton();
      setRenderedButton(button);
      setIsLoading(false); // Set loading to false after button is rendered
    };
    init();
  }, [wallet, supportedNetwork, userRegistered]);

  const supportedChain = async () => {
    const walletChainId = formatChainAsNum(wallet.chainId).toString();
    if (walletChainId === VotingManagerAddress.chainId) {
      setSupportedNetwork(true);
    } else {
      setSupportedNetwork(false);
    }
  };

  const switchNetwork = async (networkName: keyof typeof networks) => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...networks[networkName],
          },
        ],
      });
    } catch (error: any) {
      console.error("Failed to switch network:", error);
    }
  };

  const renderNetworkButton = async () => {
    await supportedChain();

    if (!hasProvider) {
      return (
        <a href="https://metamask.io" target="_blank" rel="noreferrer">
          Please Install MetaMask
        </a>
      );
    }

    if (window.ethereum?.isMetaMask && wallet.accounts.length < 1) {
      return (
        <Button
          type="primary"
          shape="round"
          disabled={isConnecting}
          onClick={connectMetaMask}
        >
          Connect MetaMask
        </Button>
      );
    }

    if (hasProvider && wallet.accounts.length > 0) {
      if (supportedNetwork === true) {
        if (userRegistered) {
          return (
            <Button
              type="primary"
              
              shape="round"
              className="text_link tooltip-bottom"
              href={`https://www.oklink.com/amoy/address/${wallet.accounts[0]}`}
              target="_blank"
              data-tooltip="Open in Block Explorer"
              rel="noreferrer"
            >
              {formatAddress(wallet.accounts[0])}
            </Button>
          );
        } else {
          return (
            <Link to="/register">
              <Button
                className="bg-yellow-100 text-yellow-600 rounded-full border-yellow-700 px-5"
              >
                Please Register to Use Functions Properly!
              </Button>
            </Link>
          );
        }
      } else if (supportedNetwork === false) {
        return (
          <Button danger onClick={() => switchNetwork("polygonAmoy")}>
            Wrong network detected! Switch Now
          </Button>
        );
      }
    }

    return null;
  };

  return (
    <div className={styles.navigation}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="fixed rounded-full  top-2  w-full  z-50 bg-sky-100 border-b backdrop-blur-lg bg-opacity-10 drop-shadow-lg">
          <div className="mx-auto max-w-7xl mr-10 px-6 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="flex flex-1 items-stretch justify-start">
                <a className="flex flex-shrink-0 items-center" href="#">
                  <Link to="/" className="text-2xl">
                    B - Election
                  </Link>
                </a>
              </div>
              <div className="flex-shrink-0 flex px-2 py-3 items-center space-x-8">
                <div className={styles.rightNav}>{renderedButton}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
