# noco-trail-status

Mountain bike trail status app.

Literally the simplest code that works. Zero framework. ES6. Functional in parts. It's not pretty, but it is fast.

The goal was to make a fast-loading app that shows the Open/Closed status of trails in Northern Colorado. While there is a cool map-centric application put out by the City of Fort Collins, that app downloads > 6MB of javascript and takes ~30 second to open on Wifi. It's virtually un-usable over 3G. Thus, I build this app. It uses the same backing ArcGIS Server services so it shows the same data. But it loads in less than a second over 3G.

## Install & Run

```
> git clone https://github.com/dbouwman/noco-trail-Status
> npm i && bower i
> gulp serve
```

Pull-requests accepted and appreciated!
