import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { InfoPage } from '../../components/InfoPage/InfoPage';
import { AssetHoldings, AssetName, AssetPrice } from '../AssetInfo/AssetInfo';
import { FavouritesButton } from '../FavouritesButton/FavouritesButton';
import './AssetTable.scss';

export const AssetTable = ({ assets, holdings, favourites }) => {
    const [assetList, setAssetList] = useState([]);
    const [refreshed, refreshPage] = useState(false);
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'usd',
        label: 'USD - $',
        symbol: '$',
    };

    useEffect(() => {
        if (assets) {
            setAssetList(assets);
        } else if (favourites) {
            const mainAssetList = JSON.parse(localStorage.getItem('assetList')) || [];
            const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
            const filteredAssets = mainAssetList.list.filter((asset) =>
                watchlist.find((watchlistAsset) => watchlistAsset === asset.id)
            );
            setAssetList(filteredAssets);
        }
    }, [refreshed, currency.value, assets, holdings, favourites]);

    return (
        <>
            {assetList.length > 0 ? (
                <table className="asset-table">
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Price</th>
                            {holdings && <th>Holdings</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {/* todo: add sorting */}
                        {assetList.map((asset, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <AssetName asset={asset} />
                                    </td>
                                    <td>
                                        <AssetPrice asset={asset} currency={currency.symbol} />
                                    </td>
                                    {holdings && (
                                        <td>
                                            <AssetHoldings
                                                asset={asset}
                                                currency={currency.symbol}
                                            />
                                        </td>
                                    )}
                                    {favourites && (
                                        <td>
                                            <FavouritesButton
                                                asset={asset}
                                                refreshState={refreshed}
                                                refreshPage={refreshPage}
                                            />
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <InfoPage
                    title="Woops! Nothing here!"
                    message="It looks like you haven't added anything yet."
                    icon={faQuestionCircle}
                />
            )}
        </>
    );
};
