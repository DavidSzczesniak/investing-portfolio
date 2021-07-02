import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import InfoPage from '../components/InfoPage';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import AssetInfo from '../components/AssetInfo';
import { geckoAPI } from '../constants.js';
import axios from 'axios';
import { useHistory } from 'react-router';

const UserList = () => {
    const [userAssetList, setAssetList] = useState([]);
    const [refreshed, refreshPage] = useState(false);
    const history = useHistory();

    useEffect(() => {
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
                        current_price: data.market_data.current_price.usd,
                        price_change_percentage_24h: data.market_data.price_change_percentage_24h,
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
                                click={() => history.replace(`/asset-view?id=${asset.id}`)}
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
