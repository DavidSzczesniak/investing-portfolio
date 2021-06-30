import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import InfoPage from '../components/InfoPage';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import AssetInfo from '../components/AssetInfo';
import { geckoAPI } from '../constants.js';

const UserList = () => {
    const [userAssetList, setAssetList] = useState([]);
    const [refreshed, refreshPage] = useState(false);

    useEffect(() => {
        const currentAssetList = JSON.parse(localStorage.getItem('assetList')) || [];
        setAssetList(currentAssetList);

        currentAssetList.forEach((asset) => {
            let diffInMinutes = new Date(asset.updatedOn) - new Date();
            diffInMinutes = Math.round(diffInMinutes / 1000 / 60);

            if (diffInMinutes < -5) {
                fetch(`${geckoAPI}coins/${asset.id}`)
                    .then((res) => {
                        return res.json();
                    })
                    .then((json) => {
                        const newInfo = {
                            id: json.id,
                            symbol: json.symbol,
                            name: json.name,
                            image: json.image.small,
                            current_price: json.market_data.current_price.usd,
                            price_change_percentage_24h:
                                json.market_data.price_change_percentage_24h,
                            updatedOn: new Date(),
                        };

                        // remove old info about the asset if it exists
                        let newPrices = currentAssetList.filter((currentAsset) => {
                            return currentAsset.id !== json.id;
                        });
                        newPrices.push(newInfo);
                        localStorage.setItem('assetList', JSON.stringify(newPrices));
                        setAssetList(newPrices);
                    });
            }
        });
    }, [refreshed]);

    return (
        <>
            <NavBar title="Your Watchlist" />
            {userAssetList.length ? (
                <div>
                    {userAssetList.map((asset, index) => {
                        return (
                            <AssetInfo
                                key={index}
                                asset={asset}
                                refreshPage={refreshPage}
                                refreshState={refreshed}
                                userAssetList={userAssetList}
                            />
                        );
                    })}
                </div>
            ) : (
                <InfoPage
                    title="Woops! Nothing here!"
                    message="It looks like you haven't saved anything to your watchlist yet."
                    icon={faQuestionCircle}
                />
            )}
        </>
    );
};

export default UserList;
