import React, { useRef, useState, useEffect } from 'react';
import '../css/Main.css';
import SearchResult from '../components/SearchResult';
import Button from '../components/Button';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../components/NavBar';
import InfoPage from '../components/InfoPage';

const Main = () => {
    const geckoAPI = 'https://api.coingecko.com/api/v3/';
    const searchRef = useRef(undefined);
    const [searchResult, setResult] = useState({});
    const [errorMessage, setError] = useState(undefined);
    const [userAssetList, setAssetList] = useState([]);
    const [resultAssetOwned, setOwned] = useState(false);

    useEffect(() => {
        setError(undefined);
        setResult({});
        setAssetList(localStorage.getItem('assetList') || []);
    }, []);

    async function handleSearch() {
        const query = searchRef.current.value;

        if (query) {
            fetch(`${geckoAPI}coins/${query}`)
                .then((res) => {
                    return res.json();
                })
                .then((json) => {
                    if (json.error) {
                        setResult({});
                        setError(json.error);
                    } else {
                        searchAssetList(json.symbol);
                        setError(undefined);
                        setResult({
                            name: json.name,
                            symbol: json.symbol,
                            thumb: json.image.thumb,
                            image: json.image.small,
                            price: json.market_data.current_price.gbp,
                            price_change: {
                                '24h': json.market_data.price_change_percentage_24h.toFixed(2),
                            },
                        });
                    }
                });
        }
    }

    function searchAssetList(searchedAsset) {
        setOwned(false);
        if (userAssetList.length) {
            const assetMatches = (asset) => asset.symbol === searchedAsset;
            if (JSON.parse(userAssetList).some(assetMatches)) {
                setOwned(true);
            }
        }
    }

    return (
        <>
            <NavBar title="Search" />
            <div className="search-page">
                <div className="search-field">
                    <input type="text" ref={searchRef} placeholder="Search assets..." />
                    <Button label="Search" click={handleSearch} />
                </div>
                {errorMessage && (
                    <InfoPage title="Not Found" message={errorMessage} icon={faSearch} />
                )}
                {Object.entries(searchResult).length > 0 && (
                    <SearchResult
                        result={searchResult}
                        owned={resultAssetOwned}
                        setOwned={setOwned}
                    />
                )}
            </div>
        </>
    );
};

export default Main;
