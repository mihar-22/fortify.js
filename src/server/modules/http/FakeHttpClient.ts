import fetchMock from 'fetch-mock';
import { HttpClient } from './HttpClient';

export type FakeHttpClient = typeof fetchMock;

// @ts-ignore
export const buildFakeHttpClient: () => HttpClient = () => fetchMock.sandbox();
