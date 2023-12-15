import React from 'react';
import classes from './PlacesList.module.css';
import { usePlacesContext } from '../UI/context/PlacesProvider';
import axios from 'axios';

const PlacesList = () => {
  const { removeSelectedPlace, userPlaces } = usePlacesContext();
    
  const handleDelete = (index) => {
    const requestConfig = {
      headers: {
        'x-api-key': process.env.REACT_APP_X_API_KEY,
      }
    };
    const placeAPIUrl = process.env.REACT_APP_PLACE_URL;
    const requestBody = {
      id: userPlaces[index].id
    };

    axios.delete(placeAPIUrl, { data: requestBody, ...requestConfig })
      .then((response) => {
        removeSelectedPlace(index);
        console.log('Place deleted successfully');
      })
      .catch((error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log(error.response.data.message);
        } else {
          console.log('Sorry, an unexpected error occurred. Please try again later.');
        }
      });
  };
    
  return (
    <div className={classes.placesList}>
      {userPlaces.length > 0 ? (
        userPlaces.map((place, index) => (
          <div key={place.id} className={classes.placesListItem}>
            {place.placeName}
            <button
              className={classes.placesListItemDelete}
              onClick={() => handleDelete(index)}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No places added yet.</p>
      )}
    </div>
  );
};
  
export default PlacesList;
