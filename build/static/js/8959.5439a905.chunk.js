"use strict";(self.webpackChunkarrayan=self.webpackChunkarrayan||[]).push([[8959],{8959:function(i,t,s){s.r(t),s.d(t,{AbsorberInstance:function(){return p}});var o=s(4165),e=s(5861),n=s(5671),r=s(3144),a=s(4709),h=s(779),c=0,l=0,b=2*Math.PI,p=function(){function i(t,s,o,e){var r,c,l,p=this;(0,n.Z)(this,i),this.absorbers=t,this.container=s,this._calcPosition=function(){var i=(0,a.Gz)({size:p.container.canvas.size,position:p.options.position});return a.OW.create(i.x,i.y)},this._updateParticlePosition=function(i,t){if(!i.destroyed){var s=p.container,o=s.canvas.size;if(i.needsNewPosition){var e=(0,a.p)({size:o});i.position.setTo(e),i.velocity.setTo(i.initialVelocity),i.absorberOrbit=void 0,i.needsNewPosition=!1}if(p.options.orbits){var n;if(void 0===i.absorberOrbit&&(i.absorberOrbit=a.OW.origin,i.absorberOrbit.length=(0,a.Sp)(i.getPosition(),p.position),i.absorberOrbit.angle=(0,a.sZ)()*b),i.absorberOrbit.length<=p.size&&!p.options.destroy){var r=Math.min(o.width,o.height);i.absorberOrbit.length=r*(.2*(0,a.sZ)()-.1+1)}void 0===i.absorberOrbitDirection&&(i.absorberOrbitDirection=i.velocity.x>=0?"clockwise":"counter-clockwise");var h=i.absorberOrbit.length,c=i.absorberOrbit.angle,l=i.absorberOrbitDirection;i.velocity.setTo(a.OW.origin);var d={x:"clockwise"===l?Math.cos:Math.sin,y:"clockwise"===l?Math.sin:Math.cos};i.position.x=p.position.x+h*d.x(c),i.position.y=p.position.y+h*d.y(c),i.absorberOrbit.length-=t.length,i.absorberOrbit.angle+=(null!==(n=i.retina.moveSpeed)&&void 0!==n?n:0)*s.retina.pixelRatio/a.tZ*s.retina.reduceFactor}else{var u=a.OW.origin;u.length=t.length,u.angle=t.angle,i.velocity.addTo(u)}}},this.initialPosition=e?a.OW.create(e.x,e.y):void 0,o instanceof h.C?this.options=o:(this.options=new h.C,this.options.load(o)),this.dragging=!1,this.name=this.options.name,this.opacity=this.options.opacity,this.size=(0,a.Gu)(this.options.size.value)*s.retina.pixelRatio,this.mass=this.size*this.options.size.density*s.retina.reduceFactor;var d=this.options.size.limit;this.limit={radius:d.radius*s.retina.pixelRatio*s.retina.reduceFactor,mass:d.mass},this.color=null!==(r=(0,a.tX)(this.options.color))&&void 0!==r?r:{b:0,g:0,r:0},this.position=null!==(c=null===(l=this.initialPosition)||void 0===l?void 0:l.copy())&&void 0!==c?c:this._calcPosition()}return(0,r.Z)(i,[{key:"attract",value:function(i){var t=this.container,s=this.options;if(s.draggable){var o=t.interactivity.mouse;if(o.clicking&&o.downPosition)(0,a.Sp)(this.position,o.downPosition)<=this.size&&(this.dragging=!0);else this.dragging=!1;this.dragging&&o.position&&(this.position.x=o.position.x,this.position.y=o.position.y)}var e=i.getPosition(),n=(0,a.oW)(this.position,e),r=n.dx,h=n.dy,c=n.distance,l=a.OW.create(r,h);if(l.length=this.mass/Math.pow(c,2)*t.retina.reduceFactor,c<this.size+i.getRadius()){var b=.033*i.getRadius()*t.retina.pixelRatio;this.size>i.getRadius()&&c<this.size-i.getRadius()||void 0!==i.absorberOrbit&&i.absorberOrbit.length<0?s.destroy?i.destroy():(i.needsNewPosition=!0,this._updateParticlePosition(i,l)):(s.destroy&&(i.size.value-=b),this._updateParticlePosition(i,l)),(this.limit.radius<=0||this.size<this.limit.radius)&&(this.size+=b),(this.limit.mass<=0||this.mass<this.limit.mass)&&(this.mass+=b*this.options.size.density*t.retina.reduceFactor)}else this._updateParticlePosition(i,l)}},{key:"draw",value:function(){var i=(0,e.Z)((0,o.Z)().mark((function i(t){return(0,o.Z)().wrap((function(i){for(;;)switch(i.prev=i.next){case 0:return t.translate(this.position.x,this.position.y),t.beginPath(),t.arc(c,l,this.size,0,b,!1),t.closePath(),t.fillStyle=(0,a.iz)(this.color,this.opacity),t.fill(),i.next=8,Promise.resolve();case 8:case"end":return i.stop()}}),i,this)})));return function(t){return i.apply(this,arguments)}}()},{key:"resize",value:function(){var i=this.initialPosition;this.position=i&&(0,a.Ac)(i,this.container.canvas.size,a.OW.origin)?i:this._calcPosition()}}]),i}()}}]);
//# sourceMappingURL=8959.5439a905.chunk.js.map