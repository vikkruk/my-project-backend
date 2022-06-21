declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_DB_CONNECTION_URL: string | undefined;
      REACT_APP_TOKEN_SECRET: string | undefined;
    }
  }
}

export { };
