import React from 'react';
import classes from './PlacesList.module.css';
import { usePlacesContext } from '../UI/context/PlacesProvider';

const PlacesList = () => {

    const { selectedPlaces, removeSelectedPlace } = usePlacesContext();
  
    const handleDelete = (index) => {
        removeSelectedPlace(index);
    };
    
    return (
        <div className={classes.placesList}>
          {selectedPlaces.map((place, index) => (
            <div key={index} className={classes.placesListItem}>
              {place.placeName}
              <button
                className={classes.placesListItemDelete}
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      );
    };
  
  export default PlacesList;