import { faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { getRandomColor } from '../../Utils/helpers';
import { AssetName } from '../AssetInfo/AssetInfo';
import { Button } from '../Button/Button';
import { SearchField } from '../SearchField/SearchField';
import './Deposit.scss';

export const Deposit = ({ close }) => {
    const assets = JSON.parse(localStorage.getItem('assetList'))?.list || [];
    const [filteredAssetList, setFilteredList] = useState(assets);
    const [searchValue, setSearchValue] = useState(undefined);
    const [holdings, setHoldings] = useState(JSON.parse(localStorage.getItem('holdings')) || []);
    const [editedAsset, setEditedAsset] = useState(undefined);

    function handleSearch(event) {
        setSearchValue(event.target.value);
        // remove whitespace and non alphanumeric characters from input
        const searchTerm = event.target.value.trim().replace(/[^a-z\d]+/, '');

        if (searchTerm) {
            const searchRegex = new RegExp(`${searchTerm}`, 'i');
            setFilteredList(assets.filter((asset) => Boolean(asset.name.match(searchRegex))));
        } else {
            setFilteredList(assets);
        }
    }

    function getAssetAmount(id) {
        return holdings.find((asset) => asset.id === id)?.amount;
    }

    function handleSearchClear() {
        setSearchValue(undefined);
        setFilteredList(assets);
    }

    function handleDeposit(asset, amount) {
        setEditedAsset(undefined);
        const existingHolding = holdings.find((a) => a.id === asset.id);
        const newHoldings = holdings;
        amount = Number(amount);

        if (existingHolding) {
            const holdingIndex = newHoldings.indexOf(existingHolding);
            // amend existing amount
            if (amount === '0') {
                // remove from array if set to 0
                newHoldings.splice(holdingIndex, 1);
            } else {
                newHoldings[holdingIndex].amount = amount;
            }
            setHoldings([...newHoldings]);
        } else {
            // add new array item if it doesn't exist
            if (amount !== '0') {
                newHoldings.push({
                    id: asset.id,
                    amount: amount,
                    color: getRandomColor(),
                });
                setHoldings(newHoldings);
            }
        }
        localStorage.setItem('holdings', JSON.stringify(newHoldings));
    }

    return (
        <>
            <div className="page-header">
                <h2 className="title">Deposit</h2>
                <Button icon={faTimes} onClick={close} ariaLabel="close" iconSize="2x" />
            </div>
            <div className="search-container">
                <SearchField
                    inputValue={searchValue}
                    onChange={handleSearch}
                    clearSearch={handleSearchClear}
                />
            </div>
            <div className="asset-list">
                {filteredAssetList.length > 0 ? (
                    <>
                        {filteredAssetList
                            .sort((a, b) => getAssetAmount(b.id) - getAssetAmount(a.id))
                            .map((asset, index) => {
                                return (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            editedAsset !== asset.id && setEditedAsset(asset.id)
                                        }>
                                        <AssetName asset={asset} disableClick />
                                        {editedAsset === asset.id ? (
                                            <div className="edit-asset">
                                                <form
                                                    onSubmit={(e) =>
                                                        handleDeposit(asset, e.target[0].value)
                                                    }>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        defaultValue={
                                                            getAssetAmount(asset.id) || ''
                                                        }
                                                    />
                                                    <Button label="Save" type="submit" />
                                                </form>
                                            </div>
                                        ) : (
                                            <span className="holding-amount">
                                                {getAssetAmount(asset.id) || '0'}{' '}
                                                {asset.symbol.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                    </>
                ) : (
                    <span>No results found</span>
                )}
            </div>
        </>
    );
};
