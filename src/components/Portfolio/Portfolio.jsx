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
        value: 'USD',
        label: 'United States Dollar',
        symbol: '$',
    };
    // create list of owned assets with up-to-date prices and amounts owned
    const assets = JSON.parse(localStorage.getItem('assetList'))?.list || [];
    const ownedAssets = JSON.parse(localStorage.getItem('holdings')) || [];
    const findOwnedAsset = (asset) => ownedAssets.find((owned) => owned.id === asset.id);
    const portfolioAssets = assets
        // filter assets by owned status
        .filter((asset) => findOwnedAsset(asset))
        // add amounts owned to the new asset list
        .map((asset) => {
            asset.amount = findOwnedAsset(asset).amount;
            asset.color = findOwnedAsset(asset).color;
            return asset;
        });

    // calculate porfolio balance
    const getAssetTotal = (asset) => asset.amount * asset.current_price;
    const oldBalance = JSON.parse(localStorage.getItem('portfolioBalance')) || 0;
    const currentBalance =
        portfolioAssets.length > 0
            ? portfolioAssets.map((asset) => getAssetTotal(asset)).reduce((a, b) => a + b)
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
        portfolioAssets.length > 0 &&
        portfolioAssets.map((asset) => {
            return {
                title: asset.name,
                value: (getAssetTotal(asset) / currentBalance) * 100,
                color: asset.color,
            };
        });

    return (
        <div className="portfolio" data-testid="portfolio">
            {depositScreen ? (
                <Deposit close={() => toggleDepositScreen(false)} />
            ) : (
                <>
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
                    {portfolioAssets.length > 0 ? (
                        <div className="portfolio__content">
                            <PieChart data={pieData} />
                            <div>
                                <h3 style={{ maxWidth: '60rem', marginInline: 'auto' }}>
                                    Your Assets
                                </h3>
                                <AssetTable assets={portfolioAssets} portfolio />
                            </div>
                        </div>
                    ) : (
                        <div>No assets found</div>
                    )}
                </>
            )}
        </div>
    );
};
