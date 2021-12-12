import React from 'react';
import { compactNumber } from '../../Utils/helpers.js';
import './MarketStats.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-regular-svg-icons';

export const MarketStats = ({ asset }) => {
    const currency = JSON.parse(localStorage.getItem('currency')).symbol || '$';

    const stats = [
        {
            label: 'Market Cap',
            value: asset.market_cap,
        },
        {
            label: '24h Volume',
            value: asset.total_volume,
        },
        {
            label: 'All Time High',
            value: asset.ath,
        },
        {
            label: 'All Time Low',
            value: asset.atl,
        },
        {
            label: 'Market Rank',
            value: `#${asset.market_cap_rank}`,
            formatNumber: false,
        },
    ];

    // coingecko doesn't have these props for all coins for whatever reason,
    // and they're inaccurate, will change API later
    if (asset.total_supply) {
        stats.push({
            label: 'Circulating Supply',
            value: `${compactNumber(asset.total_supply)} ${asset.symbol.toUpperCase()}`,
            formatNumber: false,
        });
    }

    if (asset.max_supply) {
        stats.push({
            label: 'Max Supply',
            value: `${compactNumber(asset.max_supply)} ${asset.symbol.toUpperCase()}`,
            formatNumber: false,
        });
    }

    return (
        <div className="foreground-panel market-stats" data-testid="market-stats">
            <header>
                <FontAwesomeIcon icon={faChartBar} />
                <h3>Market Stats</h3>
            </header>
            {stats.map((item, index) => {
                return (
                    <div key={index}>
                        <h4>{item.label}</h4>
                        <p>
                            {item.formatNumber
                                ? `${currency}${item.value.toLocaleString()}`
                                : item.value}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};
