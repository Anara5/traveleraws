import React from 'react';
import { getUser } from '../../service/AuthService';

const PremiumContent = () => {
    const user = getUser();
    const name = user !== 'undefined' && user ? user.name : '';

    return (
        <div>
            <h1>Hello, {name}!</h1>
        </div>
    )
}

export default PremiumContent;