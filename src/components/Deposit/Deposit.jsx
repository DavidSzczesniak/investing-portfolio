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
                                return <AssetName key={index} asset={asset} />;
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
