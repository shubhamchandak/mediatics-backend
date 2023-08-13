declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            NODE_ENV: 'development' | 'production';
            DB_HOST: string;
            DB_PORT: number;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_NAME: string;
        }
    }
}

export {};