!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.__pixiTween=e()}(this,function(){"use strict";function t(e,n,o,r,s,h){for(var a in e)if(i(e[a]))t(e[a],n[a],o[a],r,s,h);else{var u=n[a],c=e[a]-n[a],p=r?s/r:1;o[a]=u+c*h(p)}}function e(t,n,o){for(var r in t)0===n[r]||n[r]||(i(o[r])?(n[r]={},e(t[r],n[r],o[r])):n[r]=o[r])}function i(t){return"[object Object]"===Object.prototype.toString.call(t)}if("undefined"==typeof PIXI)throw"PixiJS is required";var n={linear:function(){return function(t){return t}},inQuad:function(){return function(t){return t*t}},outQuad:function(){return function(t){return t*(2-t)}},inOutQuad:function(){return function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)}},inCubic:function(){return function(t){return t*t*t}},outCubic:function(){return function(t){return--t*t*t+1}},inOutCubic:function(){return function(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)}},inQuart:function(){return function(t){return t*t*t*t}},outQuart:function(){return function(t){return 1- --t*t*t*t}},inOutQuart:function(){return function(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)}},inQuint:function(){return function(t){return t*t*t*t*t}},outQuint:function(){return function(t){return--t*t*t*t*t+1}},inOutQuint:function(){return function(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)}},inSine:function(){return function(t){return 1-Math.cos(t*Math.PI/2)}},outSine:function(){return function(t){return Math.sin(t*Math.PI/2)}},inOutSine:function(){return function(t){return.5*(1-Math.cos(Math.PI*t))}},inExpo:function(){return function(t){return 0===t?0:Math.pow(1024,t-1)}},outExpo:function(){return function(t){return 1===t?1:1-Math.pow(2,-10*t)}},inOutExpo:function(){return function(t){return 0===t?0:1===t?1:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(2-Math.pow(2,-10*(t-1)))}},inCirc:function(){return function(t){return 1-Math.sqrt(1-t*t)}},outCirc:function(){return function(t){return Math.sqrt(1- --t*t)}},inOutCirc:function(){return function(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-2)*(t-2))+1)}},inElastic:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.1,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.4;return function(i){var n=void 0;return 0===i?0:1===i?1:(!t||t<1?(t=1,n=e/4):n=e*Math.asin(1/t)/(2*Math.PI),-t*Math.pow(2,10*(i-1))*Math.sin((i-1-n)*(2*Math.PI)/e))}},outElastic:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.1,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.4;return function(i){var n=void 0;return 0===i?0:1===i?1:(!t||t<1?(t=1,n=e/4):n=e*Math.asin(1/t)/(2*Math.PI),t*Math.pow(2,-10*i)*Math.sin((i-n)*(2*Math.PI)/e)+1)}},inOutElastic:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.1,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.4;return function(i){var n=void 0;return 0===i?0:1===i?1:(!t||t<1?(t=1,n=e/4):n=e*Math.asin(1/t)/(2*Math.PI),(i*=2)<1?t*Math.pow(2,10*(i-1))*Math.sin((i-1-n)*(2*Math.PI)/e)*-.5:t*Math.pow(2,-10*(i-1))*Math.sin((i-1-n)*(2*Math.PI)/e)*.5+1)}},inBack:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1.70158;return function(e){var i=t;return e*e*((i+1)*e-i)}},outBack:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1.70158;return function(e){var i=t;return--e*e*((i+1)*e+i)+1}},inOutBack:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1.70158;return function(e){var i=1.525*t;return(e*=2)<1?e*e*((i+1)*e-i)*.5:.5*((e-2)*(e-2)*((i+1)*(e-2)+i)+2)}},inBounce:function(){return function(t){return 1-n.outBounce()(1-t)}},outBounce:function(){return function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}},inOutBounce:function(){return function(t){return t<.5?.5*n.inBounce()(2*t):.5*n.outBounce()(2*t-1)+.5}}},o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r=(function(){function t(t){this.value=t}function e(e){function i(o,r){try{var s=e[o](r),h=s.value;h instanceof t?Promise.resolve(h.value).then(function(t){i("next",t)},function(t){i("throw",t)}):n(s.done?"return":"normal",s.value)}catch(t){n("throw",t)}}function n(t,e){switch(t){case"return":o.resolve({value:e,done:!0});break;case"throw":o.reject(e);break;default:o.resolve({value:e,done:!1})}(o=o.next)?i(o.key,o.arg):r=null}var o,r;this._invoke=function(t,e){return new Promise(function(n,s){var h={key:t,arg:e,resolve:n,reject:s,next:null};r?r=r.next=h:(o=r=h,i(t,e))})},"function"!=typeof e.return&&(this.return=void 0)}"function"==typeof Symbol&&Symbol.asyncIterator&&(e.prototype[Symbol.asyncIterator]=function(){return this}),e.prototype.next=function(t){return this._invoke("next",t)},e.prototype.throw=function(t){return this._invoke("throw",t)},e.prototype.return=function(t){return this._invoke("return",t)}}(),function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}),s=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),h=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)},a=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e},u=function(i){function u(t,e,i){r(this,u);var n=a(this,(u.__proto__||Object.getPrototypeOf(u)).call(this));return n.target=t,e&&n.addTo(e),n.clear(),i&&n.config(i),n}return h(u,i),s(u,[{key:"clear",value:function(){return this.easing=n.linear(),this.expire=!1,this.repeat=0,this.loop=!1,this.delay=0,this.pingPong=!1,this.path=null,this.pathReverse=!1,this.time=0,this.speed=1,this._active=!1,this._isStarted=!1,this._isEnded=!1,this._to={},this._from={},this._resetFromOnStart=!1,this._delayTime=0,this._elapsedTime=0,this._progress=0,this._repeat=0,this._pingPong=!1,this._pathFrom=0,this._pathTo=0,this._chainTween=null,this._resolvePromise=null,this}},{key:"config",value:function(t){return t&&"object"===(void 0===t?"undefined":o(t))?("object"===o(t.from)&&this.from(t.from),t.to&&"object"===o(t.to)&&this.to(t.to),"number"==typeof t.delay&&(this.delay=t.delay),t.easing&&("string"==typeof t.easing&&n[t.easing]?this.easing=n[t.easing]():"function"==typeof t.easing&&(this.easing=t.easing)),"boolean"==typeof t.expire&&(this.expire=t.expire),"boolean"==typeof t.loop&&(this.loop=t.loop),"object"===o(t.path)&&(this.path=t.path),"boolean"==typeof t.pathReverse&&(this.pathReverse=t.pathReverse),"boolean"==typeof t.pingPong&&(this.pingPong=t.pingPong),"number"==typeof t.repeat&&(this.repeat=t.repeat),"number"==typeof t.time&&(this.time=t.time),"number"==typeof t.speed&&(this.speed=t.speed),t.on&&"object"===o(t.on)&&("function"==typeof t.on.end&&this.on("end",t.on.end),"function"==typeof t.on.pingpong&&this.on("pingpong",t.on.pingpong),"function"==typeof t.on.repeat&&this.on("repeat",t.on.repeat),"function"==typeof t.on.start&&this.on("start",t.on.start),"function"==typeof t.on.stop&&this.on("stop",t.on.stop),"function"==typeof t.on.update&&this.on("update",t.on.update)),this):this}},{key:"addTo",value:function(t){return this.manager=t,this.manager.addTween(this),this}},{key:"remove",value:function(){return this.manager?(this.manager.removeTween(this),this):this}},{key:"start",value:function(t){return this._active=!0,this._isStarted=!1,this._resetFromOnStart&&(this._from={}),!this._resolvePromise&&t&&(this._resolvePromise=t),this}},{key:"startPromise",value:function(){var t=this;return Promise?this._resolvePromise?Promise.resolve():new Promise(function(e){t.start(e)}):this.start()}},{key:"stop",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return this._active=!1,this.emit("stop"),t&&this._end(),this}},{key:"to",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return this._to=t,this}},{key:"from",value:function(t){return t&&"object"===(void 0===t?"undefined":o(t))?(this._resetFromOnStart=!1,this._from=t):(this._resetFromOnStart=!0,this._from={}),this}},{key:"chain",value:function(t){return t||(t=new u(this.target)),this._chainTween=t,t}},{key:"reset",value:function(){if(this._elapsedTime=0,this._progress=0,this._repeat=0,this._delayTime=0,this._isStarted=!1,this._isEnded=!1,this.pingPong&&this._pingPong){var t=this._to,e=this._from;this._to=e,this._from=t,this._pingPong=!1}return this}},{key:"update",value:function(t){if(this._canUpdate()||!this._to&&!this.path)if(t*=this.speed,this.delay>this._delayTime)this._delayTime+=t;else{this._isStarted||(this._parseData(),this._isStarted=!0,this._isEnded=!1,this.emit("start"));var e=this.pingPong?this.time/2:this.time,i=void 0,n=void 0;if(e>=this._elapsedTime){var o=this._elapsedTime+t,r=o>=e;this._elapsedTime=r?e:o,this._apply(e);var s=this._pingPong?e+this._elapsedTime:this._elapsedTime;if(this._progress=Math.min(s/this.time,1),this.emit("update",this._progress,s),r){if(this.pingPong&&!this._pingPong)return this._pingPong=!0,i=this._to,n=this._from,this._from=i,this._to=n,this.path&&(i=this._pathTo,n=this._pathFrom,this._pathTo=n,this._pathFrom=i),this.emit("pingpong"),this._elapsedTime=0,void(this._progress=.5);if(this.loop||this.repeat>this._repeat)return++this._repeat,this.emit("repeat",this._repeat),this._elapsedTime=0,this._progress=0,void(this.pingPong&&this._pingPong&&(i=this._to,n=this._from,this._to=n,this._from=i,this.path&&(i=this._pathTo,n=this._pathFrom,this._pathTo=n,this._pathFrom=i),this._pingPong=!1));this._end()}}else;}}},{key:"_end",value:function(){if(this._isEnded=!0,this._active=!1,this.emit("end"),this._elapsedTime=0,this._chainTween)this._chainTween.manager||this._chainTween.addTo(this.manager),this._chainTween.start(this._resolvePromise),this._resolvePromise=null;else if(this._resolvePromise){var t=this._resolvePromise;this._resolvePromise=null,t()}}},{key:"_parseData",value:function(){if(!this._isStarted&&(e(this._to,this._from,this.target),this.path)){var t=this.path.totalDistance();this.pathReverse?(this._pathFrom=t,this._pathTo=0):(this._pathFrom=0,this._pathTo=t)}}},{key:"_apply",value:function(e){if(t(this._to,this._from,this.target,e,this._elapsedTime,this.easing),this.path){var i=this.pingPong?this.time/2:this.time,n=this._pathFrom,o=this._pathTo-this._pathFrom,r=i,s=i?this._elapsedTime/r:1,h=n+o*this.easing(s),a=this.path.getPointAtDistance(h);this.target.position.set(a.x,a.y)}}},{key:"_canUpdate",value:function(){return this._active&&this.target}},{key:"active",get:function(){return this._active}},{key:"elapsedTime",get:function(){return this._elapsedTime}},{key:"progress",get:function(){return this._progress}},{key:"isStarted",get:function(){return this._isStarted}},{key:"isEnded",get:function(){return this._isEnded}}]),u}(PIXI.utils.EventEmitter),c=function(){function t(){r(this,t),this.tweens=[],this._tweensToDelete=[],this._last=0}return s(t,[{key:"update",value:function(t){t||0===t||(t=this._getDeltaMS());for(var e=0;e<this.tweens.length;++e){var i=this.tweens[e];i.active&&i.update(t),i.isEnded&&i.expire&&i.remove()}if(this._tweensToDelete.length){for(var n=0;n<this._tweensToDelete.length;++n)this._remove(this._tweensToDelete[n]);this._tweensToDelete.length=0}}},{key:"getTweensForTarget",value:function(t){for(var e=[],i=0;i<this.tweens.length;++i)this.tweens[i].target===t&&e.push(this.tweens[i]);return e}},{key:"createTween",value:function(t,e){return new u(t,this,e)}},{key:"addTween",value:function(t){t&&(t.manager=this,this.tweens.push(t))}},{key:"removeTween",value:function(t){t&&this._tweensToDelete.push(t)}},{key:"_remove",value:function(t){var e=this.tweens.indexOf(t);-1!==e&&this.tweens.splice(e,1)}},{key:"_getDeltaMS",value:function(){0===this._last&&(this._last=Date.now());var t=Date.now(),e=t-this._last;return this._last=t,e}}]),t}(),p=function(){function t(){r(this,t),this.polygon=new PIXI.Polygon,this.polygon.closed=!1,this.currentPath=null,this.graphicsData=[],this.dirty=!0,this._closed=!1,this._tmpPoint=new PIXI.Point,this._tmpPoint2=new PIXI.Point,this._tmpDistance=[]}return s(t,[{key:"moveTo",value:function(t,e){return PIXI.Graphics.prototype.moveTo.call(this,t,e),this.dirty=!0,this}},{key:"lineTo",value:function(t,e){return PIXI.Graphics.prototype.lineTo.call(this,t,e),this.dirty=!0,this}},{key:"quadraticCurveTo",value:function(t,e,i,n){return PIXI.Graphics.prototype.quadraticCurveTo.call(this,t,e,i,n),this.dirty=!0,this}},{key:"bezierCurveTo",value:function(t,e,i,n,o,r){return PIXI.Graphics.prototype.bezierCurveTo.call(this,t,e,i,n,o,r),this.dirty=!0,this}},{key:"arcTo",value:function(t,e,i,n,o){return PIXI.Graphics.prototype.arcTo.call(this,t,e,i,n,o),this.dirty=!0,this}},{key:"arc",value:function(t,e,i,n,o,r){return PIXI.Graphics.prototype.arc.call(this,t,e,i,n,o,r),this.dirty=!0,this}},{key:"drawShape",value:function(t){return PIXI.Graphics.prototype.drawShape.call(this,t),this.dirty=!0,this}},{key:"clear",value:function(){return this.graphicsData.length=0,this.currentPath=null,this.polygon.points.length=0,this._closed=!1,this.dirty=!1,this}},{key:"parsePoints",value:function(){if(!this.dirty)return this;this.dirty=!1,this.polygon.points.length=0;for(var t=0;t<this.graphicsData.length;++t){var e=this.graphicsData[t].shape;e&&e.points&&(this.polygon.points=this.polygon.points.concat(e.points))}return this}},{key:"getPoint",value:function(t){this.parsePoints();var e=this.closed&&t>=this.length-1?0:2*t;return this._tmpPoint.set(this.polygon.points[e],this.polygon.points[e+1]),this._tmpPoint}},{key:"getPointAt",value:function(t){if(this.parsePoints(),t>this.length)return this.getPoint(this.length-1);if(t%1==0)return this.getPoint(t);this._tmpPoint2.set(0,0);var e=t%1,i=this.getPoint(Math.ceil(t)),n=i.x,o=i.y,r=this.getPoint(Math.floor(t)),s=r.x,h=r.y,a=-(s-n)*e,u=-(h-o)*e;return this._tmpPoint2.set(s+a,h+u),this._tmpPoint2}},{key:"distanceBetween",value:function(t,e){this.parsePoints();var i=this.getPoint(t),n=i.x,o=i.y,r=this.getPoint(e),s=r.x-n,h=r.y-o;return Math.sqrt(s*s+h*h)}},{key:"totalDistance",value:function(){this.parsePoints(),this._tmpDistance.length=0,this._tmpDistance.push(0);for(var t=this.length,e=0,i=0;i<t-1;++i)e+=this.distanceBetween(i,i+1),this._tmpDistance.push(e);return e}},{key:"getPointAtDistance",value:function(t){this.parsePoints(),this._tmpDistance||this.totalDistance();var e=this._tmpDistance.length,i=0,n=this._tmpDistance[this._tmpDistance.length-1];t<0?t=n+t:t>n&&(t-=n);for(var o=0;o<e&&(t>=this._tmpDistance[o]&&(i=o),!(t<this._tmpDistance[o]));++o);if(i===this.length-1)return this.getPointAt(i);var r=t-this._tmpDistance[i],s=this._tmpDistance[i+1]-this._tmpDistance[i];return this.getPointAt(i+r/s)}},{key:"closed",get:function(){return this._closed},set:function(t){this._closed!==t&&(this.polygon.closed=t,this._closed=t,this.dirty=!0)}},{key:"length",get:function(){return this.polygon.points.length?this.polygon.points.length/2+(this._closed?1:0):0}}]),t}();PIXI.Graphics.prototype.drawPath=function(t){return t.parsePoints(),this.drawShape(t.polygon),this};var f={TweenManager:c,Tween:u,Easing:n,TweenPath:p};return PIXI.tweenManager||(PIXI.tweenManager=new c,PIXI.tween=f),f});
//# sourceMappingURL=pixi-tween.min.js.map