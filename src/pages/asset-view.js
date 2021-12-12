import React, { useEffect } from 'react';
import { AssetChart } from '../components/AssetChart/AssetChart.jsx';
import { AssetName, AssetPrice } from '../components/AssetInfo/AssetInfo';
import { FavouritesButton } from '../components/FavouritesButton/FavouritesButton.jsx';
import { LoadingPage } from '../components/LoadingPage/LoadingPage.jsx';
import { MarketStats } from '../components/MarketStats/MarketStats.jsx';
import '../css/asset-view.scss';
import { useAssetView } from '../hooks/useAssetView.js';

export const AssetView = () => {
    const { asset, loading } = useAssetView('bitcoin');

    useEffect(() => {}, []);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div data-testid="asset-view">
            <div className="asset-view__header">
                <AssetName asset={asset} />
                <AssetPrice asset={asset} />
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <FavouritesButton asset={asset} />
                </span>
            </div>
            <div className="asset-view__content">
                <AssetChart asset={asset} />
                <MarketStats asset={asset} />
            </div>
        </div>
    );
};
