import React from "react";

export const API_DOMAIN = import.meta.env.PROD ? 'https://yourdomain.com' : 'http://localhost';
export const ASSET_DOMAIN = '';

export const UserContext = React.createContext(null);

