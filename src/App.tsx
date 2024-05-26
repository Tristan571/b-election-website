import "./App.global.css";


import { Navigation } from "./components/Navigation/Navigation";
import { Display } from "./components/Display/Display";
import { MetaMaskError } from "./components/MetaMaskError/MetaMaskError";









export const App  = () => {
  

  

  return (
    
    
      <div >
        
        <Navigation />
        
        
        <Display />

        <MetaMaskError />
        
      </div>
    
    
  );
};

export default App;
