(self.webpackChunk=self.webpackChunk||[]).push([[4850],{15073:(t,e,n)=>{n.d(e,{u:()=>r});var r,o=n(27378),i=n(40327),a=n(98403),u=n(19751),c=n(2844),p=n(85089),l=n(2834),f=n(9223),s=n(5114),m=n(83078),h=n(90845);!function(t){t.Manager=function(e){var n=e.children,r=e.remSize,i=a.Dx(r).pipe(u.shareReplay({refCount:!0,bufferSize:1}));return h.P.useSingleton("RemSize.Manager"),h.P.useSubscriptionTo(i),o.createElement(t.Context.Provider,{value:i},n)},t.DefaultManager=function(e){var n=e.children;return h.P.useSingleton("RemSize.DefaultManager"),o.createElement(t.Manager,{remSize:t.withRemSizeEffect(t.defaultSizeObserver)},n)},t.defaultSizeObserver=c.aj(p.Lw("(max-width: 1359px)"),p.Lw("(min-width: 1600px)"),(function(t,e){return t?14:e?18:16})),t.withRemSizeEffect=function(e,n){return void 0===n&&(n=t.defaultFontSizeSetter),e.pipe(l.b((function(t){return n(s.some(t))})),f.x(n.bind(null,s.none)),u.shareReplay({refCount:!0,bufferSize:1}))},t.defaultFontSizeSetter=function(e){t.setRootCssVar(document.documentElement,e),t.setRootFontSize(e)},t.Context=o.createContext(t.defaultSizeObserver),t.setRootCssVar=function(t,e){t.style.setProperty("--rem",(0,i.pipe)(e,s.map(String),m.orNull))},t.setRootFontSize=function(t){document.documentElement.style.fontSize=(0,i.pipe)(t,s.map((function(t){return t+"px"})),m.orNull)}}(r||(r={}))},101:(t,e,n)=>{n.d(e,{l:()=>r});var r,o=n(59312),i=n(27378),a=n(95300),u=n(60797),c=n(66310),p=n(24209),l=n(85089),f=n(49708),s=n(85985),m=n(76974),h=n(98403),d=n(17343),g=n(93508),y=n(77176),b=n(2844),v=n(41398),x=n(19751),R=n(18625),S=n(5114),C=n(19962),P=n(18208),w=n(81531);!function(t){var e;!function(t){t.nextLevel=function(t,e){return{rect:t,level:e+1}}}(t.State||(t.State={})),function(t){t.empty={top:0,bottom:0}}(t.Padding||(t.Padding={})),function(t){t.root="root",t.inherit="inherit"}(e=t.ContainerType||(t.ContainerType={})),t.withViewportContainer=function(n,r){return function(b){function v(){var t=null!==b&&b.apply(this,arguments)||this;return t._viewportEl=new a.X(S.none),t._onMount=function(e){t._viewportEl.next(S.fromNullable(e)),t.props.onMount&&e&&t.props.onMount(e)},t}return(0,o.__extends)(v,b),v.prototype.render=function(){var a=this.props,b=a.name,v=a.children,x=this._viewportEl.pipe(u.oA,c.w((function(t){return p.T(l.Qr,f.R(t,"transitionend").pipe(s.h((function(e){return e.target===t}))),m.of(!0).pipe(c.w(h.b2.rafScheduler))).pipe(d.h(t),g.O(t),y.U(C.Rect.fromEl))}))),R=r.type===e.root?t.RootVirtualContainer:t.InheritVirtualContainer;return i.createElement(n,(0,o.__assign)({},this.props,{onMount:this._onMount,name:b}),i.createElement(R,{viewport:x,name:b},v))},v}(i.Component)},t.RootVirtualContainer=function(e){var n=e.viewport,r=e.viewportPadding,o=void 0===r?m.of(t.Padding.empty):r,a=e.name,u=e.children,c=i.useContext(t.Context);return i.createElement(t.Context.Provider,{key:E(a),value:b.aj(n,o,M).pipe(v.M(c.pipe(y.U((function(t){return t.level}))),t.State.nextLevel),x.shareReplay({bufferSize:1,refCount:!0}))},u)},t.InheritVirtualContainer=function(e){var n=e.viewport,r=e.viewportPadding,o=void 0===r?m.of(C.Rect.empty):r,a=e.name,u=e.children,c=i.useContext(t.Context);return i.createElement(t.Context.Provider,{key:E(a),value:b.aj(c.pipe(y.U((function(t){return t.rect}))),b.aj(n||c.pipe(y.U((function(t){return t.rect}))),o,M),C.Rect.intersection).pipe(y.U(S.getOrElse((function(){return w.C8.Logging.getLogger("InheritVirtualContainer").warn("Got an empty rect for inherit viewport",{name:a}),C.Rect.empty}))),v.M(c.pipe(y.U((function(t){return t.level}))),t.State.nextLevel),x.shareReplay({bufferSize:1,refCount:!0}))},u)};var n=R.P((function(){return l.Qr.pipe(d.h(document.body),g.O(document.body),y.U(C.Rect.fromEl),y.U((function(t){return{rect:t,level:0}})))})).pipe(x.shareReplay({bufferSize:1,refCount:!0}));t.Context=i.createContext(n)}(r||(r={}));var M=function(t,e){return{top:t.top+e.top,bottom:t.bottom-e.bottom,height:t.height-e.top-e.bottom,left:t.left,right:t.right,width:t.width}},E=function(t){return"viewportProvider".concat(P.camelize(t))}},11413:(t,e,n)=>{n.d(e,{t:()=>S});var r,o=n(59312),i=n(27378),a=n(57050),u=n(40327),c=n(5739),p=n(12187),l=n(77176),f=n(98403),s=n(2844),m=n(28043),h=n(71249),d=n(45614),g=n(32426),y=n(19962),b=n(22232),v=n(5114),x=n(95195),R=n(95574);!function(t){var e,n,r;function i(t,n){var r=n.position,i=n.point,a={width:Math.trunc(t.width),height:Math.trunc(t.height)};return y.Rect.validate(e.match((function(){return(0,o.__assign)({top:i.y,right:i.x,bottom:i.y+a.height,left:i.x-a.width},a)}),(function(){return(0,o.__assign)({top:i.y-a.height,right:i.x,bottom:i.y,left:i.x-a.width},a)}),(function(){return(0,o.__assign)({top:i.y-a.height,right:i.x+a.width,bottom:i.y,left:i.x},a)}),(function(){return(0,o.__assign)({top:i.y,right:i.x+a.width,bottom:i.y+a.height,left:i.x},a)}))(r))}function a(e){return t.topLeft(y.Rect.Point.normalize({x:e.left,y:e.top}))}!function(t){t.topLeft="topLeft",t.topRight="topRight",t.bottomRight="bottomRight",t.bottomLeft="bottomLeft"}(e=t.Position||(t.Position={})),function(t){t.match=function(e,n,r,o){return function(i){switch(i){case t.topRight:return e();case t.bottomRight:return n();case t.bottomLeft:return r();case t.topLeft:return o();default:return(0,b.vE)(i)}}}}(e=t.Position||(t.Position={})),t.topLeft=function(t){return{position:e.topLeft,point:y.Rect.Point.normalize(t)}},t.topRight=function(t){return{position:e.topRight,point:y.Rect.Point.normalize(t)}},t.bottomRight=function(t){return{position:e.bottomRight,point:y.Rect.Point.normalize(t)}},t.bottomLeft=function(t){return{position:e.bottomLeft,point:y.Rect.Point.normalize(t)}},t.relativeTo=function(t,e){return{position:t.position,point:y.Rect.Point.relativeTo(t.point,e)}},t.empty=t.topLeft(y.Rect.Point.empty),t.toRect=i,t.fromRect=a,t.inRect=function(t,e){var n=e.point;return y.Rect.hasPoint(t,n)},t.toCss=function(t){var n=t.position,r=t.point;return e.match((function(){return{top:r.y,right:r.x}}),(function(){return{right:r.x,bottom:r.y}}),(function(){return{bottom:r.y,left:r.x}}),(function(){return{top:r.y,left:r.x}}))(n)},function(e){e.create=function(t,e){return(0,b.kG)(t.point.x===e.point.x||t.point.y===e.point.y,"can not form Zone without a common dimension",(function(){return JSON.stringify({a:t,b:e})})),[t,e]},e.bySide=function(n,r){return y.Rect.Side.match((function(){return e.create(t.bottomLeft({x:Math.ceil(r.left),y:Math.ceil(r.top)}),t.bottomRight({x:Math.floor(r.right),y:Math.ceil(r.top)}))}),(function(){return e.create(t.topLeft({x:Math.floor(r.right),y:Math.ceil(r.top)}),t.bottomLeft({x:Math.floor(r.right),y:Math.floor(r.bottom)}))}),(function(){return e.create(t.topLeft({x:Math.ceil(r.left),y:Math.floor(r.bottom)}),t.topRight({x:Math.floor(r.right),y:Math.floor(r.bottom)}))}),(function(){return e.create(t.topRight({x:Math.ceil(r.left),y:Math.ceil(r.top)}),t.bottomRight({x:Math.ceil(r.left),y:Math.floor(r.bottom)}))}))(n)}}(n=t.Zone||(t.Zone={})),function(t){t.byAxis=function(t,e){return d.fromFoldable((0,g.getFirstSemigroup)(),h.IX)(y.Rect.Axis.toSides(t).map((function(t){return[t,n.bySide(t,e)]})))}}(t.Variants||(t.Variants={})),function(e){function n(t,e){return(0,u.pipe)(y.Rect.intersection(t,e),v.map((function(t){var n=t.width/e.width,r=t.height/e.height,o=(Number.isNaN(n)?0:n/2)+(Number.isNaN(r)?0:r/2);return(0,b.kG)(o>=0,"quality can not be negavite: ".concat(o)),(0,b.kG)(o<=1,"quality can be higher than 1: ".concat(o)),o})))}e.empty={quality:0,point:t.empty},e.qualityOfIntersection=n,e.byViewport=function(t,e){return{quality:(0,u.pipe)(n(t,e),v.getOrElse((function(){return 0})))+(0,u.pipe)(y.Rect.scale(2,e),x.chain(y.Rect.normalize),v.fromEither,v.chain((function(e){return n(t,e)})),v.getOrElse((function(){return 0}))),point:a(e)}},e.fromZone=function(t,n,r){return(0,u.pipe)(h.IX.traverse(x.either)(r,(function(t){return i(n,t)})),x.chain((function(t){var e=t[0],n=t[1];return y.Rect.join(e,n)})),x.chain((function(t){return y.Box.placeIntoRect(n,t)})),x.map((function(n){return n.map((function(n){return e.byViewport(t,n)}))})))}}(r=t.Qualified||(t.Qualified={})),function(t){t.build=function(t,e,n){return(0,u.pipe)(n,d.map((function(n){return r.fromZone(t,e,n)})))}}(t.QualifiedVariants||(t.QualifiedVariants={})),function(t){var e;!function(t){t[t.left=0]="left",t[t.middle=1]="middle",t[t.right=2]="right",t[t.edges=20]="edges",t[t.any=210]="any"}(e=t.Placement||(t.Placement={})),t.takeBy=function(t,e){return function(n){return(0,u.pipe)(n,d.reduceWithIndex({point:r.empty,side:t},(function(n,r,o){return(0,u.pipe)(o,x.map((function(o){return o.filter((function(r,o){return e.toString().includes(o.toString())&&t===n})).reduce((function(t,e){return e.quality>t.point.quality?{point:e,side:n}:t}),r)})),R.unsafeGet)}))).point}},t.preferBy=function(t,e){return function(n){return(0,u.pipe)(n,d.reduceWithIndex({point:r.empty,side:t},(function(n,r,o){return(0,u.pipe)(o,x.map((function(o){return o.reduce((function(r,o,i){return o.quality>r.point.quality||o.quality===r.point.quality&&e.toString().includes(i.toString())&&t===n?{point:o,side:n}:r}),r)})),R.unsafeGet)}))).point}},t.preferTopMiddle=t.preferBy("top",e.middle),t.preferTopEdges=t.preferBy("top",e.edges)}(t.Selector||(t.Selector={}))}(r||(r={}));var S,C=n(83078),P=n(8125),w=n(44060),M=n(101),E=n(89894),L=n(90845);!function(t){!function(t){t.toSelector=function(t){switch(t){case"top":case"topCenter":return{align:"top",selector:r.Selector.preferBy("top",r.Selector.Placement.middle)};case"topRight":return{align:"top",selector:r.Selector.preferBy("top",r.Selector.Placement.right)};case"topLeft":return{align:"top",selector:r.Selector.preferBy("top",r.Selector.Placement.left)};case"bottom":case"bottomCenter":return{align:"bottom",selector:r.Selector.preferBy("bottom",r.Selector.Placement.middle)};case"bottomRight":return{align:"bottom",selector:r.Selector.preferBy("bottom",r.Selector.Placement.right)};case"bottomLeft":return{align:"bottom",selector:r.Selector.preferBy("bottom",r.Selector.Placement.left)};case"left":return{align:"left",selector:r.Selector.preferBy("left",r.Selector.Placement.middle)};case"right":return{align:"right",selector:r.Selector.preferBy("right",r.Selector.Placement.middle)};case"auto":case"center":return{align:y.Rect.Axis.vertical,selector:r.Selector.preferBy("top",r.Selector.Placement.middle)};default:return(0,b.vE)(t)}}}(t.Alignment||(t.Alignment={})),t.ByPoint=function(t){var e=t.point,n=t.className,a=(0,o.__rest)(t,["point","className"]);return i.createElement(c.F.div,(0,o.__assign)({"data-role":"positioned-container",style:e.pipe(l.U(C.mapOrDefault(r.toCss,{})))},(0,p.Sh)(V.wrapper,n,e.pipe(l.U((function(t){return v.isNone(t)?V.hidden:""})))),a))};var e=function(e){var o,u=L.P.useRectWatcher(),c=u.rect,p=u.onMount,s=f.Dx(e.rect),m=f.Dx(e.pinTargetRect),d=h(e.align),g=n(s,c,d,null!==(o=e.selector)&&void 0!==o?o:r.Selector.preferTopMiddle,m,"relative"===e.position);return i.createElement(t.ByPoint,{mount:p,className:e.className,point:g.pipe(l.U(v.map((function(t){return t.tangentialPoint}))))},!0===e.withPin&&g.pipe(l.U((0,a.ls)(v.chain((function(t){return t.median})),v.map((function(e){return i.createElement(t.Pin,{point:e,key:"pin"})})),v.toNullable))),e.children)};t.ByAbsoluteRect=function(t){return i.createElement(e,(0,o.__assign)({},t,{position:"absolute"}))},t.ByRelativeRect=function(t){return i.createElement(e,(0,o.__assign)({},t,{position:"relative"}))},t.Pin=function(t){var e=f.Dx(t.point).pipe(l.U((function(t){return t.side})),l.U((function(t){return N[t]}))),n=f.Dx(t.point).pipe(l.U((function(t){return t.point})),l.U((function(t){var e=t.x;return{top:t.y,left:e}})));return i.createElement(c.F.i,(0,o.__assign)({"data-role":"pin",style:n},(0,p.Sh)(e,N.wrapper)))};var n=function(t,e,n,o,a,c){return s.aj(t,i.useContext(M.l.Context).pipe(l.U((function(t){return t.rect}))),e.pipe(m.x(v.getEq(y.Box.eq).equals)),a).pipe(l.U((function(t){var e=t[0],i=t[1],a=t[2],p=t[3];return(0,u.pipe)(a,v.map((function(t){var a=r.QualifiedVariants.build(i,t,n(e)),l=o(a).point,f=(0,u.pipe)(r.toRect(t,l),v.fromEither,v.chain((function(t){return(0,u.pipe)(y.Rect.getMedian(e,t),v.map((function(e){return{anchorMedian:e,bodyRect:t}})))})),v.chain((function(t){var e=t.anchorMedian,n=t.bodyRect;if(void 0!==p){var o=y.Rect.stickToSide(y.Rect.Side.invert(e.side),p)(n);return l=r.fromRect(o),(0,u.pipe)(y.Rect.getMedian(p,o),v.map((function(t){var e=t.side,n=t.point;return{side:e,point:y.Rect.Point.relativeTo(n,o)}})))}return(0,u.pipe)(v.some(e),v.map((function(t){var e=t.side,r=t.point;return{side:e,point:y.Rect.Point.relativeTo(r,n)}})))})));return{tangentialPoint:r.relativeTo(l,c?e:i),median:f}})))})))},h=function(t){return void 0===t&&(t=y.Rect.Axis.both),(0,P.CI)(y.Rect.Axis,t)?function(e){return r.Variants.byAxis(t,e)}:function(e){var n;return(n={})[t]=r.Zone.bySide(t,e),n}}}(S||(S={}));var _={position:"absolute",border:"".concat(E.ux.px(7)," solid ").concat(w.Il.BackgroundTooltip),transform:"translate(".concat(E.ux.px(-7),", ").concat(E.ux.px(-7),")")},z={borderTopColor:"transparent",borderRightColor:"transparent",borderLeftColor:"transparent",$nest:{"& + *":{transform:"translateY(".concat(E.ux.px(7),")")}}},B={borderTopColor:"transparent",borderRightColor:"transparent",borderBottomColor:"transparent",$nest:{"& + *":{transform:"translateX(".concat(E.ux.px(-7),")")}}},T={borderRightColor:"transparent",borderBottomColor:"transparent",borderLeftColor:"transparent",$nest:{"& + *":{transform:"translateY(".concat(E.ux.px(-7),")")}}},U={borderTopColor:"transparent",borderBottomColor:"transparent",borderLeftColor:"transparent",$nest:{"& + *":{transform:"translateX(".concat(E.ux.px(7),")")}}},N=E.ux.stylesheet({wrapper:[_],top:[z],right:[B],bottom:[T],left:[U]}),V=E.ux.stylesheet({hidden:[{visibility:"hidden",opacity:0}],wrapper:[{position:"absolute",transition:"opacity .2s"}]})}}]);