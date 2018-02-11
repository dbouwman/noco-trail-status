
/**
 * Simple map used to standardize the
 * fields from the two services
 */
let fieldMap = {
  FNAME: 'TRAILNAME',
  PROPNAME: 'LOCATION',
  NATNAME: 'LOCATION'
}


/**
 * Depending on the state, tweak the query...
 */
function getFortCollinsData (state) {
  let serviceUrl = 'https://gisweb.fcgov.com/ArcGIS/rest/services/TrailStatus/MapServer/0/query';
  // let fields = '*';
  let fields = 'FNAME,STATUS,NATNAME,MANAGER,EDIT_BY,EDIT_DATE';
  return getAGSData(serviceUrl, fields, `(BIKEUSE = 'Yes') AND (STATUS = '${state}')`);
}

function getLarimerData (state) {
  let serviceUrl = 'https://gisweb.fcgov.com/ArcGIS/rest/services/TrailStatus/MapServer/1/query';
  let fields = 'FNAME,STATUS,LOCATION,MANAGER,EDIT_BY,EDIT_DATE';
  let where = 'STATUS IS null';
  switch (state) {
    case 'Open':
      where = `STATUS = '${state}'`;
      break;
  }
  return getAGSData(serviceUrl, fields,  where);
}

/**
 * Aggregate the fort collins data into
 * [{area: <name>, trails: [{name, status, updated, }]]
 * trails are sorted by name
 */
function aggregate (rows) {
  let tracker = [];
  let trails = rows.reduce((acc, f) => {
    // if any part of a trail meets the criteria, we use it
    if (f.TRAILNAME.indexOf('NONE') === -1 && tracker.indexOf(f.TRAILNAME) === -1) {
      // null status === Closed...
      if (!f.STATUS) {
        f.STATUS = 'Closed';
      }
      tracker.push(f.TRAILNAME);
      acc.push(f);
    }
    return acc;
  }, []);

  // group by location...
  let propTrails = groupByProperty(trails, 'LOCATION');
  // now sort the trails in each prop...
  // and sort the props...
  let all = propTrails.map((e) => {
    e.entries = sortBy('TRAILNAME', e.entries);
    return e;
  });
  return sortBy('group',all);
}


/**
 * Create rows, and stuff into the table
 */
function display (areas) {
  let areaHtml = areas.map(getAreaHtml).join('');
  document.getElementById('trails').innerHTML = areaHtml;
}

function getAreaHtml (area) {
  let trails = getTrails(area.entries).join('');
  return `<h3>${area.group}</h3>
          <table class="table table-striped">
            <tbody>
              ${trails}
            </tbody>
          </table>`;
}

function getTrails (trails) {
  return trails.map((t) => {
    return `<tr><td>${t.TRAILNAME}</td><td>${t.STATUS}</td></tr>`;
  });
}



/**
 * Show a loading message...
 */
function showLoading () {
   document.getElementById('trails').innerHTML = '<div class="spinner"></div>';
}
/**
 * Main action handler for non-Lory
 */
function showTrailsByStatus (status) {
  showLoading();
  let rawTrailData = []
  getFortCollinsData(status)
    .then((result) => {
      rawTrailData = result.features;
      return getLarimerData(status);
    })
    .then((lory) => {
      rawTrailData = rawTrailData.concat(lory.features);
      // flatten it all...
      let flat = rawTrailData.map(flattenAttr.curry('attributes'));
      let mapped = remapFields(flat, fieldMap);
      let rows = aggregate(mapped);
      display(rows);
    })
    .catch((err) => {
      console.log(err);
    });
}
