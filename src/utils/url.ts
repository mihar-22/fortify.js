export type QueryParameterValue = string | boolean | number;

export type QueryParameter = undefined | QueryParameterValue | QueryParameterValue[];

export type Params = Record<string, QueryParameter>;

export const serializeQueryString = (params: Params) => {
  const qs: string[] = [];

  const appendQueryParam = (param: string, v: QueryParameterValue) => {
    qs.push(`${encodeURIComponent(param)}=${encodeURIComponent(v)}`);
  };

  Object.keys(params).forEach((param) => {
    const value = params[param];
    if (typeof value === 'undefined' || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((v) => appendQueryParam(param, v));
    } else {
      appendQueryParam(param, value);
    }
  });

  return qs.join('&');
};

export const appendQueryStringToUrl = (url: string, qs: string) => {
  if (!qs) return url;
  const mainAndQuery = url.split('?', 2);
  return mainAndQuery[0] + (mainAndQuery[1] ? `?${mainAndQuery[1]}&${qs}` : `?${qs}`);
};

export const addQueryParamsToUrl = (
  url: string,
  params: Params,
) => appendQueryStringToUrl(url, serializeQueryString(params));
