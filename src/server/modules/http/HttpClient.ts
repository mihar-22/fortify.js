import fetch from 'node-fetch';

export type HttpClient = (
  url: fetch.RequestInfo,
  init?: fetch.RequestInit
) => Promise<fetch.Response>;

export const buildHttpClient: () => HttpClient = () => fetch;
