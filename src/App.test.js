import { doApiGet } from './api';

describe('loadTimezones', () => {
  it('should load timezones from server', () => {
    doApiGet('v2.1/list-time-zone?key=XWSLLPX5RMIZ&format=json&zone=Europe/*')
    .then((data) => {
      expect(data.length).toEqual(60);
    });
  })
})

describe('loadTime', () => {
  it('should load time from server', () => {
    doApiGet('v2/get-time-zone?key=XWSLLPX5RMIZ&format=json&by=zone&zone=Europe/London')
    .then((data) => {
      expect(data.countryName).toEqual('United Kingdom');
      done();
    });
  })
})
