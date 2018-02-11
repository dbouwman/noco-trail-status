/**
 * Lory uses OData from SharePoint... ugh
 * So - this *almost* works, except the server does not support CORS
 * and the free proxies I found don't forward headers. At some point I'll
 * build out a proxy in node that does forward the headers... till then,
 * this does nothing
 */
function getLoryStatus () {
  let url = 'http://cors-proxy.htmldriven.com/?url=http://cpw.state.co.us/placestogo/parks/_api/web/lists/getbytitle(\'Park%20AllParks\')/items?$filter=Park_x0020_Name%20eq%20%27Lory%27%20';
  let options = {
    method: 'GET',
    headers: new Headers({
      Accept: 'application/json; odata=verbose'
    })
  };
  return fetch(url, options)
  .then((response) => response.json())
  .then((odata) => {
    const regex = /\<strong\>(.*)\<\/strong\>/g;
    debugger;
    // dig out the thing we want...
    let alert = odata.d.results.reduce((acc, entry) => {
      if (entry['Alert_x0020_Description']) {
        // extract the message
        let m = regex.exec(entry['Alert_x0020_Description'])[1];
        acc = {
          description: m,
          show: entry['Show_x0020_Alert_x0020_Descripti'],
          updated: entry['Modified']
        }
      }
      return acc;
    }, null);

    return alert;
  })
  .catch((err) => {
    console.error(`Error fetching Lory data: ${err}`);
  });
}

/**
 * Show the Lory Status
 */
function showLoryStatus () {
  getLoryStatus()
    .then((alert) => {
      if (alert) {
        document.getElementById('lory').innerHTML = alert.description;
      } else {
        document.getElementById('lory').innerHTML = '<p>No alerts found for Lory. Presumed Open.</p>';
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
