import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { AssetTable } from './AssetTable';

const mockAssets = [
    {
        current_price: 45439,
        id: 'bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
        name: 'Bitcoin',
        price_change_percentage_24h: 6.26545,
        symbol: 'btc',
        amount: 1.23241,
        market_cap: 936138663659,
        market_cap_rank: 1,
    },
    {
        current_price: 4168.23,
        id: 'ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
        name: 'Ethereum',
        price_change_percentage_24h: 3.40572,
        symbol: 'eth',
        amount: 1.23241,
        market_cap: 496329594700,
        market_cap_rank: 2,
    },
];

const renderComponent = ({ portfolio = false, favourites = false }) => {
    const component = render(
        <AssetTable assets={mockAssets} portfolio={portfolio} favourites={favourites} />
    );
    const firstAsset = component.getAllByTestId('asset-name')[0];
    function clickSort(id = 'market_cap_rank') {
        fireEvent.click(component.getByTestId(`sort-${id}`));
    }

    return { firstAsset, clickSort, ...component };
};

function getSortIcon(name) {
    return document.getElementsByClassName(name)[0];
}

describe('standard layout', () => {
    it('renders with basic props', async () => {
        const { getByTestId, queryByText, queryByTestId, getAllByTestId } = renderComponent({});

        getByTestId('asset-table');
        // doesn't render holdings and favourites if props weren't passed
        expect(queryByText('Holdings')).toBeFalsy();
        expect(queryByTestId('favourites-btn')).toBeFalsy();
        // renders rows based on mock data
        expect(getAllByTestId('asset-name')).toHaveLength(mockAssets.length);
    });
});

describe('portfolio layout', () => {
    it('renders holdings column', async () => {
        const { getByText } = renderComponent({ portfolio: true });

        getByText('Holdings');
    });

    it("doesn't render Market Cap or rank columns", async () => {
        const { queryByText } = renderComponent({ portfolio: true });

        expect(queryByText('Market Cap')).toBeFalsy();
        expect(queryByText('#')).toBeFalsy();
    });
});

describe('other', () => {
    it('renders favourites column if prop was passed', async () => {
        const { getAllByTestId } = renderComponent({ favourites: true });

        getAllByTestId('favourites-btn');
    });

    it('renders info page if no assets passed in', async () => {
        render(<AssetTable />);

        expect(document.getElementsByClassName('info-page')[0]).toBeInTheDocument();
    });
});

describe('sorting', () => {
    it('toggles icon on click', async () => {
        const { getByTestId, clickSort } = renderComponent({});
        // descending
        clickSort();
        expect(getByTestId('sort-market_cap_rank')).toContainElement(getSortIcon('fa-sort-down'));
        // ascending
        clickSort();
        expect(getByTestId('sort-market_cap_rank')).toContainElement(getSortIcon('fa-sort-up'));
        // default
        clickSort();
        expect(getByTestId('sort-market_cap_rank')).not.toContainElement(
            getSortIcon('svg-inline--fa')
        );
    });

    it('sorts by market cap rank (number)', async () => {
        const { clickSort, firstAsset } = renderComponent({});
        // descending
        clickSort();
        expect(firstAsset).toHaveTextContent(mockAssets[1].name);
        // ascending
        clickSort();
        expect(firstAsset).toHaveTextContent(mockAssets[0].name);
        // default
        clickSort();
        expect(firstAsset).toHaveTextContent(mockAssets[0].name);
    });

    it('sorts by name (string)', async () => {
        const { clickSort, firstAsset } = renderComponent({});
        // descending
        clickSort('name');
        expect(firstAsset).toHaveTextContent(mockAssets[1].name);
        // ascending
        clickSort('name');
        expect(firstAsset).toHaveTextContent(mockAssets[0].name);
        // default
        clickSort('name');
        expect(firstAsset).toHaveTextContent(mockAssets[0].name);
    });

    // special case as it uses two data points to calculate the sort order
    it('sorts by holdings (string - special case)', async () => {
        const { clickSort, firstAsset } = renderComponent({ portfolio: true });
        // descending
        clickSort('amount');
        expect(firstAsset).toHaveTextContent(mockAssets[0].name);
        // ascending
        clickSort('amount');
        expect(firstAsset).toHaveTextContent(mockAssets[1].name);
        // default
        clickSort('amount');
        expect(firstAsset).toHaveTextContent(mockAssets[0].name);
    });
});
