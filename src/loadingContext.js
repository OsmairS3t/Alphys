import { createContext, useState } from 'react';

const LoadingContext = createContext();

const initialState = {
  isLoading: false,
};

const LoadingProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const showLoading = () => setState({ isLoading: true });
  const hideLoading = () => setState({ isLoading: false });

  return (
    <LoadingContext.Provider value={{ state, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export { LoadingProvider, LoadingContext };