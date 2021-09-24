import React from 'react';
import { AssetTable } from '../components/AssetTable/AssetTable';

export const Main = () => {
    const assets = JSON.parse(localStorage.getItem('assetList'))?.list.slice(0, 20) || [];

    return (
        <>
            {assets.length > 0 && (
                <>
                    <h2 className="page-title">Top 20 by Market Cap</h2>
                    <AssetTable assets={assets} favourites />
                </>
            )}
        </>
    );
};
