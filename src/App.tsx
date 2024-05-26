import "./App.global.css";


import { Navigation } from "./components/Navigation/Navigation";
import { Display } from "./components/Display/Display";
import { MetaMaskError } from "./components/MetaMaskError/MetaMaskError";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";







export const App  = () => {
  const location = useLocation();
  const [shouldReload, setShouldReload] = useState(false);

  

  return (
    
    
      <div >
        
        <Navigation />
        
        
        <Display />

        <MetaMaskError />
        
      </div>
    
    
  );
};

export default App;
