import fetch from 'node-fetch';
import moment from 'moment';

const defaultTtl = moment.duration(8, 'hours').as('seconds');

const devCache = {};

export default async function fetchText(
  url,
  { ttl = defaultTtl, headers = {}, method = 'get' } = {},
) {
  const key = `cache:${url}`;
  if (typeof ttl === 'string') {
    ttl = moment.duration(1, ttl).as('seconds');
  }
  const cached = devCache[key];
  if (cached) {
    return cached;
  }
  const response = await fetch(url, { method, headers });
  if (!response.ok) {
    // console.error(`Response for ${url} not OK: ${response.status}`);
    return null;
  }
  const text = await response.text();
  devCache[key] = text;
  return text;
}
