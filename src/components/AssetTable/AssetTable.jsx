import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { InfoPage } from '../../components/InfoPage/InfoPage';
import { geckoAPI } from '../../constants';
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
        // use given assets or get from user's localStorage
        if (assets) {
            setAssetList(assets);
        } else if (holdings) {
            setAssetList(holdings);
        } else {
            const currentAssetList = JSON.parse(localStorage.getItem('assetList')) || [];
            setAssetList(currentAssetList);

            currentAssetList.forEach((asset) => {
                let diffInMinutes = new Date(asset.updatedOn) - new Date();
                diffInMinutes = Math.round(diffInMinutes / 1000 / 60);

                if (diffInMinutes < -5) {
                    axios.get(`${geckoAPI}coins/${asset.id}`).then((res) => {
                        const data = res.data;
                        const newInfo = {
                            id: data.id,
                            symbol: data.symbol,
                            name: data.name,
                            image: data.image.small,
                            current_price: data.market_data.current_price[currency.value],
                            price_change_percentage_24h:
                                data.market_data.price_change_percentage_24h,
                            updatedOn: new Date(),
                        };

                        // remove old info about the asset if it exists
                        let newPrices = currentAssetList.filter((currentAsset) => {
                            return currentAsset.id !== data.id;
                        });
                        newPrices.push(newInfo);
                        localStorage.setItem('assetList', JSON.stringify(newPrices));
                        setAssetList(newPrices);
                    });
                }
            });
        }
    }, [refreshed, currency.value, assets, holdings]);
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
