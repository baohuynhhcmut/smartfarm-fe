import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { SocketProvider } from './SocketProvider';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <SocketProvider>
        {children}
      </SocketProvider>
    </Provider>
  );
}; 