import React from 'react';
import Map from '../Map/Map';
import PlacesList from '../PlacesList/PlacesList';
import classes from './PremiumContent.module.css';
import { usePlacesContext } from '../UI/context/PlacesProvider';

const PremiumContent = () => {
    const { selectedPlaces, addSelectedPlace, removeSelectedPlace } = usePlacesContext();

    const handleDeletePlace = (index) => {
        removeSelectedPlace(index);
    };
  
    return (
      <>
        <div className={classes.content}>
          <div className={classes.map}>
            <Map onUpdateSelectedPlaces={addSelectedPlace} />
          </div>
          <div className={classes.placesList}>
            <PlacesList selectedPlaces={selectedPlaces} onDeletePlace={handleDeletePlace} />
          </div>
        </div>
      </>
    );
  };

export default PremiumContent;