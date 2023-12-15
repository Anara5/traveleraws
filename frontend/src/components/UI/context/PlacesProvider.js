import React, { createContext, useContext, useState, useEffect } from 'react';

const PlacesContext = createContext();

export const usePlacesContext = () => {
  return useContext(PlacesContext);
};

export const PlacesProvider = ({ children, places: initialUserPlaces }) => {
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [userPlaces, setUserPlaces] = useState([]);

  const addSelectedPlace = (place) => {
    // Check if the place with the same latitude and longitude already exists in selectedPlaces
    const isDuplicateSelected = selectedPlaces.some(
      (selectedPlace) =>
        selectedPlace.lat === place.lat &&
        selectedPlace.lng === place.lng
    );
  
    // Check if the place with the same latitude and longitude already exists in userPlaces
    const isDuplicateUser = userPlaces.some(
      (userPlace) =>
        userPlace.lat === place.lat &&
        userPlace.lng === place.lng
    );
  
    if (isDuplicateSelected || isDuplicateUser) {
      console.warn('Duplicate place detected. Not adding to the list.');
      return;
    }
    // If not a duplicate, add the place
    setSelectedPlaces((prevSelectedPlaces) => [...prevSelectedPlaces, place]);
    setUserPlaces((prevUserPlaces) => [...prevUserPlaces, place]);
  };

  const removeSelectedPlace = (index) => {
    setSelectedPlaces((prevSelectedPlaces) =>
      prevSelectedPlaces.filter((_, i) => i !== index)
    );
    setUserPlaces((prevUserPlaces) =>
      prevUserPlaces.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    setUserPlaces(initialUserPlaces);
  }, [initialUserPlaces]);

  return (
    <PlacesContext.Provider
      value={{
        userPlaces,
        selectedPlaces,
        addSelectedPlace,
        removeSelectedPlace,
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
};
