"use strict";(self.webpackChunkarrayan=self.webpackChunkarrayan||[]).push([[1683],{1683:function(t,e,n){n.r(e),n.d(e,{TiltUpdater:function(){return p}});var i=n(4165),a=n(5861),r=n(5671),o=n(3144),s=n(4709),c=n(1752),l=n(1120),u=n(136),d=n(7277),v=function(){function t(){(0,r.Z)(this,t),this.enable=!1,this.speed=0,this.decay=0,this.sync=!1}return(0,o.Z)(t,[{key:"load",value:function(t){t&&(void 0!==t.enable&&(this.enable=t.enable),void 0!==t.speed&&(this.speed=(0,s.Cs)(t.speed)),void 0!==t.decay&&(this.decay=(0,s.Cs)(t.decay)),void 0!==t.sync&&(this.sync=t.sync))}}]),t}(),h=function(t){(0,u.Z)(n,t);var e=(0,d.Z)(n);function n(){var t;return(0,r.Z)(this,n),(t=e.call(this)).animation=new v,t.direction="clockwise",t.enable=!1,t.value=0,t}return(0,o.Z)(n,[{key:"load",value:function(t){(0,c.Z)((0,l.Z)(n.prototype),"load",this).call(this,t),t&&(this.animation.load(t.animation),void 0!==t.direction&&(this.direction=t.direction),void 0!==t.enable&&(this.enable=t.enable))}}]),n}(s.SW),f=2*Math.PI,p=function(){function t(e){(0,r.Z)(this,t),this.container=e}return(0,o.Z)(t,[{key:"getTransformValues",value:function(t){var e,n=(null===(e=t.tilt)||void 0===e?void 0:e.enable)&&t.tilt;return{b:n?Math.cos(n.value)*n.cosDirection:void 0,c:n?Math.sin(n.value)*n.sinDirection:void 0}}},{key:"init",value:function(){var t=(0,a.Z)((0,i.Z)().mark((function t(e){var n,a,r,o,c;return(0,i.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(a=e.options.tilt){t.next=3;break}return t.abrupt("return");case 3:e.tilt={enable:a.enable,value:(0,s.Id)((0,s.Gu)(a.value)),sinDirection:(0,s.sZ)()>=s.vq?1:-1,cosDirection:(0,s.sZ)()>=s.vq?1:-1,min:0,max:f},"random"===(r=a.direction)&&(o=Math.floor(2*(0,s.sZ)()),0,r=o>0?"counter-clockwise":"clockwise"),t.t0=r,t.next="counter-clockwise"===t.t0||"counterClockwise"===t.t0?9:"clockwise"===t.t0?11:13;break;case 9:return e.tilt.status="decreasing",t.abrupt("break",13);case 11:return e.tilt.status="increasing",t.abrupt("break",13);case 13:return null!==(c=null===(n=e.options.tilt)||void 0===n?void 0:n.animation)&&void 0!==c&&c.enable&&(e.tilt.decay=1-(0,s.Gu)(c.decay),e.tilt.velocity=(0,s.Gu)(c.speed)/360*this.container.retina.reduceFactor,c.sync||(e.tilt.velocity*=(0,s.sZ)())),t.next=17,Promise.resolve();case 17:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"isEnabled",value:function(t){var e,n=null===(e=t.options.tilt)||void 0===e?void 0:e.animation;return!t.destroyed&&!t.spawning&&!(null===n||void 0===n||!n.enable)}},{key:"loadOptions",value:function(t){t.tilt||(t.tilt=new h);for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];for(var a=0,r=n;a<r.length;a++){var o=r[a];t.tilt.load(null===o||void 0===o?void 0:o.tilt)}}},{key:"update",value:function(){var t=(0,a.Z)((0,i.Z)().mark((function t(e,n){return(0,i.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.isEnabled(e)&&e.tilt){t.next=2;break}return t.abrupt("return");case 2:return(0,s.Cr)(e,e.tilt,!1,"none",n),t.next=5,Promise.resolve();case 5:case"end":return t.stop()}}),t,this)})));return function(e,n){return t.apply(this,arguments)}}()}]),t}()}}]);
//# sourceMappingURL=1683.99ddfa7a.chunk.js.map