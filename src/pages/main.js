import { faChartPie, faFire } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { AssetName } from '../components/AssetInfo/AssetInfo';
import { AssetTable } from '../components/AssetTable/AssetTable';
import { geckoAPI } from '../constants';
import '../css/main.scss';
import { normalizeNumber } from '../Utils/helpers';

export const Main = () => {
    const assets = useMemo(
        () => JSON.parse(localStorage.getItem('assetList'))?.list.slice(0, 50) || [],
        []
    );
    const [trending, setTrending] = useState(undefined);
    const [dominance, setDominance] = useState(undefined);

    useEffect(() => {
        axios.get(`${geckoAPI}search/trending`).then((res) => {
            const processedData = res.data.coins
                .map((coin) => {
                    return {
                        id: coin.item.id,
                        image: coin.item.large,
                        name: coin.item.name,
                        symbol: coin.item.symbol,
                        market_cap_rank: coin.item.market_cap_rank,
                    };
                })
                .slice(0, 5);
            setTrending(processedData);
        });
        axios.get(`${geckoAPI}global`).then((res) => {
            const dominanceData = Object.entries(res.data.data.market_cap_percentage).slice(0, 5);
            // cross reference with assetList as the above response only includes the symbol and percentage of each asset
            const filteredAssets = assets.filter((asset) =>
                dominanceData.some((a) => a[0] === asset.symbol)
            );
            setDominance(
                filteredAssets.map((asset) => ({
                    ...asset,
                    dominance: dominanceData.find((a) => a[0] === asset.symbol)[1],
                }))
            );
        });
    }, [assets]);

    return (
        <>
            {assets.length > 0 && (
                <>
                    <h2 className="page-title" style={{ textAlign: 'left', fontSize: '1.75rem' }}>
                        Today's Top Cryptocurrencies
                    </h2>
                    <div className="top-crypto-lists">
                        <div className="foreground-panel">
                            <header>
                                <FontAwesomeIcon icon={faFire} />
                                <h3>Trending</h3>
                            </header>
                            <ul className="trending-list">
                                {trending &&
                                    trending.map((asset, index) => {
                                        return (
                                            <li key={index}>
                                                <AssetName asset={asset} />
                                                <div>#{asset.market_cap_rank}</div>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                        <div className="foreground-panel">
                            <header>
                                <FontAwesomeIcon icon={faChartPie} />
                                <h3>Market Dominance</h3>
                            </header>
                            <ul className="dominance-list">
                                {dominance &&
                                    dominance.map((asset, index) => {
                                        return (
                                            <li key={index}>
                                                <AssetName asset={asset} />
                                                <div>{normalizeNumber(asset.dominance)}%</div>
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                    </div>
                    <AssetTable assets={assets} favourites />
                </>
            )}
        </>
    );
};
