export const getMarketDataMessage = (
  instrumentId: string,
  subscribe = true
) => ({
  type: 'l1-subscription',
  id: '1',
  instrumentId,
  provider: 'simulation',
  subscribe,
  kinds: ['ask', 'bid', 'last'],
});
