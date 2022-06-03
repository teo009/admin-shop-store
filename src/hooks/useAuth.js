import React, { useState, useContext, createContext } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';

import endPoints from '@services/api/';

const AuthContext = createContext();

export function ProviderAuth({ children }) {
    const auth = useProvideAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    ) 
}

export const useAuth = () => {
    return useContext(AuthContext);
}

function useProvideAuth() {
    const [user, setUser] = useState(null);
    const signIn = async (email, password) => {
        const options = {
            Headers: {
                accept: '*/*',
                'Content-Type': 'application/json',
            },
        };
        const { data: acces_token } = await axios.post(
            endPoints.auth.login, 
            {email, password}, 
            options
        );
        if(acces_token) {
            const token = acces_token.access_token;
            Cookie.set('token', token, { expires: 5 });
            axios.defaults.headers.Authorization = `Bearer ${token}`;
            const { data: user } = await axios.get(endPoints.auth.profile);
            console.log(user);
            setUser(user);
        }
    };
    return{
        user, 
        signIn
    }
}