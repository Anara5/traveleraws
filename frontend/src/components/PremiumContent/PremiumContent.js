import React from 'react';
import Map from '../Map/Map';
import PlacesList from '../PlacesList/PlacesList';
import classes from './PremiumContent.module.css';
import { usePlacesContext } from '../UI/context/PlacesProvider';

const PremiumContent = ({ user }) => {
  const {
    userPlaces,
    selectedPlaces,
    addSelectedPlace,
  } = usePlacesContext();
  
  return (
    <div className={classes.content}>
      <div className={classes.map}>
        <Map onUpdateSelectedPlaces={addSelectedPlace} userPlaces={userPlaces} user={user} />
      </div>
      <div className={classes.placesList}>
        <PlacesList selectedPlaces={selectedPlaces} userPlaces={userPlaces} />
      </div>
    </div>
  );
};

export default PremiumContent;
