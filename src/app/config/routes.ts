export enum FINCHARTS_ROUTES {
  GET_TOKEN = `/identity/realms/fintatech/protocol/openid-connect/token`,
  INSTRUMENTS_LIST = `/api/instruments/v1/instruments?provider=oanda&kind=forex`,
  HISTORY = `/api/bars/v1/bars/count-back`,
}
