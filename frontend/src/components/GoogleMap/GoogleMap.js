import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import classes from './GoogleMap.module.css';

const GoogleMap = () => {

    // TO_DO: Add a state variable to store the user's location. Itshould locate the center of the map when the page loads.
    const [userLocation, setUserLocation] = useState({
        lat: 37.78,
        lng: -122.45
    });

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


    return (
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <div className={classes.map}>
                <Map
                zoom={userLocation ? 14 : 5}
                center={userLocation}
            />
            </div>
            
        </APIProvider>
    );
}

export default GoogleMap;