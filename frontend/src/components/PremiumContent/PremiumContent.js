import React from 'react';
import GoogleMap from '../GoogleMap/GoogleMap';
import PlacesList from '../PlacesList/PlacesList';
import classes from './PremiumContent.module.css';

const PremiumContent = () => {
    // TO_DO: add apis for DynamDB to store user's location and places list
    // also the locations should be able to be deleted
    // the locations should display markers on the map
    
    return (
        <div className={classes.content}>
            <div className={classes.map}>
                <GoogleMap />
            </div>
            <div className={classes.placesList}>
              <PlacesList />  
            </div>
        </div>
    )
}

export default PremiumContent;
