import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { AssetName } from '../AssetInfo/AssetInfo';
import { Button } from '../Button/Button';
import './AssetSearch.scss';

export const AssetSearch = ({ close }) => {
    const [searchValue, setSearchValue] = useState(undefined);
    const assets = JSON.parse(localStorage.getItem('assetList'))?.list || [];
    const history = useHistory();
    const [filteredList, setFiltered] = useState(assets);

    function handleSearch(event) {
        setSearchValue(event.target.value);
        // remove whitespace and non alphanumeric characters from input
        const searchTerm = event.target.value.trim().replace(/[^a-z\d]+/, '');

        if (searchTerm) {
            const searchRegex = new RegExp(`${searchTerm}`, 'i');
            setFiltered(assets.filter((asset) => Boolean(asset.name.match(searchRegex))));
        } else {
            setFiltered(assets);
        }
    }

    function goToAsset(id) {
        history.replace(`/asset-view?id=${id}`);
        close();
    }

    return (
        <>
            <div className="modal-background" onClick={close}></div>
            <div className="search-container">
                <div className={searchValue ? 'search-box with-results' : 'search-box'}>
                    <FontAwesomeIcon icon={faSearch} />
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={handleSearch}
                        value={searchValue || ''}
                        className={searchValue && 'with-results'}
                        autoFocus
                    />
                    <Button icon={faTimesCircle} onClick={() => setSearchValue(undefined)} />
                </div>
                {searchValue && (
                    <ul className="search-results">
                        {filteredList.length > 0 ? (
                            filteredList.map((asset, index) => {
                                return (
                                    <li key={index} onClick={() => goToAsset(asset.id)}>
                                        <AssetName asset={asset} disableClick />
                                        <div className="market-rank"># {asset.market_cap_rank}</div>
                                    </li>
                                );
                            })
                        ) : (
                            <span>No results found</span>
                        )}
                    </ul>
                )}
            </div>
        </>
    );
};
