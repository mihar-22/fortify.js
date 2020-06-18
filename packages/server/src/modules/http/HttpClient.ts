import fetch from 'node-fetch';

export type HttpClient = typeof fetch;

export const buildHttpClient: () => HttpClient = () => fetch;
