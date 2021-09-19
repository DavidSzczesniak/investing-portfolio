import { faSearch, faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import loadingDots from '../../assets/loading-dots.gif';
import { geckoAPI } from '../../constants';
import { AssetName } from '../AssetInfo/AssetInfo';
import { Button } from '../Button/Button';
import './Deposit.scss';

export const Deposit = ({ close }) => {
    const [currency, setCurrency] = useState(
        JSON.parse(localStorage.getItem('currency')) || {
            value: 'usd',
            label: 'USD - $',
            symbol: '$',
        }
    );
    const [assetList, setAssetList] = useState([]);
    const [filteredAssetList, setFilteredList] = useState([]);
    const [searchValue, setSearchValue] = useState(undefined);
    const [holdings, setHoldings] = useState(JSON.parse(localStorage.getItem('holdings')) || []);
    const [editedAsset, setEditedAsset] = useState(undefined);

    useEffect(() => {
        axios
            .get(
                `${geckoAPI}coins/markets?vs_currency=${currency.value}&order=market_cap_desc&per_page=100`
            )
            .then((res) => {
                setAssetList(res.data);
                setFilteredList(res.data);
            });
    }, [currency.value]);

    function handleSearch(event) {
        setSearchValue(event.target.value);
        // remove whitespace and non alphanumeric characters from input
        const searchTerm = event.target.value.trim().replace(/[^a-z\d]+/, '');

        if (searchTerm) {
            const searchRegex = new RegExp(`${searchTerm}`, 'i');
            setFilteredList(assetList.filter((asset) => Boolean(asset.name.match(searchRegex))));
        } else {
            setFilteredList(assetList);
        }
    }

    function handleSearchClear() {
        setSearchValue(undefined);
        setFilteredList(assetList);
    }

    function handleDeposit(asset, amount) {
        setEditedAsset(undefined);
        const existingHolding = holdings.find((a) => a.id === asset.id);
        if (existingHolding) {
            const newHoldings = holdings;
            newHoldings[newHoldings.indexOf(existingHolding)].amount = amount;
            setHoldings([...newHoldings]);
        } else {
            setHoldings((currentArr) => [
                ...currentArr,
                { id: asset.id, amount: amount, symbol: asset.symbol },
            ]);
        }
        localStorage.setItem('holdings', JSON.stringify(holdings));
    }

    return (
        <div className="deposit">
            <div className="header">
                <h2 className="page-title">Deposit</h2>
                <Button icon={faTimes} onClick={close} ariaLabel="close" iconSize="2x" />
            </div>
            <FontAwesomeIcon icon={faSearch} size="1x" className="search-icon" />
            <input
                type="text"
                placeholder="Search"
                className="asset-search"
                onChange={handleSearch}
                value={searchValue || ''}
            />
            {searchValue && (
                <Button
                    icon={faTimesCircle}
                    onClick={handleSearchClear}
                    ariaLabel="clear search"
                    className="clear-search"
                />
            )}
            {assetList.length > 0 ? (
                <div className="asset-list">
                    {filteredAssetList.length > 0 ? (
                        <>
                            {filteredAssetList.map((asset, index) => {
                                return (
                                    <div
                                        className="asset-result"
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
                                                        defaultValue={
                                                            holdings.find((a) => a.id === asset.id)
                                                                ?.amount || ''
                                                        }
                                                    />
                                                    <Button label="Save" type="submit" />
                                                </form>
                                            </div>
                                        ) : (
                                            <span className="holding-amount">
                                                {holdings.find((a) => a.id === asset.id)?.amount ||
                                                    '0'}{' '}
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
            ) : (
                <div>
                    <img src={loadingDots} alt="loading" />
                </div>
            )}
        </div>
    );
};
