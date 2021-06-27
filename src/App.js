import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import SearchResult from './components/SearchResult';

const App = () => {
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
                        setResult({
                            name: json.name,
                            symbol: json.symbol,
                            desc: json.description.en,
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
        <div className="App">
            <div>Investment Portfolio</div>
            <input type="text" ref={searchRef} placeholder="Asset name..." />
            <button onClick={() => handleSearch()}>Search</button>
            {errorMessage && <div>{errorMessage}</div>}
            {Object.entries(searchResult).length > 0 && (
                <SearchResult result={searchResult} owned={resultAssetOwned} setOwned={setOwned} />
            )}
            {userAssetList.length > 0 && (
                <>
                    <div>Saved Assets:</div>
                    <div>
                        {JSON.parse(userAssetList).map((asset, index) => {
                            return (
                                <div key={index}>
                                    ({asset.symbol.toUpperCase()}) {asset.name}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default App;
