/**
 * Main antry point of the app
 */


// now setup handlers so we can fire open/closed/all
document.getElementById('showOpen').addEventListener('click', (e) => {showTrailsByStatus('Open')});
document.getElementById('showClosed').addEventListener('click',(e) => {showTrailsByStatus('Closed')});
// start by showing closed trails...
showTrailsByStatus('Closed');
// showLoryStatus ();
