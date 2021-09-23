import React, { useState } from 'react';
import { isPositive, normalizeNumber } from '../../Utils/helpers';
import { AssetTable } from '../AssetTable/AssetTable';
import { Button } from '../Button/Button';
import { Deposit } from '../Deposit/Deposit';
import { PieChart } from '../PieChart/PieChart';
import { ValueChangePercent } from '../ValueChangePercent/ValueChangePercent';
import './Portfolio.scss';

export const Portfolio = () => {
    const [depositScreen, toggleDepositScreen] = useState(false);
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'usd',
        label: 'USD - $',
        symbol: '$',
    };
    const holdings = JSON.parse(localStorage.getItem('holdings')) || [];
    const oldBalance = JSON.parse(localStorage.getItem('portfolioBalance')) || 0;
    const currentBalance =
        holdings.length > 0
            ? holdings.map((asset) => Number(asset.amount.usd)).reduce((a, b) => a + b)
            : 0;
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
    localStorage.setItem('portfolioBalance', currentBalance.toFixed(2));

    const pieData =
        holdings.length > 0 &&
        holdings.map((asset) => {
            return { x: asset.name, y: (asset.amount.usd / currentBalance) * 100 };
        });

    return (
        <div className="portfolio" data-testid="portfolio">
            {depositScreen ? (
                <Deposit close={() => toggleDepositScreen(false)} />
            ) : (
                <>
                    <h2 className="page-title">Your Portfolio</h2>
                    <div className="portfolio__header">Current Balance</div>
                    <div className="balance">
                        <div>
                            <span>
                                {currency.symbol}
                                {normalizeNumber(currentBalance)}
                            </span>
                            {oldBalance ? (
                                <ValueChangePercent changeValue={balanceChangePercent} />
                            ) : (
                                ''
                            )}
                        </div>
                        <Button label="Deposit" onClick={() => toggleDepositScreen(true)} />
                    </div>
                    <div
                        className={`balance-change ${balanceChangeClass}`}>{`${balanceChange} (24h)`}</div>
                    {holdings.length > 0 ? (
                        <>
                            <PieChart data={pieData} />
                            <h3>Your Assets</h3>
                            <AssetTable holdings={holdings} />
                        </>
                    ) : (
                        <div>No assets found</div>
                    )}
                </>
            )}
        </div>
    );
};
