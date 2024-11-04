/*
TOR2D-js 2.0 by @TorradoProjects
https://torradoprojects.github.io/site/
Licencia MIT

Derechos de autor (c) [2024] [TorradoProjects]

Por la presente se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia
de este software y de los archivos de documentación asociados (el "Software"), para tratar
en el Software sin restricción, incluyendo sin limitación los derechos de usar, copiar,
modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software, y para
permitir a las personas a quienes se les proporcione el Software a hacer lo mismo, sujeto a las siguientes condiciones:

El aviso de derechos de autor anterior y este aviso de permiso deberán incluirse en todas las
copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA,
INCLUYENDO PERO NO LIMITADO A LAS GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO
PARTICULAR Y NO INFRACCIÓN. EN NINGÚN CASO LOS AUTORES O TITULARES DE LOS DERECHOS DE AUTOR
SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑO U OTRA RESPONSABILIDAD, YA SEA EN UNA ACCIÓN
DE CONTRATO, AGRAVIO O DE OTRO MODO, QUE SURJA DE, FUERA O EN CONEXIÓN CON EL SOFTWARE O SU
USO U OTRO TIPO DE ACCIONES EN EL SOFTWARE.
*/
(()=>{"use strict";var i={d:(t,s)=>{for(var e in s)i.o(s,e)&&!i.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:s[e]})},o:(i,t)=>Object.prototype.hasOwnProperty.call(i,t),r:i=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(i,"__esModule",{value:!0})}},t={};i.r(t),i.d(t,{AnimatedSprite:()=>V,AudioPlayer:()=>K,BaseButton:()=>F,BoxCollider:()=>Q,Button:()=>k,Camera:()=>y,Collision:()=>M,GameObject:()=>A,Input:()=>C,Joystick:()=>N,Label:()=>O,ParallaxBackground:()=>G,ParallaxLayer:()=>J,Particle:()=>Z,ParticleSystem:()=>H,RenderShape:()=>Y,SpatialGrid:()=>I,Sprite:()=>q,SpriteSheet:()=>U,TOR2D:()=>L,Text:()=>W,Texture:()=>X,TextureButton:()=>$,Time:()=>E,Timer:()=>D,UI:()=>B,Vector2:()=>s,_object:()=>j,add_in_grid:()=>T,collisions:()=>u,deleteAllData:()=>w,deleteData:()=>v,event:()=>m,isVisible:()=>x,lerp:()=>z,loadData:()=>b,max:()=>S,min:()=>P,pause_scene:()=>g,print:()=>f,random:()=>R,saveData:()=>_});class s{constructor(i,t){this.x=i||0,this.y=t||0}add(i){return new s(this.x+i.x,this.y+i.y)}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}normalize(){let i=this.length();return 0!==i?this.split(i):new s(0,0)}multiply(i){return new s(this.x*i,this.y*i)}split(i){return new s(this.x/i,this.y/i)}subtract(i){return new s(this.x-i.x,this.y-i.y)}}let e=[],o=null,n=null,h=null,r=null,a=null,l=null,p=null,d=!1,c=null,u=[],y={position:new s(0,0),canvas:r,target:void 0,followSpeed:.05,boundaryX:0,boundaryY:0,zoomLevel:1,child:[],moveX:0,moveY:0,follow:function(i,t,s){this.target!==i&&(this.boundaryX=t<=100?t:100,this.boundaryY=s<=100?s:100,this.target=i)},applyTransformation:function(){let i=this.target.position.x-(this.position.x+r.width/2/this.zoomLevel),t=this.target.position.y-(this.position.y+r.height/2/this.zoomLevel);Math.abs(i)>this.boundaryX?(this.moveX=this.target.velocity.x,this.position.x=z(this.position.x,this.target.position.x-r.width/2/this.zoomLevel,this.followSpeed)):this.moveX=0,Math.abs(t)>this.boundaryY?(this.moveY=this.target.velocity.y,this.position.y=z(this.position.y,this.target.position.y-r.height/2/this.zoomLevel,this.followSpeed)):this.moveY=0,a.scale(this.zoomLevel,this.zoomLevel),a.translate(-this.position.x,-this.position.y)},resetTransformation:function(){a.setTransform(1,0,0,1,0,0)},setZoom:function(i){this.zoomLevel=i},Render:function(){this.child.sort(((i,t)=>i.layer-t.layer)),this.child.forEach((i=>{i.globalPosition&&i.globalPosition(this.position),i.visible&&i.Render&&i.Render()}))},reset:function(){this.position=new s(0,0),this.target=void 0,this.followSpeed=.05,this.boundaryX=0,this.boundaryY=0,this.zoomLevel=1}};function f(i,t){void 0!==t?console.log(i,t):console.log(i)}function m(i,t){document.addEventListener(i,t)}function x(i){return null!=i.size?i.position.x+i.size.x>y.position.x&&i.position.x<y.position.x+r.width/y.zoomLevel&&i.position.y+i.size.y>y.position.y&&i.position.y<y.position.y+r.height/y.zoomLevel:i.position.x>y.position.x&&i.position.x<y.position.x+r.width/y.zoomLevel&&i.position.y>y.position.y&&i.position.y<y.position.y+r.height/y.zoomLevel}function g(i){"boolean"==typeof i?o.pause=i:console.error("el parametro no es un boolean (true, false)")}function _(i,t){localStorage.setItem(i,t)}function b(i){return localStorage.getItem(i)}function v(i){localStorage.removeItem(i)}function w(){localStorage.clear()}function z(i,t,s){return(1-s)*i+s*t}function R(i,t){return Math.floor(Math.random()*(t-i+1))+i}function P(i,t){return i<t||i===t?i:t}function S(i,t){return t>i||t===i?t:i}function T(i){c.clearGrid(),i.forEach((i=>{c.addToGrid(i)})),i.forEach((i=>{c.getNearbyObjects(i).forEach((t=>{if(i.parent.name!==t.parent.name)for(let s of i.mask)t.collision_layer===s&&M(i,t)}))}))}let E={delta:0,lastTime:0,lastUpdateFps:0,deltaTime:function(){return this.delta}},C={keys:{},mouse:{x:0,y:0,isDown:!1},isMouseMoving:!1,update:function(){window.addEventListener("keydown",(i=>{this.keys[i.code]||(this.keys[i.code]=!0,i.preventDefault())})),window.addEventListener("keyup",(i=>{this.keys[i.code]&&(this.keys[i.code]=!1,i.preventDefault())})),window.addEventListener("mousedown",(i=>{this.mouse.isDown||(this.mouse.isDown=!0,this.mouse.x=i.clientX,this.mouse.y=i.clientY)})),window.addEventListener("mouseup",(()=>{this.mouse.isDown&&(this.mouse.isDown=!1)})),window.addEventListener("mousemove",(i=>{this.isMouseMoving||(this.isMouseMoving=!0,this.mouse.x=i.clientX,this.mouse.y=i.clientY)})),window.addEventListener("click",(()=>{null!=this.isClick&&this.isClick()}))},isKeyDown:function(i){return!!this.keys[i]},getMousePosition:function(){return{x:this.mouse.x,y:this.mouse.y}},isMouseDown:function(){return this.mouse.isDown}};class I{constructor(i){this.cellSize=i,this.grid=new Map}getCell(i){return`${Math.floor(i.x/this.cellSize)},${Math.floor(i.y/this.cellSize)}`}addToGrid(i){const t=this.getCell(i.position),s=this.getCell({x:i.position.x+i.size.x,y:i.position.y+i.size.y}),[e,o]=t.split(",").map(Number),[n,h]=s.split(",").map(Number);for(let t=e;t<=n;t++)for(let s=o;s<=h;s++){const e=`${t},${s}`;this.grid.has(e)||this.grid.set(e,[]),this.grid.get(e).push(i)}}getNearbyObjects(i){const t=this.getCell(i.position),[s,e]=t.split(",").map(Number),o=[];for(let i=-1;i<=1;i++)for(let t=-1;t<=1;t++){const n=`${s+i},${e+t}`;this.grid.has(n)&&o.push(...this.grid.get(n))}return o}clearGrid(){this.grid.clear()}}function M(i,t){i.updateBorder(),t.updateBorder();const s=Math.min(i.borderRight-t.position.x,t.borderRight-i.position.x),e=Math.min(i.borderDown-t.position.y,t.borderDown-i.position.y);"Trigger"===i.type&&(i.bodyEnter(t)?t.trigger||(t.trigger=!0,void 0!==i.parent.is_trigger_enter&&i.parent.is_trigger_enter(t.parent)):t.trigger&&(void 0!==i.parent.is_trigger_exit&&i.parent.is_trigger_exit(t.parent),t.trigger=!1)),"CharacterBody"===i.type&&"Static"===t.type&&(i.bodyEnter(t)?(t.collisionStatic=!0,s<e?i.position.x<t.position.x?(i.borderRight>t.position.x+2&&(i.parent.position.x-=1),i.parent.velocity.x=0,i.parent.slice_right=!1,i.parent.isWall=!0):(i.position.x<t.borderRight-2&&(i.parent.position.x+=1),i.parent.velocity.x=0,i.parent.slice_left=!1,i.parent.isWall=!0):i.position.y<t.position.y?(i.parent.restitution>0?(i.parent.position.y=i.parent.position.y-i.parent.restitution,i.parent.restitution-=1):i.borderDown>t.position.y+2&&(i.parent.position.y-=2),i.parent.velocity.y=0,i.parent.slice_down=!1,i.parent.isFloor=!0):(i.position.y<t.borderDown-2&&(i.parent.position.y+=1),i.parent.velocity.y=0,i.parent.slice_up=!1,i.parent.isCeiling=!0)):t.collisionStatic&&(i.parent.slice_right=!0,i.parent.slice_left=!0,i.parent.slice_down=!0,i.parent.slice_up=!0,i.parent.isFloor=!1,i.parent.isWall=!1,i.parent.isCeiling=!1,t.collisionStatic=!1)),"CharacterBody"===i.type&&"Plataform"===t.type&&(i.bodyEnter(t)?(t.collisionPlataform=!0,s<e?i.position.x<t.position.x?(i.borderRight>t.position.x+2&&(i.parent.position.x-=1),i.parent.velocity.x=0,i.parent.slice_right=!1,i.parent.isWall=!0):(i.position.x<t.borderRight-2&&(i.parent.position.x+=1),i.parent.velocity.x=0,i.parent.slice_left=!1,i.parent.isWall=!0):i.borderDown<t.position.y+t.scale.y/2&&i.parent.velocity.y>0&&(i.parent.velocity.y=0,i.parent.slice_down=!1,i.parent.isFloor=!0)):t.collisionPlataform&&(i.parent.slice_right=!0,i.parent.slice_left=!0,i.parent.slice_down=!0,i.parent.slice_up=!0,i.parent.isFloor=!1,i.parent.isWall=!1,t.collisionPlataform=!1)),"CharacterBody"===i.type&&"RigidBody"===t.type&&(i.bodyEnter(t)?(t.collisionRigidBody=!0,s<e?i.position.x<t.position.x?(i.parent.slice_right=!1,t.parent.friction=.9,t.parent.velocity.x=(t.parent.velocity.x+Math.abs(i.parent.velocity.x/4))*t.parent.friction,i.parent.isWall=!0):(i.parent.slice_left=!1,t.parent.friction=.9,t.parent.velocity.x=(t.parent.velocity.x-Math.abs(i.parent.velocity.x/4))*t.parent.friction,i.parent.isWall=!0):i.position.y<t.position.y?(i.borderDown>t.position.y+2&&(i.parent.position.y-=i.parent.restitution),i.parent.velocity.y=0,i.parent.slice_down=!1,i.parent.isFloor=!0):(i.position.y<t.borderDown-2&&(i.parent.position.y+=1),i.parent.velocity.y=0,i.parent.slice_up=!1,i.parent.isCeiling=!0)):t.collisionRigidBody&&(i.parent.slice_right=!0,i.parent.slice_left=!0,i.parent.slice_down=!0,i.parent.slice_up=!0,i.parent.isFloor=!1,i.parent.isWall=!1,i.parent.isCeiling=!1,t.collisionRigidBody=!1)),"RigidBody"===i.type&&"Static"===t.type&&(i.bodyEnter(t)?(t.rigidBody=!0,s<e?i.position.x<t.position.x?(i.borderRight>t.position.x+2&&(i.parent.position.x-=1),i.parent.velocity.x=0,i.parent.slice_right=!1,i.parent.isWall=!0):(i.position.x<t.borderRight-2&&(i.parent.position.x+=1),i.parent.velocity.x=0,i.parent.slice_left=!1,i.parent.isWall=!0):i.position.y<t.position.y?(i.borderDown>t.position.y+2&&(i.parent.position.y-=i.parent.restitution),i.parent.velocity.y=0,i.parent.slice_down=!1,i.parent.isFloor=!0):(i.position.y<t.borderDown-2&&(i.parent.position.y+=1),i.parent.velocity.y=0,i.parent.slice_up=!1,i.parent.isCeiling=!0)):t.rigidBody&&(i.parent.slice_right=!0,i.parent.slice_left=!0,i.parent.slice_down=!0,i.parent.slice_up=!0,i.parent.isFloor=!1,i.parent.isWall=!1,i.parent.isCeiling=!1,t.rigidBody=!1)),"RigidBody"===i.type&&"Plataform"===t.type&&(i.bodyEnter(t)?(t.plataform=!0,s<e?i.position.x<t.position.x?(i.borderRight>t.position.x+2&&(i.parent.position.x-=1),i.parent.velocity.x=0,i.parent.slice_right=!1,i.parent.isWall=!0):(i.position.x<t.borderRight-2&&(i.parent.position.x+=1),i.parent.velocity.x=0,i.parent.slice_left=!1,i.parent.isWall=!0):i.borderDown<t.position.y+t.scale.y/2&&i.parent.velocity.y>0&&(i.parent.velocity.y=0,i.parent.slice_down=!1,i.parent.isFloor=!0)):t.plataform&&(i.parent.slice_right=!0,i.parent.slice_left=!0,i.parent.slice_down=!0,i.parent.slice_up=!0,i.parent.isFloor=!1,i.parent.isWall=!1,t.plataform=!1))}class L{#i;#t;#s=!1;constructor(i){document.body.style.overflow="hidden";let t=void 0!==i.container?document.getElementById(i.container):document.body;n=document.createElement("canvas"),n.style.position="absolute",n.style.left=`${t.left}px`,n.style.top=`${t.top}px`,n.width=i.width,n.height=i.height,n.style.background=void 0!==i.color?i.color:"black",h=n.getContext("2d"),t.appendChild(n),r=document.createElement("canvas"),a=r.getContext("2d"),r.width=i.width,r.height=i.height,l=document.createElement("canvas"),p=l.getContext("2d"),l.width=i.width,l.height=i.height,l.style.position="absolute",l.style.left=`${t.left}px`,l.style.top=`${t.top}px`,t.appendChild(l),this.#s=void 0!==i.texture_filter&&i.texture_filter,d=i.debugs,this.#i=0,this.#t=0,this.debugFPS=new O("FPS : "+this.#t,new s(15,25),20,"Arial","black"),this.debugFPS.type="FPS",d=void 0!==i.debugs&&i.debugs,B.add_child(this.debugFPS),c=new I(250)}#e(){a.clearRect(0,0,r.width,r.height)}#o(){h.clearRect(0,0,n.width,n.height),h.drawImage(r,0,0)}#n(i){this.#i++,o.pause?(E.delta=0,E.lastTime=0):(E.delta=Math.min((i-E.lastTime)/1e3,.1),E.lastTime=i),d&&i-E.lastUpdateFps>=1e3&&(this.#t=this.#i,this.#i=0,this.debugFPS.text="FPS : "+this.#t,E.lastUpdateFps=i),y.child.length>0&&y.Render();let t=o;t&&(t.child.sort(((i,t)=>i.layer-t.layer)),t.child.forEach((i=>{void 0===i.process||t.pause||i.process(),void 0===i.move_and_slide||t.pause||i.move_and_slide(),void 0!==i.Render&&x(i)&&i.visible&&i.Render()})),t.child.length>0&&t.child.forEach((i=>{void 0!==i.collider&&null!==i.collider&&u.push(i.collider),void 0!==i.child&&i.addCollision()})),u.length>1&&(T(u),u=[]),void 0===t.process||t.pause?void 0!==t.process&&t.process(0):t.process(E.deltaTime()))}#h(){B.Render(),B.Process()}#r(i){this.#e(),a.imageSmoothingEnabled=this.#s,null!=y.target&&y.applyTransformation(),p.clearRect(0,0,l.width,l.height),B.child.length>0&&this.#h(),this.#n(i),this.#o(),null!=y.target&&y.resetTransformation(),window.requestAnimationFrame(this.#r.bind(this))}add_scene(i){i.child=[],i.audios=[],i.pause=!1,i.add_child=function(t){if(t instanceof K)o.audios.push(t);else if(t instanceof O||t instanceof F||t instanceof X)B.add_child(t);else{if(!(t instanceof G))return o.child.find((i=>i.name===t.name))?(console.error(`El objeto ${t.name} ya existe.`),void console.error("Si lo que deseas es instanciar varios objetos, intenta usando el metodo 'instantiate()'.")):(t.parent=i,void i.child.push(t));y.child.push(t)}},i.name=i.name||e.length,e.push(i)}change_scene(i){y.child=[],y.reset(),y.resetTransformation(),B.child=[],o.audios.forEach((i=>{i.stop()})),o.audios=[],o.child=[],e.includes(i)&&o.name!==i.name&&(o=i,void 0!==i.ready&&i.ready())}start(i){window.addEventListener("load",(()=>{C.update(),this.add_scene(i),o=i,"function"==typeof i.ready&&i.ready(),this.#r(0)}))}}let B={child:[],Render:function(){this.child.forEach((i=>{(i.visible&&i.Render&&void 0===i.type||"FPS"===i.type&&d)&&i.Render()}))},Process:function(){this.child.forEach((i=>{i.process&&i.process()}))},add_child:function(i){this.child.push(i)}};class D{#a=0;constructor(i){this.time=i,this.#a=0,this.loop=!0,this.play=!1,this.time_finish=!1}process(){o.pause||(this.#a<this.time&&this.play?this.#a+=E.deltaTime():(this.time_finish||(this.func(),this.time_finish=!0),this.loop&&(this.#a=0,this.time_finish=!1)))}func(){}start(i){this.play||(this.func=i,this.play=!0)}stop(){this.play&&(this.#a=0)}}class O{#l;constructor(i,t,e,o,n){this.text="string"==typeof i?i:"",this.font="string"==typeof o?o:"Arial",this.position=t instanceof s?t:new s,this.size=Number.isInteger(e)?e+"px":"10px",this.color="string"==typeof n?n:"blue",this.visible=!0,this.layer=0,this.#l=0}setRotation(i){o.pause||(this.#l=Number.isInteger(i)?i*(Math.PI/180):0)}Render(){p.save(),p.font=`${this.size} ${this.font}`;const i=p.measureText(this.text).width;p.translate(this.position.x+i/2,this.position.y+parseInt(this.size)/2),p.rotate(this.#l),p.textBaseline="middle",p.textAlign="center",p.fillStyle=this.color,p.fillText(this.text,0,0),p.restore()}}class F{#p;#d;#l;constructor(i,t,e){this.name="string"==typeof i?i:"indefinido",this.parent=null,this.position=t instanceof s?t:new s,this.size=e instanceof s?e:new s(100,100),this.visible=!0,this.scale=1,this.layer=0,this.child=[],this.color="white",this.borderColor="black",this.pressedColor="grey",this.#p=!1,this.activeTouches=new Set,this.borderRadius=10,this.shadowOffsetX=4,this.shadowOffsetY=4,this.shadowBlur=10,this.shadowColor="rgba(0, 0, 0, 0.3)",this.disabled=!1,this.#d=!1,this.#l=0,l.addEventListener("touchstart",this.handleTouchStart.bind(this)),l.addEventListener("touchend",this.handleTouchEnd.bind(this)),l.addEventListener("touchcancel",this.handleTouchEnd.bind(this)),l.addEventListener("mousedown",this.handleMouseDown.bind(this)),l.addEventListener("mouseup",this.handleMouseUp.bind(this))}setRotation(i){o.pause||(this.#l=Number.isInteger(i)?i*(Math.PI/180):0,this.child.forEach((t=>{"function"==typeof t.setRotation&&t.setRotation(i)})))}isVisible(){return!(!this.parent||!this.parent.visible)||!!this.visible}isPressed(){return!this.#d&&this.#p?(this.#d=!0,this.#p):(this.#p||(this.#d=!1),!1)}scaler(){this.scale<1&&this.scale>.1&&(this.size=this.size.multiply(this.scale),this.scale=1)}Render(){this.scaler();const i=this.#p?this.pressedColor:this.color;p.fillStyle=i,p.save();const t=this.position.x+this.size.x/2,s=this.position.y+this.size.y/2;p.translate(t,s),p.rotate(this.#l),p.translate(-t,-s),p.shadowOffsetX=this.shadowOffsetX,p.shadowOffsetY=this.shadowOffsetY,p.shadowBlur=this.shadowBlur,p.shadowColor=this.shadowColor,this.roundRect(p,this.position.x,this.position.y,this.size.x,this.size.y,this.borderRadius),p.fill(),p.strokeStyle=this.borderColor,p.lineWidth=2,p.stroke(),p.restore(),this.RenderChild()}RenderChild(){this.child.sort(((i,t)=>i.layer-t.layer)),this.child.forEach((i=>{i.Render&&i.visible&&i.Render()}))}roundRect(i,t,s,e,o,n){i.beginPath(),i.moveTo(t+n,s),i.lineTo(t+e-n,s),i.quadraticCurveTo(t+e,s,t+e,s+n),i.lineTo(t+e,s+o-n),i.quadraticCurveTo(t+e,s+o,t+e-n,s+o),i.lineTo(t+n,s+o),i.quadraticCurveTo(t,s+o,t,s+o-n),i.lineTo(t,s+n),i.quadraticCurveTo(t,s,t+n,s),i.closePath()}handleTouchStart(i){const t=i.changedTouches,s=l.getBoundingClientRect();for(let i=0;i<t.length;i++){let e=t[i].clientX-s.left,o=t[i].clientY-s.top;this.isInsideBounds(e,o)&&(this.disabled||(this.#p=!0),this.activeTouches.add(t[i].identifier),this.is_action_pressed&&!this.disabled&&this.is_action_pressed(t[i].identifier))}}handleTouchEnd(i){const t=i.changedTouches;for(let i=0;i<t.length;i++){let s=t[i].identifier;this.activeTouches.has(s)&&(this.activeTouches.delete(s),0===this.activeTouches.size&&(this.disabled||(this.#p=!1),this.is_action_released&&!this.disabled&&this.is_action_released()))}}handleMouseDown(i){const t=l.getBoundingClientRect(),s=i.clientX-t.left,e=i.clientY-t.top;this.isInsideBounds(s,e)&&(this.disabled||(this.#p=!0),this.is_action_pressed&&!this.disabled&&this.is_action_pressed())}handleMouseUp(i){const t=l.getBoundingClientRect(),s=i.clientX-t.left,e=i.clientY-t.top;this.isInsideBounds(s,e)&&(this.disabled||(this.#p=!1),this.is_action_released&&!this.disabled&&this.is_action_released())}isInsideBounds(i,t){return i>=this.position.x&&i<=this.position.x+this.size.x&&t>=this.position.y&&t<=this.position.y+this.size.y}add_child(i){if(i instanceof O){let t=this.position.add(i.position);i.position=t,this.child.push(i)}else console.error(`El objeto ${i.name} no se puede añadir al objeto ${this.name}.\n`),console.warn("El objeto permitido es: Label.")}}class k extends F{#l;constructor(i,t,s,e,o,n){super(i,t,s),this.color=e||"white",this.borderColor=o||"black",this.pressedColor=n||"grey",this.#l=0}}class $ extends F{#p;#d=!1;#l;constructor(i,t,e,o,n){super(i,t,e),this.texture_pressed=new Image,this.texture_normal=new Image,this.texture_pressed.src="string"==typeof n?n:"",this.texture_normal.src="string"==typeof o?o:"",this.img=new Image,this.img.src="string"==typeof o?o:"",this.textureNormalSpriteSheet=o instanceof U?o:null,this.texturePressedSpriteSheet=n instanceof U?n:null,this.cutSize=new s,this.cutPosition=new s,null!==this.textureNormalSpriteSheet&&(this.img.src=o.img.src,this.texture_normal.src=o.img.src,this.cutSize=o.size,this.cutPosition=o.position),null!==this.texturePressedSpriteSheet&&(this.texture_pressed.src=n.img.src),this.#p=!1,this.activeTouches=new Set,this.#l=0}setRotation(i){o.pause||(this.#l=Number.isInteger(i)?i*(Math.PI/180):0,this.child.forEach((t=>{"function"==typeof t.setRotation&&t.setRotation(i)})))}isPressed(){return!this.#d&&this.#p?(this.#d=!0,this.#p):(this.#p||(this.#d=!1),!1)}Render(){super.scaler(),p.save(),p.translate(this.position.x+this.size.x/2,this.position.y+this.size.y/2),p.rotate(this.#l),null!==this.textureNormalSpriteSheet&&null!==this.texturePressedSpriteSheet?p.drawImage(this.img,this.cutPosition.x,this.cutPosition.y,this.cutSize.x,this.cutSize.y,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y):p.drawImage(this.img,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y),p.restore(),super.RenderChild()}handleTouchStart(i){const t=i.changedTouches,s=l.getBoundingClientRect();for(let i=0;i<t.length;i++){let e=t[i].clientX-s.left,o=t[i].clientY-s.top;e>=this.position.x&&e<=this.position.x+this.size.x&&o>=this.position.y&&o<=this.position.y+this.size.y&&(this.disabled||(this.#p=!0),this.img=this.texture_pressed,null!==this.texturePressedSpriteSheet&&(this.cutPosition=this.texturePressedSpriteSheet.position,this.cutSize=this.texturePressedSpriteSheet.size),this.activeTouches.add(t[i].identifier),this.is_action_pressed&&!this.disabled&&this.is_action_pressed(t[i].identifier))}}handleTouchEnd(i){const t=i.changedTouches;for(let i=0;i<t.length;i++){let s=t[i].identifier;this.activeTouches.has(s)&&(this.activeTouches.delete(s),0===this.activeTouches.size&&(this.disabled||(this.#p=!1),this.img=this.texture_normal,null!==this.textureNormalSpriteSheet&&(this.cutPosition=this.textureNormalSpriteSheet.position,this.cutSize=this.textureNormalSpriteSheet.size),this.is_action_released&&!this.disabled&&this.is_action_released()))}}handleMouseDown(i){const t=l.getBoundingClientRect(),s=i.clientX-t.left,e=i.clientY-t.top;super.isInsideBounds(s,e)&&(this.disabled||(this.#p=!0),this.img=this.texture_pressed,null!==this.texturePressedSpriteSheet&&(this.cutPosition=this.texturePressedSpriteSheet.position,this.cutSize=this.texturePressedSpriteSheet.size),this.is_action_pressed&&!this.disabled&&this.is_action_pressed())}handleMouseUp(i){const t=l.getBoundingClientRect(),s=i.clientX-t.left,e=i.clientY-t.top;super.isInsideBounds(s,e)&&(this.disabled||(this.#p=!1),this.img=this.texture_normal,null!==this.textureNormalSpriteSheet&&(this.cutPosition=this.textureNormalSpriteSheet.position,this.cutSize=this.textureNormalSpriteSheet.size),this.is_action_released&&!this.disabled&&this.is_action_released())}}class N extends ${constructor(i,t,s,e,o,n=50){super(i,t,s,e,e),this.texture_inner=new Image,this.texture_inner.src=o,this.axisX=0,this.axisY=0,this.center={x:this.position.x+this.size.x/2,y:this.position.y+this.size.y/2},this.maxDistance=n,this.innerPos={x:this.center.x,y:this.center.y},l.addEventListener("touchmove",this.handleTouchMove.bind(this))}Render(){p.drawImage(this.img,this.position.x,this.position.y,this.size.x,this.size.y),p.drawImage(this.texture_inner,this.innerPos.x-this.size.x/4,this.innerPos.y-this.size.y/4,this.size.x/2,this.size.y/2),super.RenderChild()}handleTouchMove(i){const t=i.changedTouches,s=l.getBoundingClientRect();for(let i=0;i<t.length;i++){let e=t[i].clientX-s.left,n=t[i].clientY-s.top;if(this.isPressed&&this.activeTouches.has(t[i].identifier)){let i=e-this.center.x,t=n-this.center.y,s=Math.sqrt(i*i+t*t);if(s>this.maxDistance){let e=this.maxDistance/s;i*=e,t*=e}this.innerPos.x=this.center.x+i,this.innerPos.y=this.center.y+t,this.axisX=i/this.maxDistance,this.axisY=t/this.maxDistance,this.onMove&&!o.pause&&this.onMove(this.axisX,this.axisY)}}}handleTouchEnd(i){super.handleTouchEnd(i),0===this.activeTouches.size&&(this.innerPos.x=this.center.x,this.innerPos.y=this.center.y,this.axisX=0,this.axisY=0)}}class X{#l;constructor(i,t,e,o){this.name="string"==typeof i?i:"indefinido",this.position=t instanceof s?t:new s,this.size=e instanceof s?e:new s,this.scale=1,this.visible=!0,this.layer=0,this.child=[],this.img=new Image,this.img.src="string"==typeof o?o:"",this.path=o instanceof U?o:null,null!==this.path&&(this.img.src=this.path.img.src),this.flip_h=!1,this.flip_v=!1,this.#l=0,this.color=null,this.alpha=1}scaler(){this.scale<1&&(this.size=this.size.multiply(this.scale),this.scale=1)}setRotation(i){o.pause||(this.#l=Number.isInteger(i)?i*(Math.PI/180):0,this.child.forEach((t=>{"function"==typeof t.setRotation&&t.setRotation(i)})))}add_child(i){this.child.forEach((t=>{t.name!==i.name||console.error(`El objeto ${i.name} ya existe.`)}));let t=this.position.add(i.position);i.position=t,this.child.push(i)}Render(){if(this.scaler(),p.save(),p.globalAlpha=this.alpha,p.translate(this.position.x+this.size.x/2,this.position.y+this.size.y/2),p.rotate(this.#l),(this.flip_h||this.flip_v)&&p.scale(this.flip_h?-1:1,this.flip_v?-1:1),null!==this.path?p.drawImage(this.img,this.path.position.x,this.path.position.y,this.path.size.x,this.path.size.y,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y):p.drawImage(this.img,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y),this.color&&(p.globalCompositeOperation="source-atop",p.fillStyle=this.color,p.fillRect(-this.size.x/2,-this.size.y/2,this.size.x,this.size.y),p.globalCompositeOperation="source-over"),p.globalAlpha=1,p.restore(),this.child.length>0){this.child.sort(((i,t)=>i.layer-t.layer));for(let i of this.child)null!=i.Render&&i.visible&&i.Render()}}}class j{constructor(i,t,e){this.name=i,this.parent=null,this.position=t,this.localPosition=t,this.size=e,this.velocity=new s,this.visible=!0,this.layer=0,this.child=[]}}class A extends j{#l;constructor(i,t,s){super(i,t,s),this.slice_right=!0,this.slice_left=!0,this.slice_up=!0,this.slice_down=!0,this.isFloor=!1,this.wasOnFloor=!1,this.isWall=!1,this.wasOnWall=!1,this.isCeiling=!1,this.wasOnCeiling=!1,this.collider=null,this.scale=1,this.restitution=2,this.saveRestitution=this.restitution,this.isInstantiate=!1}setRestitution(i){this.restitution=i,this.saveRestitution=i}setRotation(i){o.pause||(this.#l=Number.isInteger(i)?i*(Math.PI/180):0,this.child.forEach((t=>{"function"==typeof t.setRotation&&t.setRotation(i)})))}apply_impulse(i,t){this.velocity.x+=i,this.velocity.y+=t}scaler(){this.scale<1&&this.scale>.1&&(this.size=this.size.multiply(this.scale),this.scale=1)}is_in_floor(){return this.isFloor}is_in_floor_only(){return this.is_in_floor()&&!this.wasOnFloor?(this.wasOnFloor=!0,!0):(this.is_in_floor()||(this.wasOnFloor=!1),!1)}is_in_wall(){return this.isWall}is_in_wall_only(){return this.is_in_wall()&&!this.wasOnWall?(this.wasOnWall=!0,!0):(this.is_in_wall()||(this.wasOnWall=!1),!1)}is_in_ceiling(){return this.isCeiling}is_in_ceiling_only(){return this.is_in_ceiling()&&!this.wasOnCeiling?(this.wasOnCeiling=!0,!0):(this.is_in_ceiling()||(this.wasOnCeiling=!1),!1)}instantiate(){this.name=this.name+R(1,1e4)}center(){return new s(this.position.x+this.size.x/2,this.position.y+this.size.y/2)}add_child(i){if(i instanceof K&&o.audios.push(i),i.name!==this.name){for(let t of this.child)if(i.name===t.name)return console.error(`El objeto ${i.name} ya existe como hijo de ${this.name}\n`),void console.warn("El método add_child solo debe ser usado dentro de la función ready.");if(i instanceof Q&&null===this.collider)i.parent=this,this.collider=i;else if(i instanceof Q)return void console.error(`El objeto ${this.name} ya tiene una colisión.`);if(null!=i.size){i.parent=this;let t=this.center().subtract(new s(i.size.x/2,i.size.y/2));i.position=t,this.child.push(i)}else{i.parent=this;let t=this.position.add(i.position);i.position=t,this.child.push(i)}}else console.error(`El objeto ${i.name} no se puede agregar a si mismo\n`)}destroy(){if(null!=this.parent)for(let i=0;i<this.parent.child.length;i++)this.parent.child[i].name===this.name&&this.parent.child.splice(i,1)}Render(){if(this.child.length>0){this.child.sort(((i,t)=>i.layer-t.layer));for(let i of this.child)null!=i.Render&&i.visible&&i.Render()}}globalPosition(i=new s,t=new s){let e=t.subtract(new s(this.size.x/2,this.size.y/2));this.position=this.localPosition.add(e)}move_and_slide(){if(o.pause)return;this.restitution<=0&&!this.is_in_floor()&&this.velocity.y<0&&(this.restitution=this.saveRestitution);const i=this.velocity.x*Time.delta,t=this.velocity.y*Time.delta;(this.slice_right&&this.velocity.x>0||this.slice_left&&this.velocity.x<0)&&(this.position.x+=i),(this.slice_down&&this.velocity.y>0||this.slice_up&&this.velocity.y<0)&&(this.position.y+=t),this.friction>0&&(this.velocity.x*=this.friction,this.velocity.y*=this.friction),this._processChildren()}_processChildren(){for(let i of this.child)i.globalPosition(this.position,this.center()),"function"==typeof i.move_and_slide&&i.move_and_slide(),"function"==typeof i._process&&i._process(),"function"==typeof i.process&&i.process()}addCollision(){this.child.length>0&&this.child.forEach((i=>{void 0!==i.collider&&null!==i.collider&&u.push(i.collider),void 0!==i.child&&i.addCollision()}))}}class Y extends A{#l;constructor(i,t,s,e,o){super(i,t,s),this.shape=e||"Rectangle",this.color=o||"white",this.#l=0}setRotation(i){o.pause||(this.#l=Number.isInteger(i)?i*(Math.PI/180):0,this.child.forEach((t=>{"function"==typeof t.setRotation&&t.setRotation(i)})))}Render(){switch(super.scaler(),a.save(),a.translate(this.position.x+this.size.x/2,this.position.y+this.size.y/2),a.rotate(this.#l),this.shape){case"Rectangle":a.fillStyle=this.color,a.fillRect(-this.size.x/2,-this.size.y/2,this.size.x,this.size.y);break;case"Circle":{let i=this.size.x/2;a.beginPath(),a.arc(0,0,i,0,2*Math.PI),a.closePath(),a.fillStyle=this.color,a.fill()}break;case"Triangle":a.beginPath(),a.moveTo(0,-Math.sqrt(3)/2*this.size.x/2),a.lineTo(-this.size.x/2,Math.sqrt(3)/2*this.size.x/2),a.lineTo(this.size.x/2,Math.sqrt(3)/2*this.size.x/2),a.closePath(),a.fillStyle=this.color,a.fill()}a.restore(),super.Render()}}class W extends O{#l;constructor(i,t,s,e,o){super(i,t,s,e,o),this.localPosition=t,this.#l=0}setRotation(i){o.pause||(this.#l=Number.isInteger(i)?i*(Math.PI/180):0)}Render(){a.save(),a.font=`${this.size} ${this.font}`;const i=a.measureText(this.text).width,t=parseInt(this.size);a.translate(this.position.x+i/2,this.position.y+t/2),a.rotate(this.#l),a.textBaseline="middle",a.textAlign="center",a.fillStyle=this.color,a.fillText(this.text,0,0),a.restore()}globalPosition(i=new s){this.position=i.add(this.localPosition)}}class q extends A{#l;constructor(i,t,s,e){super(i,t,s),this.img=new Image,this.img.src="string"==typeof e?e:"",this.path=e instanceof U?e:null,null!==this.path&&(this.img.src=this.path.img.src),this.flip_h=!1,this.flip_v=!1,this.#l=0,this.color=null,this.alpha=1}setRotation(i){o.pause||(this.#l=Number.isInteger(i)?i*(Math.PI/180):0,this.child.forEach((t=>{"function"==typeof t.setRotation&&t.setRotation(i)})))}Render(){super.scaler(),a.save(),a.globalAlpha=this.alpha,a.translate(this.position.x+this.size.x/2,this.position.y+this.size.y/2),a.rotate(this.#l),(this.flip_h||this.flip_v)&&a.scale(this.flip_h?-1:1,this.flip_v?-1:1),null!==this.path?a.drawImage(this.img,this.path.position.x,this.path.position.y,this.path.size.x,this.path.size.y,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y):a.drawImage(this.img,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y),this.color&&(a.globalCompositeOperation="source-atop",a.fillStyle=this.color,a.fillRect(-this.size.x/2,-this.size.y/2,this.size.x,this.size.y),a.globalCompositeOperation="source-over"),a.globalAlpha=1,a.restore(),super.Render()}}class U{constructor(i,t,e,o,n){this.name=i,this.position=new s(t.x*o.x,t.y*o.y),this.size=new s(e.x*o.x,e.y*o.y),this.img=new Image,this.img.src=n,this.frames=o}}class V extends A{#l;#c;constructor(i,t,s,e,o){super(i,t,s),this.flip_h=!1,this.flip_v=!1,this.currentAnim="",this.anim=e,this.x=0,this.y=0,this.loop=!0,this.#c=!1,this.speed=o||.3,this.speedFrame=new D(this.speed),this.animation_finish=!1,this.#l=0,this.color=null,this.alpha=1}setRotation(i){o.pause||(this.#l=Number.isInteger(i)?i*(Math.PI/180):0,this.child.forEach((t=>{"function"==typeof t.setRotation&&t.setRotation(i)})))}wait=()=>{if(this.#c){const i=this.anim.find((i=>i.name===this.currentAnim));i&&(this.x<i.size.x-i.frames.x?this.x+=i.frames.x:this.y<i.size.y-i.frames.y?(this.y+=i.frames.y,this.x=i.position.x):this.loop?(this.x=i.position.x,this.y=i.position.y):(this.animation_finish=!0,this.stop()))}};Render(){super.scaler();const i=this.anim.find((i=>i.name===this.currentAnim));a.save(),a.globalAlpha=this.alpha,a.translate(this.position.x+this.size.x/2,this.position.y+this.size.y/2),a.rotate(this.#l),(this.flip_h||this.flip_v)&&a.scale(this.flip_h?-1:1,this.flip_v?-1:1);const t=i?i.img:this.anim[0].img,s=i?this.x:this.anim[0].x,e=i?this.y:this.anim[0].y,o=i?i.frames.x:this.anim[0].frames.x,n=i?i.frames.y:this.anim[0].frames.y;a.drawImage(t,s,e,o,n,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y),this.color&&(a.globalCompositeOperation="source-atop",a.fillStyle=this.color,a.fillRect(-this.size.x/2,-this.size.y/2,this.size.x,this.size.y),a.globalCompositeOperation="source-over"),a.globalAlpha=1,a.restore(),super.Render()}process(){this.speedFrame.process(),null!=this.animation_finish_name&&this.animation_finish&&this.animation_finish_name(this.currentAnim)}play(i){i!==this.currentAnim&&this.stop(),this.#c||(i!==this.currentAnim&&(this.anim.forEach((t=>{t.name===i&&(this.x=t.position.x,this.y=t.position.y)})),this.speedFrame.stop()),this.currentAnim=i,this.animation_finish=!1,this.#c=!0,this.anim.forEach((t=>{t.name===i&&(this.x=t.position.x,this.y=t.position.y)})),this.speedFrame.start(this.wait))}stop(){this.#c&&(this.#c=!1)}}class G{constructor(i,t){this.name=i,this.position=t,this.localPosition=t,this.visible=!0,this.layer=0,this.child=[]}add_child(i){if(!(i instanceof J))return void console.error("Solo se permite objetos de tipo ParallaxLayer.");if(i.name===this.name)return void console.error(`No puedes añadir ${i.name} a si mismo.`);if(this.child.find((t=>t.name===i.name)))return void console.error(`El objeto ${i.name} ya existe.`);let t=i.position;i.position=t.add(this.position),this.child.push(i)}Render(){this.child.sort(((i,t)=>i.layer-t.layer)),this.child.forEach((i=>{i.globalPosition&&i.globalPosition(this.position),i.visible&&i.Render&&x(i)&&i.Render(),i._process&&i._process()}))}globalPosition(i=new s){this.position=i.add(this.localPosition)}}class J extends G{constructor(i,t,s,e,o){super(i,t),this.size=s,this.moveSpeed=o,this.img=new Image,this.img.src="string"==typeof e?e:"",this.path=e instanceof U?e:null,null!==this.path&&(this.img.src=this.path.img.src),this.speed=0,this.offset=0}globalPosition(i=new s){this.position=i.add(this.localPosition)}Render(){let i=this.size.x,t=this.position.x+this.offset;for(let s=-1;s<=Math.ceil(r.width/i);s++){let e=t+s*i;null!==this.path?a.drawImage(this.img,this.path.position.x,this.path.position.y,this.path.size.x,this.path.size.y,e,this.position.y,this.size.x,this.size.y):a.drawImage(this.img,e,this.position.y,this.size.x,this.size.y)}}_process(){o.pause?this.offset=0:y.target?(y.moveX>0?this.speed=-this.moveSpeed:y.moveX<0?this.speed=this.moveSpeed:this.speed=0,this.offset+=this.speed,this.offset<=-this.size.x?this.offset+=this.size.x:this.offset>=this.size.x&&(this.offset-=this.size.x)):o.pause||(this.offset<=-this.size.x?this.offset+=this.size.x:this.offset>=this.size.x&&(this.offset-=this.size.x))}}class K extends j{#u;#y;constructor(i,t,s,e=!1){super(i,t),this.sound=new Audio(s),this.sound.volume=1,this.sound.loop=e,this.#u=!1,this.#y=!1}setLoop(i){this.sound.loop=i}globalPosition(i=new s){this.position=i.add(this.localPosition)}play(){(!this.#u&&this.isVisible()&&!o.pause||!this.sound.loop&&this.isVisible()&&!o.pause)&&o&&(o.audios.find((i=>i.name===this.name))?(this.stop(),this.sound.play(),this.#u=!0,this.#y=!1):console.error(`El objeto ${this.name} deve ser añadido a la Escena o a un objeto para que se pueda reproducir.`))}stop(){this.#y||(this.sound.pause(),this.sound.currentTime=0,this.#y=!0,this.#u=!1)}isVisible(){return this.position.x>=y.position.x&&this.position.x<=y.position.x+r.width/y.zoomLevel+200&&this.position.y>=y.position.y&&this.position.y<=y.position.y+r.height/y.zoomLevel+200}_process(){if(o.pause)this.stop();else if(this.isVisible()){let i=y.position.x+r.width/2/y.zoomLevel,t=y.position.y+r.height/2/y.zoomLevel,s=Math.sqrt(Math.pow(this.position.x-i,2)+Math.pow(this.position.y-t,2)),e=500;if(s<e){let i=1-s/e;this.sound.volume=Math.max(0,Math.min(i,1)),this.#u||this.play()}else this.sound.volume=0,this.stop()}else this.sound.volume>0&&(this.sound.volume=Math.max(this.sound.volume-.01,0)),0===this.sound.volume&&this.#u&&this.stop()}}class Z{constructor(i,t){this.position=new s(i.x,i.y),this.vx=2*(Math.random()-.5),this.vy=2*(Math.random()-.5),this.life=100,this.size=3*Math.random()+1,this.color=t?`rgba(${t}, ${this.life/100})`:`rgba(255, 255, 255, ${this.life/100})`,this.visible=!0}_process(){o.pause||(this.position.x+=this.vx,this.position.y+=this.vy,this.life-=1)}Render(){a.beginPath(),a.arc(this.position.x,this.position.y,this.size,0,2*Math.PI),a.fillStyle=this.color,a.fill(),a.closePath()}isDead(){return this.life<=0}}class H{constructor(i,t=1,s){this.position=i,this.localPosition=i,this.visible=!0,this.particles=[],this.color=s,this.nomberParticles=t}emit(){if(this.visible&&!o.pause)for(let i=0;i<this.nomberParticles;i++)this.particles.push(new Z(this.position,this.color))}process(){o.pause||(this.particles=this.particles.filter((i=>!i.isDead())),this.particles.forEach((i=>i._process())))}Render(){this.particles.forEach((i=>{i.Render&&i.visible&&i.Render()}))}globalPosition(i=new s){this.position=i.add(this.localPosition)}}class Q extends A{constructor(i,t,s,e,o,n){super(i,t,s),this.collision_layer=e,this.mask=Array.isArray(o)?o:Number.isInteger(o)?[o]:[0],this.color="rgba(0, 0, 230, 0.4)",this.type=n||"Trigger",this.visible=d,this.layer=10,this.borderLeft=this.position.x,this.borderRight=this.position.x+this.size.x,this.borderUp=this.position.y,this.borderDown=this.position.y+this.size.y}updateBorder(){this.borderLeft=this.position.x,this.borderRight=this.position.x+this.size.x,this.borderUp=this.position.y,this.borderDown=this.position.y+this.size.y}set_collision_mask(i){Number.isInteger(i)?(this.mask.forEach((t=>{if(i===t)return console.error(`La mascara ${i} ya existe en el objeto de colision ${this.name}\n`),void console.warn("El método set_collision_mask solo debe ser usado dentro de la función ready.")})),this.mask.push(mask)):console.error("El parametro en el metodo 'set_collision_mask' no es valido.")}Render(){a.fillStyle=this.color,a.fillRect(this.position.x,this.position.y,this.size.x,this.size.y),super.Render()}bodyEnter(i){return this.borderRight>=i.borderLeft&&this.borderLeft<=i.borderRight&&this.borderDown>=i.borderUp&&this.borderUp<=i.borderDown}}var ii=window;for(var ti in t)ii[ti]=t[ti];t.__esModule&&Object.defineProperty(ii,"__esModule",{value:!0})})();