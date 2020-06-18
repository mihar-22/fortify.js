import fetchMock, { FetchMockSandbox } from 'fetch-mock';
import { HttpClient } from './HttpClient';

export type FakeHttpClient = FetchMockSandbox;

// @ts-ignore
export const buildFakeHttpClient: () => HttpClient = () => fetchMock.sandbox();
