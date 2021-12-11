import { faQuestionCircle, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { InfoPage } from '../../components/InfoPage/InfoPage';
import { compactNumber } from '../../Utils/helpers';
import { AssetHoldings, AssetName, AssetPrice } from '../AssetInfo/AssetInfo';
import { FavouritesButton } from '../FavouritesButton/FavouritesButton';
import './AssetTable.scss';

export const AssetTable = ({ assets, portfolio, favourites }) => {
    const [assetList, setAssetList] = useState([]);
    const [refreshed, refreshPage] = useState(false);
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'USD',
        label: 'United States Dollar',
        symbol: '$',
    };
    const [currentSort, setCurrentSort] = useState({
        type: 'default',
        heading: null,
        fn: (a, b) => a,
    });

    useEffect(() => {
        if (assets) {
            setAssetList(assets);
        } else if (favourites) {
            const mainAssetList = JSON.parse(localStorage.getItem('assetList')) || [];
            const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
            const filteredAssets = mainAssetList.list.filter((asset) =>
                watchlist.find((watchlistAsset) => watchlistAsset === asset.id)
            );
            setAssetList(filteredAssets);
        }
    }, [refreshed, assets, portfolio, favourites]);

    function handleSort(heading) {
        let nextSort = {
            type: 'default',
            heading,
            fn: (a, b) => a,
        };

        // different sorting function if the sorting criteria is a letter or number
        const sortDesc = (a, b) => {
            if (heading === 'amount') {
                a = a.amount * a.current_price;
                b = b.amount * b.current_price;
            } else {
                a = a[heading];
                b = b[heading];
            }

            if (heading === 'name') {
                if (a > b) {
                    return -1;
                }
                if (b > a) {
                    return 1;
                }
                return 0;
            } else {
                return b - a;
            }
        };

        const sortAsc = (a, b) => {
            if (heading === 'amount') {
                a = a.amount * a.current_price;
                b = b.amount * b.current_price;
            } else {
                a = a[heading];
                b = b[heading];
            }

            if (heading === 'name') {
                if (a > b) {
                    return 1;
                }
                if (b > a) {
                    return -1;
                }
                return 0;
            } else {
                return a - b;
            }
        };

        if (currentSort.type === 'down') {
            nextSort = {
                type: 'up',
                heading,
                icon: faSortUp,
                fn: sortAsc,
            };
        } else if (currentSort.type === 'default') {
            nextSort = {
                type: 'down',
                heading,
                icon: faSortDown,
                fn: sortDesc,
            };
        }

        setCurrentSort(nextSort);
    }

    const tableHeadingsList = [
        {
            prop: 'market_cap_rank',
            label: '#',
        },
        {
            prop: 'name',
            label: 'Name',
        },
        {
            prop: 'current_price',
            label: 'Price',
        },
        {
            prop: 'market_cap',
            label: 'Market Cap',
        },
    ];

    if (portfolio) {
        tableHeadingsList.splice(3, 1, {
            prop: 'amount',
            label: 'Holdings',
        });
        tableHeadingsList.splice(0, 1);
    }

    const TableHeading = ({ prop, label }) => {
        return (
            <th onClick={() => handleSort(prop)} data-testid={`sort-${prop}`}>
                <div>
                    {label}
                    {currentSort.heading === prop && currentSort.icon && (
                        <FontAwesomeIcon icon={currentSort.icon} />
                    )}
                </div>
            </th>
        );
    };

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {assetList.length > 0 ? (
                <table className="asset-table" data-testid="asset-table">
                    <thead>
                        <tr>
                            {tableHeadingsList.map((heading, index) => {
                                return (
                                    <TableHeading
                                        key={index}
                                        prop={heading.prop}
                                        label={heading.label}
                                    />
                                );
                            })}
                            {favourites && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {[...assetList].sort(currentSort.fn).map((asset, index) => {
                            return (
                                <tr key={index}>
                                    {!portfolio && (
                                        <td>
                                            <div>{asset.market_cap_rank}</div>
                                        </td>
                                    )}
                                    <td>
                                        <AssetName asset={asset} />
                                    </td>
                                    <td>
                                        <AssetPrice asset={asset} currency={currency.symbol} />
                                    </td>
                                    {portfolio ? (
                                        <td>
                                            <AssetHoldings
                                                asset={asset}
                                                currency={currency.symbol}
                                            />
                                        </td>
                                    ) : (
                                        <td>
                                            <div>{compactNumber(asset.market_cap)}</div>
                                        </td>
                                    )}
                                    {favourites && (
                                        <td>
                                            <FavouritesButton
                                                asset={asset}
                                                refreshed={refreshed}
                                                refreshPage={refreshPage}
                                            />
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <InfoPage
                    title="Woops! Nothing here!"
                    message="It looks like you haven't added anything yet."
                    icon={faQuestionCircle}
                />
            )}
        </div>
    );
};
