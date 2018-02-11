/**
 * helpers.js
 * A mess of functional-style helpers
 */
 
/**
 * Sort an array by a property name
 */
function sortBy (propName, arry) {
  return arry.sort((a,b) => {
    if (a[propName] > b[propName]) return 1;
    if (a[propName] < b[propName]) return -1;
    return 0;
  });
}

/**
 * Group array entries by a prop name
 */
function groupByProperty (items, propName) {
  let tracker = [];
  let result = items.reduce((acc, entry) => {
    // do we have this in the tracker?
    if (tracker.indexOf(entry[propName]) === -1) {
      // add to tracker...
      tracker.push(entry[propName]);
      // create entry in output
      acc.push({group: entry[propName], entries: [entry]});
    } else {
      // it's in the acc, so get it and push the
      let group = findBy(acc, 'group', entry[propName]);
      group.entries.push(entry);
    }
    return acc;
  }, []);
  return result;
}

/**
 * Find entry in array by prop val
 */
function findBy (arr, prop, val) {
  let result = arr.reduce((acc, entry) => {
    if (entry[prop] === val) {
      acc = entry;
    }
    return acc;
  }, null);
  return result;
}

/**
 * Flatten to remove one level
 */
function flattenAttr (propName, entry) {
  return entry[propName];
}

/**
 * Aggregate the fort collins data into
 * [{area: <name>, trails: [{name, status, updated, }]]
 * trails are sorted by name
 */
function remapFields (rows, fieldMap) {
  let std = rows.map((r) => {
    // rename the props...
    Object.keys(fieldMap).forEach((e) => {
      if(r.hasOwnProperty(e)) {
        r[fieldMap[e]] = r[e];
        delete r[e];
      }
    });
    return r;
  });
  return std;
}
