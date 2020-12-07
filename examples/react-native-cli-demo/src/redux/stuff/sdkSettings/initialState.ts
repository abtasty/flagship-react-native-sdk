export default {
  envId: 'bn1ab7m56qolupi5sa0g',
  apiKey: 'M2FYdfXsJ12tjJQuadw7y9DZojqNGBvecpjGXY93',
  visitorId: 'test-visitor-reana-qa',
  isAuthenticated: false,
  visitorContext: [
    {
      key: 'isEvil',
      value: false,
      type: 'boolean',
    },
    {
      key: 'isAwesome',
      value: false,
      type: 'boolean',
    },
  ],
  fetchNow: true,
  decisionMode: 'API',
  pollingInterval: 60, // seconds
  timeout: 2, // seconds
  activateNow: false,
  enableConsoleLogs: true,
  enableClientCache: true,
  enableErrorLayout: false,
  nodeEnv: 'production',
  flagshipApi: 'https://decision.flagship.io/v2/',
};
