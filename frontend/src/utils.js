
/**
 * Fetch HTTP resources that return JSON.
 * @param {string} url
 * @param {Object} options
 * @returns
 */
export const request = async (url, options = { method: 'GET' }) => {
  return await fetch(url, options)
    .then((resStream) => {
      if (resStream.ok) {
        const contentType = resStream.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return resStream.json();
        } else {
          return resStream.text();
        }
      } else {
        throw Error(`${resStream.status} (${resStream.statusText})`);
      }
    });
};