import React, { useEffect } from 'react';

const SearchResult = (props) => {
    const { result, owned, setOwned } = props;
    const userAssetList = localStorage.getItem('assetList') || [];

    useEffect(() => {}, [owned]);

    function handleSaveAsset() {
        let currentList = JSON.parse(localStorage.getItem('assetList'));
        if (currentList) {
            currentList.push(result);
            localStorage.setItem('assetList', JSON.stringify(currentList));
        } else {
            localStorage.setItem('assetList', JSON.stringify([result]));
        }

        setOwned(true);
    }

    function handleRemoveAsset() {
        const newList = JSON.parse(userAssetList).filter((asset) => {
            return asset.symbol !== result.symbol;
        });

        localStorage.setItem('assetList', JSON.stringify(newList));

        setOwned(true);
    }

    return (
        <div>
            <div>Name: {result.name}</div>
            <div>Ticker: {result.symbol}</div>
            {/* <div>Description: {result.desc}</div> */}
            {owned ? (
                <button onClick={() => handleRemoveAsset()}>Remove from list</button>
            ) : (
                <button onClick={() => handleSaveAsset()}>Add to list</button>
            )}
        </div>
    );
};

export default SearchResult;
