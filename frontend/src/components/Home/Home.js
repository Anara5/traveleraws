import React from 'react';
import classes from './Home.module.css';

const Home = () => {
    return (
        <div className={classes.backgroundImage}>
            <div className={classes.homepage}>
                <h1>Home</h1>
                <p>My favorite hobby is travelling. </p>
                <p>In this project the user can register/login and save/delete places that were visited. </p>
                <p>The idea is to demonstrate the Techs for backend from AWS cloud service.</p>
            </div>
        </div>
    )
}

export default Home;