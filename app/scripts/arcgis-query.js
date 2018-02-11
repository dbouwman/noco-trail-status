/**
 * Fetch data from an arcgis server
 */
function getAGSData(serviceUrl, fields, where) {
  let params = {
    outFields: fields,
    returnGeometry: false,
    where: where
  };
  // urlify this...
  let url = `${serviceUrl}?f=json&${encodeForm(params)}`;
  return fetch(url)
  .then((response) => {
    return response.json();
  })
  .catch((err) => {
    console.error(`Error fetching ${err}`);
  })
}

/**
 * Encode an object into a query string
 */
function encodeForm (form = {}) {
   if (typeof form === 'string') { return form; }

   return Object.keys(form).reduce((acc, key) => {
     if ((form[key])) {
       acc.push([key, form[key]].map(encodeURIComponent).join('='));
     }
     return acc;
   }, []).join('&');
}
