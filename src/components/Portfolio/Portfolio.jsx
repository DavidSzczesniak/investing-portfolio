import React from 'react';
import { isPositive, normalizeNumber } from '../../Utils/helpers';
import { AssetTable } from '../AssetTable/AssetTable';
import { Button } from '../Button/Button';
import { ValueChangePercent } from '../ValueChangePercent/ValueChangePercent';
import './Portfolio.scss';

export const Portfolio = () => {
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'usd',
        label: 'USD - $',
        symbol: '$',
    };
    const currentBalance = 15949.31;
    const oldBalance = 1812.19;
    let balanceChange = currentBalance && currentBalance - oldBalance;
    let balanceChangeClass = 'positive';
    const balanceChangePercent = balanceChange && (balanceChange / oldBalance) * 100;

    if (isPositive(balanceChange)) {
        balanceChange = `+${currency.symbol}${normalizeNumber(balanceChange)}`;
    } else {
        // get rid of the minus sign with Math.abs because it needs to go before the currency symbol
        balanceChange = `-${currency.symbol}${normalizeNumber(Math.abs(balanceChange))}`;
        balanceChangeClass = 'negative';
    }

    return (
        <div className="portfolio" data-testid="portfolio">
            <h2 className="page-title">Your Portfolio</h2>
            <div className="portfolio__header">Current Balance</div>
            <div className="balance">
                <div>
                    <span>
                        {currency.symbol}
                        {normalizeNumber(currentBalance)}
                    </span>
                    {oldBalance ? <ValueChangePercent changeValue={balanceChangePercent} /> : ''}
                </div>
                <Button label="Deposit" />
            </div>
            <div className={`balance-change ${balanceChangeClass}`}>{`${balanceChange} (24h)`}</div>
            <h3>Your Assets</h3>
            <AssetTable holdings />
        </div>
    );
};
