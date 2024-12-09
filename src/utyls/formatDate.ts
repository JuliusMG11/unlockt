export const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('un-US', { month: 'short', day: 'numeric' });
};