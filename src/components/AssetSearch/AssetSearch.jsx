import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { AssetName } from '../AssetInfo/AssetInfo';
import { SearchField } from '../SearchField/SearchField';
import './AssetSearch.scss';

export const AssetSearch = ({ searchOptions, close }) => {
    const [searchValue, setSearchValue] = useState(undefined);
    const history = useHistory();
    const [filteredList, setFiltered] = useState(searchOptions);

    function handleSearch(event) {
        setSearchValue(event.target.value);
        // remove whitespace and non alphanumeric characters from input
        const searchTerm = event.target.value.trim().replace(/[^a-z\d]+/, '');

        if (searchTerm) {
            const searchRegex = new RegExp(`${searchTerm}`, 'i');
            setFiltered(searchOptions.filter((asset) => Boolean(asset.name.match(searchRegex))));
        } else {
            setFiltered(searchOptions);
        }
    }

    function goToAsset(id) {
        history.replace(`/asset-view?id=${id}`);
        close();
    }

    return (
        <>
            <SearchField
                inputValue={searchValue}
                onChange={handleSearch}
                clearSearch={() => setSearchValue(false)}
                size="lg"
                style={
                    searchValue ? { borderBottomLeftRadius: '0', borderBottomRightRadius: '0' } : {}
                }
            />
            {searchValue && (
                <ul className="search-results" data-testid="search-results">
                    {filteredList.length > 0 ? (
                        filteredList.map((asset, index) => {
                            return (
                                <li
                                    key={index}
                                    onClick={() => goToAsset(asset.id)}
                                    data-testid="search-result">
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
        </>
    );
};
