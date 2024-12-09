export const formatPrice = (price: number): string => {
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'code', // Zmenené na zobrazenie kódu meny
    });
    return USDollar.format(price).replace('USD', '').trim() + ' $';
};