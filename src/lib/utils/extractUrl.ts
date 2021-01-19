import urlRegex from 'url-regex';
import VALID_URL from '../regex/validUrl';

const extractUrl = (text: string) => {
  const urls = text.match(urlRegex());

  if (urls === null) {
    return null;
  }

  const url = urls[0];

  if (url.match(VALID_URL) === null) {
    return null;
  }

  console.log(url);

  return url;
};

export default extractUrl;
