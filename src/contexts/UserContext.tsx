import React, { createContext, useContext } from 'react';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children, value }: any) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};