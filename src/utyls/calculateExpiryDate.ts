export const calculateExpiryDate = (timestamp: number) => {
    const expiryDate = new Date(timestamp + 24 * 60 * 60 * 1000);
    return expiryDate.toLocaleDateString('un-US', { month: 'short', day: 'numeric' });
};