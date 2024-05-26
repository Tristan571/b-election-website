import { useEffect } from 'react';
import { useMetaMask } from '../../hooks/useMetaMask';
import { Alert, Space } from 'antd'
import styles from './MetaMaskError.module.css';


export const MetaMaskError = () => {
  const { error, errorMessage, clearError } = useMetaMask();

  useEffect(() => {
    // Set a timeout to clear the error after 5 seconds (adjust as needed)
    const timeoutId = setTimeout(() => {
      if (error) {
        clearError();
      }
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clean up the timeout when the component unmounts or when error changes
    return () => clearTimeout(timeoutId);
  }, [error, clearError]);



  return (
    

  <Space direction="vertical" style={{ width: '100%' }}>
  {error && (
    <Alert className={styles.error} onClick={clearError} type="error" message={`Error: ${errorMessage}`} banner closable />
  )}
  </Space>


  );
};
