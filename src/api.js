const URL = 'http://api.timezonedb.com/';

export async function doApiGet(urlPath) {
  console.log('doApiGet', urlPath);
  const url = URL+urlPath;
  console.log('doApiGet URL', url);
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
