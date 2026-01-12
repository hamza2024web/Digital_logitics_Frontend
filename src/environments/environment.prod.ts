export const environment = {
  production: true,
  apiBaseUrl: 'https://api.domaine.com',  // URL production (à changer plus tard)

  tokenKey: 'access_token',
  refreshTokenKey: 'refresh_token',
  tokenRefreshInterval: 840000,

  cutoffHour:  15,
  reservationTTL: 24,

  defaultPageSize: 20,
  maxPageSize: 100
};
