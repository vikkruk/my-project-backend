declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_USER_KEY_IN_LOCAL_STORAGE: string;
      REACT_APP_ADMIN_KEY_IN_LOCAL_STORAGE: string;
      REACT_APP_API_SERVER: string;
      REACT_APP_DB_CONNECTION_URL: string | undefined;
      REACT_APP_TOKEN_SECRET: string | undefined;
    }
  }
}

export { };
