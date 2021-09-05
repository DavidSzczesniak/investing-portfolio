import React from 'react';
import { AssetTable } from '../components/AssetTable/AssetTable';

export const UserList = () => {
    return (
        <>
            <h2 className="page-title">Your Watchlist</h2>
            <AssetTable favourites />
        </>
    );
};
