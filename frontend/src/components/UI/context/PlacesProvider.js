import React, { createContext, useContext, useState } from 'react';

const PlacesContext = createContext();

export const usePlacesContext = () => {
  return useContext(PlacesContext);
};

export const PlacesProvider = ({ children }) => {
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  const addSelectedPlace = (place) => {
    setSelectedPlaces((prevSelectedPlaces) => [...prevSelectedPlaces, place]);
  };

  const removeSelectedPlace = (index) => {
    setSelectedPlaces((prevSelectedPlaces) =>
      prevSelectedPlaces.filter((_, i) => i !== index)
    );
  };

  return (
    <PlacesContext.Provider
      value={{
        selectedPlaces,
        addSelectedPlace,
        removeSelectedPlace,
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
};