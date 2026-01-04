import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create the context
const DataContext = createContext();

// 2. Create the provider
export const DataProvider = ({ children }) => {
  const [usersData, setUsersData] = useState([]);
  const [productsData, setProductsData] = useState([]);

  // Fetching Products data form API
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://med-api-wine.vercel.app/api/products/"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setProductsData(result);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
    }
  };

  // Fetching Users data form API
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://med-api-wine.vercel.app/api/users/"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setUsersData(result);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  return (
    <DataContext.Provider
      value={{
        productsData,
        fetchProducts,
        usersData,
        fetchUsers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// 3. Custom hook to use data
export const useData = () => useContext(DataContext);
