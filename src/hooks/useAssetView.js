import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { geckoAPI } from '../constants.js';
import { useApi } from './useApi.js';

export const useAssetView = () => {
    const query = new URLSearchParams(useLocation().search);
    const { data, loading } = useApi(`${geckoAPI}coins/${query.get('id')}`);
    const currency = JSON.parse(localStorage.getItem('currency')).value.toLowerCase() || 'usd';

    const asset = useMemo(() => {
        if (!data) {
            return null;
        }
        const marketData = data.market_data;

        return {
            id: data.id,
            name: data.name,
            symbol: data.symbol,
            current_price: marketData.current_price[currency],
            image: data.image.large,
            price_change_percentage_24h: marketData.price_change_percentage_24h,
            market_cap: marketData.market_cap[currency],
            total_volume: marketData.total_volume[currency],
            ath: marketData.ath[currency],
            atl: marketData.atl[currency],
            market_cap_rank: data.market_cap_rank,
            ...(marketData.total_supply && {
                total_supply: marketData.total_supply,
            }),
            ...(marketData.max_supply && { max_supply: marketData.max_supply }),
        };
    }, [currency, data]);

    return { asset, loading };
};
