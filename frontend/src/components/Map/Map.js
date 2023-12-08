import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import '@reach/combobox/styles.css';
import classes from './Map.module.css';
import { usePlacesContext } from '../UI/context/PlacesProvider';
import { getUser } from '../../service/AuthService';

const libraries = ['places'];

export default function Places() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  if (!isLoaded) return "Loading...";

  return <Map />;
}

const Map = () => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState({
    lat: 37.78,
    lng: -122.45
  });
  const { addSelectedPlace, selectedPlaces } = usePlacesContext();

  console.log("userId: ", getUser());

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      function (error) {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

  const handleLoadMap = (map) => {
    setMap(map);
  };

  const handleSelectPlace = async (address) => {
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = getLatLng(results[0]);
      const placeName = address;

      addSelectedPlace({ lat, lng, placeName });
      if (map) {
        map.panTo({ lat, lng });
      }

    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <>
      {userLocation ? (
        <div>
          <PlacesAutocomplete onSelect={handleSelectPlace} />
            
          <div className={classes.map}>
            <GoogleMap
              zoom={userLocation ? 8 : 4}
              center={userLocation}
              mapContainerStyle={{ width: '100%', height: '100%' }}
              onLoad={handleLoadMap}
            >
              {selectedPlaces.map((selected, index) => (
                <Marker key={index} position={{ lat: selected.lat, lng: selected.lng }} />
              ))}
            </GoogleMap>
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
};

const PlacesAutocomplete = ({ onSelect }) => {
  const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    if (onSelect) {
      onSelect(address);
    }

    setValue("");
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        id="placesAutocompleteInput"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className={classes.comboboxInput}
        placeholder="search a place"
      />
      <ComboboxPopover className={classes.comboboxPopover}>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ id, description }) => (
              <ComboboxOption key={id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};