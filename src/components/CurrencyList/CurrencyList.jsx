import { faTimes } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { Button } from '../Button/Button';
import './CurrencyList.scss';

export const CurrencyList = ({ refreshApp, refreshed, close }) => {
    const allCurrencies = [
        {
            value: 'USD',
            label: 'United States Dollar',
            symbol: '$',
            icon: { code: 'US', label: 'United States flag' },
        },
        {
            value: 'GBP',
            label: 'British Pound Sterling',
            symbol: '£',
            icon: { code: 'GB', label: 'Great Britain flag' },
        },
        {
            value: 'EUR',
            label: 'Euro',
            symbol: '€',
            icon: { code: 'EU', label: 'European Union flag' },
        },
        {
            value: 'CAD',
            label: 'Canadian Dollar',
            symbol: '$',
            icon: { code: 'CA', label: 'Canada flag' },
        },
    ];
    const selectedCurrency = JSON.parse(localStorage.getItem('currency')).value || 'USD';

    function changeCurrency(selectedCurrency) {
        localStorage.setItem('currency', JSON.stringify(selectedCurrency));
        refreshApp(!refreshed);
        close();
    }

    return (
        <div className="currency-list">
            <div className="page-header">
                <h2 className="title">Select Currency</h2>
                <Button icon={faTimes} onClick={close} ariaLabel="close" iconSize="2x" />
            </div>
            <ul>
                {allCurrencies.map((currency, index) => {
                    const isSelected = selectedCurrency === currency.value;
                    return (
                        <li
                            key={index}
                            onClick={() => changeCurrency(currency)}
                            className={isSelected ? 'selected' : ''}>
                            <ReactCountryFlag
                                countryCode={currency.icon.code}
                                style={{
                                    fontSize: '2rem',
                                    lineHeight: '2rem',
                                }}
                                aria-label={currency.icon.label}
                            />
                            <p>
                                <strong>{currency.label}</strong>
                            </p>
                            <p>
                                {currency.value} - {currency.symbol}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
