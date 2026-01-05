export const environment = {
  production : false,
  apiBaseUrl : 'http://localhost:8083',

  tokenKey : 'access_token',
  refreshTokenKey : 'refresh_token',
  tokenRefreshInterval : 840000,

  cutoffHour : 15,
  reservationTTL : 24,

  defaultPageSize : 20,
  maxPageSize : 100
}
