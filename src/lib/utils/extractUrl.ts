import urlRegexSafe from 'url-regex-safe';
import VALID_URL from '../regex/validUrl';

const extractUrl = (text: string) => {
  const urls = text.match(urlRegexSafe());

  if (urls === null) {
    return null;
  }

  const url = urls[0];

  if (url.match(VALID_URL) === null) {
    return null;
  }

  return url;
};

export default extractUrl;
