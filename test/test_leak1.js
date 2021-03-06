'use strict';

var cl = require("../lib/opencl");

try {
  var memwatch = require('memwatch-next');

  memwatch.on('stats', function(stats) {
    console.info("mem: "+stats.estimated_base+" B trend: "+(stats.usage_trend>0 ? '+' : (stats.usage_trend>0 ? '-' : '=')));
  });
    
} catch (e) {
  console.error('No memwatch support in node12', e);
}

process.on('exit', function dump() {
  global.gc();
  console.info("Exit.");
});

var i=0;

var ctx = cl.createContextFromType(
 [cl.CONTEXT_PLATFORM, cl.getPlatformIDs()[0]], cl.DEVICE_TYPE_GPU, null, null);

global.gc();
while (i++ < 1000) {
  var ev = cl.createUserEvent(ctx);
  cl.releaseEvent(ev);
  global.gc();
}

// === another test ===
//
// function tick() {
//   global.gc();
//   var ev = cl.createUserEvent(ctx);
//   cl.releaseEvent(ev);
//   global.gc();
//   if(i++ < 1000) setTimeout(tick,10);
// };

// var ctx = cl.createContextFromType(
//  [cl.CONTEXT_PLATFORM, cl.getPlatformIDs()[0]], cl.DEVICE_TYPE_CPU, null, null);

// global.gc();
// tick();
