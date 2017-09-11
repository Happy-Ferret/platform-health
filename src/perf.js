import Router from 'koa-router';
import { median, quantile } from 'simple-statistics';
import moment from 'moment';
import { stringify } from 'query-string';
import fetchJson from './fetch/json';

export const router = new Router();

router
  .get('/herder', async (ctx) => {
    const { signatures, framework } = ctx.request.query;

    const data = await fetchJson(
      `https://treeherder.mozilla.org/api/project/mozilla-central/performance/data/?${stringify({
        framework: framework != null ? framework : 1,
        interval: 31536000,// / 12 * 3,
        signatures: signatures,
      })}`,
      { ttl: 'day' },
    );
    ctx.body = signatures.map((current) => {
      if (!data[current]) {
        console.error('Could not load %s', current);
        return null;
      }
      const series = data[current].reduce((reduced, entry) => {
        const date = moment(entry.push_timestamp * 1000).format('YYYY-MM-DD');
        let found = reduced.find(needle => needle.date === date);
        if (!found) {
          found = {
            runs: [],
            value: entry.value,
            avg: entry.value,
            date: date,
          };
          reduced.push(found);
        }
        found.runs.push({
          time: entry.push_timestamp,
          value: entry.value,
        });
        return reduced;
      }, []);
      series.forEach((serie) => {
        serie.value = median(serie.runs.map(entry => entry.value));
        serie.time = median(serie.runs.map(entry => entry.time));
      });
      const runs = series.reduce((all, entry) => {
        return all.concat(entry.runs);
      }, []);
      // const md = median(values);
      // const sd = standardDeviation(values);
      const slice = 60 * 60 * 24 * 7;
      series.forEach((entry) => {
        const now = entry.runs[0].time;
        const sliced = runs
          .filter((check) => {
            return check.time > now - slice && check.time < now + slice;
          })
          .map(check => check.value);
        entry.avg = median(sliced);
        entry.q1 = quantile(sliced, 0.75);
        entry.q3 = quantile(sliced, 0.25);
      });
      return series;
    });
  });
