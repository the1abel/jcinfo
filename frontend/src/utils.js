
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
        return resStream.json();
      } else {
        throw Error(`${resStream.status} (${resStream.statusText})`);
      }
    });
};