import React, { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import '@reach/combobox/styles.css';
import classes from './Map.module.css';
import { usePlacesContext } from '../UI/context/PlacesProvider';
import axios from 'axios';

const libraries = ['places'];

export default function Places({ user }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  if (!isLoaded) return "Loading...";

  return <Map user={user} />;
}

const Map = ({ user }) => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState({
    lat: 37.78,
    lng: -122.45
  });
  const { addSelectedPlace, userPlaces } = usePlacesContext();
  const [message, setMessage] = useState(null);

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

  const generateRandomId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 100000);
    return `${timestamp}-${random}`;
  };
  const randomId = generateRandomId();

  const handleSelectPlace = async (address) => {
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = getLatLng(results[0]);
      const placeName = address;
      const isDuplicate = userPlaces.some(
        (place) =>
          place.placeName === placeName &&
          place.lat === lat &&
          place.lng === lng
      );
      if (isDuplicate) {
        console.warn('Duplicate place detected. Not adding to the list.');
        return;
      }
      //addSelectedPlace({ placeName, lat, lng });
      //sending place to the backend by assigning it to the username for now... Need better solution
      const requestConfig = {
        headers: {
          'x-api-key': process.env.REACT_APP_X_API_KEY,
        }
      };
      const requestBody = {
        id: randomId,
        placeName: placeName,
        lat: lat,
        lng: lng,
        username: user.username // should be user.id or user.email instead as username is might not be unique
      };
      
      const placeAPIUrl = process.env.REACT_APP_PLACE_URL;

      axios
        .post(placeAPIUrl, requestBody, requestConfig)
        .then((response) => {
          setMessage('Place added successfully');
          addSelectedPlace({ placeName, lat, lng, id: randomId });
        })
        .catch((error) => {
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            setMessage(error.response.data.message);
          } else {
            setMessage('Sorry, an unexpected error occurred. Please try again later.');
          }
        });

      if (map) {
        map.panTo({ lat, lng });
      }

    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const markers = userPlaces
    ? userPlaces.map((place) => (
        <Marker 
          key={`marker-${place.id}`} 
          position={{ lat: place.lat, lng: place.lng }}
          icon={
            {
              url: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
              scaledSize: new window.google.maps.Size(50, 50)
            }
          }
        />
      ))
    : null;

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
              { markers }
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
            data.map(({ description }) => {
              return <ComboboxOption key={description} value={description} />;
            }
          )}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};
