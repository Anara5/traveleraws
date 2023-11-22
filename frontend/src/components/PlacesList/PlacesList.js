import React from 'react';
import classes from './PlacesList.module.css';

// test data
const PLACES = [
    'New York',
    'Boston',
    'Los Angeles',
    'San Francisco',
    'Chicago',
    'Seattle',
    'Portland',
    'Denver',
    'Miami',
    'Austin',
    'Atlanta',
    'Philadelphia'
];

const PlacesList = () => {
    return (
        <div className={classes.placesList}>
            {PLACES.map((place, index) => (
                <div className={classes.placesListItem} key={index}>
                {place}
                <button className={classes.placesListItemDelete}>Delete</button>
                </div>
            ))}
        </div>
    )
}

export default PlacesList;