webpackJsonp([1],{"1/oy":function(t,s){},"505S":function(t,s){},"9M+g":function(t,s){},Id91:function(t,s){},NHnr:function(t,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var e=a("7+uW"),n=a("GeUp"),o=a.n(n),i=a("e6fC"),r=a("PJh5"),l=a.n(r),c=a("HKE2"),d=a.n(c),u=(a("9M+g"),a("mtWM")),p=a.n(u),m={dependencies:"api",name:"App",created:function(){this.getPages(),this.getSite()},watch:{$route:["getPages","getSite"]},methods:{getPages:function(){var t=this;p.a.get(this.api+"/pages").then(function(s){t.pages=s.data}).catch(function(t){console.log(t)})},getSite:function(){var t=this;p.a.get(this.api).then(function(s){t.site=s.data}).catch(function(t){console.log(t)})}},data:function(){return{pages:{},site:{}}}},g={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"row no-gutters wrapper",attrs:{id:"app"}},[a("div",{staticClass:"col-md-2 side-nav"},[a("div",{staticClass:"container toggle-nav"},[a("span",{staticClass:"logo btn"},[t._v(t._s(t.site.name))]),t._v(" "),a("button",{directives:[{name:"b-toggle",rawName:"v-b-toggle",value:"nav-wrapper",expression:"'nav-wrapper'"}],staticClass:"btn btn-default float-right"},[a("span",{staticClass:"fa fa-bars"})])]),t._v(" "),a("b-collapse",{staticClass:"container nav-wrapper collapse",attrs:{id:"nav-wrapper"}},[a("h1",{staticClass:"logo"},[t._v(t._s(t.site.name))]),t._v(" "),a("ul",{staticClass:"main-nav"},[a("li",[a("router-link",{attrs:{to:{name:"Blog"},"active-class":"current"}},[t._v("Home")])],1),t._v(" "),t._l(t.pages,function(s){return a("li",[a("router-link",{attrs:{to:{name:"Page",params:{page:s.url}},"active-class":"current"}},[t._v(t._s(s.title))])],1)})],2)])],1),t._v(" "),a("div",{staticClass:"col-md-10 main-content"},[a("router-view"),t._v(" "),t._m(0)],1)])},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("footer",{staticClass:"footer"},[this._v("\n      powered by\n      "),s("a",{attrs:{href:"https://github.com/jtpox/ribbon",target:"_blank"}},[this._v("ribbon")])])}]};var v=a("VU/8")(m,g,!1,function(t){a("505S")},null,null).exports,f=a("/ocq"),h=a("p3jY"),_=a.n(h),j={render:function(){var t=this.$createElement,s=this._self._c||t;return s("div",{staticClass:"hello"},[s("h1",[this._v(this._s(this.msg))])])},staticRenderFns:[]},C=(a("VU/8")({name:"HelloWorld",data:function(){return{msg:"Welcome to Your Vue.js App"}}},j,!1,null,null,null).exports,{name:"Page",created:function(){this.fetchPage()},watch:{$route:"fetchPage"},methods:{fetchPage:function(){var t=this;p.a.get("http://localhost:8081/api/pages/url/"+this.$route.params.page).then(function(s){t.page=s.data}).catch(function(t){console.log(t)})},markdown:function(t){return new d.a.Converter({simpleLineBreaks:!0}).makeHtml(t)}},data:function(){return{page:{details:{},boxes:{}}}}}),b={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"page-content"},[null!==t.page.details.image?a("img",{staticClass:"img-fluid page-image",attrs:{src:"/uploads/images/"+t.page.details.image.file_name}}):t._e(),t._v(" "),a("div",{staticClass:"row no-gutter"},[a("div",{staticClass:"col-md-8 offset-md-2"},[a("div",{staticClass:"card",class:{"post-single":null!==t.page.details.image,"post-no-image":null==t.page.details.image}},[a("div",{staticClass:"card-body text-center"},[a("h1",{staticClass:"card-title"},[t._v(t._s(t.page.details.title))]),t._v(" "),a("p",{staticClass:"card-text",domProps:{innerHTML:t._s(t.markdown(t.page.details.description))}})])])])]),t._v(" "),a("div",{staticClass:"container-fluid"},[a("div",{staticClass:"row"},t._l(t.page.boxes,function(s){return a("div",{class:"col-md-"+s.content_column},[a("div",{staticClass:"card post"},[a("div",{staticClass:"card-body"},[a("h4",{staticClass:"card-title"},[t._v(t._s(s.title))]),t._v(" "),a("p",{staticClass:"card-text",domProps:{innerHTML:t._s(t.markdown(s.content))}})])])])}))])])},staticRenderFns:[]},k=a("VU/8")(C,b,!1,null,null,null).exports,w={dependencies:"api",name:"Blog",created:function(){this.getPosts()},watch:{$route:["getPosts"]},methods:{getPosts:function(){var t=this;p.a.get(this.api+"/blog/page/"+this.page).then(function(s){t.posts=s.data.docs,t.total_pages=s.data.pages}).catch(function(t){console.log(t)})},loadMore:function(){var t=this;this.page=this.page+1,p.a.get(this.api+"/blog/page/"+this.page).then(function(s){for(var a=0;a<s.data.docs.length;a++)t.posts.push(s.data.docs[a])}).catch(function(t){console.log(t)})},markdownLimit:function(t){var s=new d.a.Converter({simpleLineBreaks:!0}),a=t.split(" ").splice(0,50).join(" ");return s.makeHtml(a)}},data:function(){return{page:1,total_pages:0,posts:{}}}},P={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"container-fluid page-content"},[a("div",{staticClass:"row"},[t._l(t.posts,function(s){return a("div",{staticClass:"col-md-6 offset-md-3"},[a("div",{staticClass:"card post"},[null!==s.image?a("router-link",{attrs:{to:{name:"Post",params:{post:s.url}}}},[a("img",{staticClass:"card-img-top",attrs:{src:"/uploads/images/"+s.image.file_name}})]):t._e(),t._v(" "),a("div",{staticClass:"card-body"},[a("small",[a("router-link",{attrs:{to:{name:"Tag",params:{tag:s.tag.url}}}},[t._v(t._s(s.tag.title))])],1),t._v(" "),a("h5",{staticClass:"card-title"},[a("router-link",{attrs:{to:{name:"Post",params:{post:s.url}}}},[t._v(t._s(s.title))])],1),t._v(" "),a("p",{staticClass:"card-text",domProps:{innerHTML:t._s(t.markdownLimit(s.content))}}),t._v(" "),a("p",[a("small",[a("router-link",{attrs:{to:{name:"User",params:{user:s.created_by._id}}}},[t._v(t._s(s.created_by.username))]),t._v("\n                             on "+t._s(t._f("formatDate")(s.created_at))+"\n                        ")],1)])])],1)])}),t._v(" "),t.page<t.total_pages?a("div",{staticClass:"col-md-6 offset-md-3 text-center"},[a("button",{staticClass:"btn btn-outline-danger",attrs:{type:"button"},on:{click:function(s){t.loadMore()}}},[t._v("Older Posts")])]):t._e()],2)])},staticRenderFns:[]},y=a("VU/8")(w,P,!1,null,null,null).exports,x={dependencies:"api",name:"Post",created:function(){this.getPost()},watch:{$route:["getPost"]},methods:{getPost:function(){var t=this;p.a.get(this.api+"/blog/url/"+this.$route.params.post).then(function(s){t.post=s.data}).catch(function(t){console.log(t)})},markdown:function(t){return new d.a.Converter({simpleLineBreaks:!0}).makeHtml(t)}},data:function(){return{post:{}}}},z={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"container-fluid page-content"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-8 offset-md-2 post-title"},[a("h1",[t._v(t._s(t.post[0].title))]),t._v(" "),a("p",[t._v("\n                on\n                "),a("span",{staticClass:"date"},[t._v(t._s(t._f("formatDate")(t.post[0].created_at)))]),t._v(" in\n                "),a("router-link",{attrs:{to:{name:"Tag",params:{tag:t.post[0].tag.url}}}},[t._v(t._s(t.post[0].tag.title))])],1)]),t._v(" "),null!==t.post[0].image?a("div",{staticClass:"col-md-8 offset-md-2 text-center"},[a("img",{staticClass:"img-fluid rounded",attrs:{src:"/uploads/images/"+t.post[0].image.file_name}})]):t._e(),t._v(" "),a("div",{class:{"col-md-6 offset-md-3":null!==t.post[0].image,"col-md-8 offset-md-2":null==t.post[0].image}},[a("div",{staticClass:"card",class:{"post-single":null!==t.post[0].image,"post-no-image":null==t.post[0].image}},[a("div",{staticClass:"card-body"},[a("p",{staticClass:"card-text",domProps:{innerHTML:t._s(t.markdown(t.post[0].content))}})])])]),t._v(" "),a("div",{staticClass:"col-md-8 offset-md-2 about-author"},[a("div",{staticClass:"media"},[a("img",{staticClass:"mr-3 rounded",attrs:{src:"/uploads/profile/"+t.post[0].created_by.avatar,height:"64",width:"64"}}),t._v(" "),a("div",{staticClass:"media-body"},[a("h5",{staticClass:"mt-0"},[a("router-link",{attrs:{to:{name:"User",params:{user:t.post[0].created_by._id}}}},[t._v(t._s(t.post[0].created_by.username))])],1),t._v("\n                    "+t._s(t.post[0].created_by.about)+"\n                ")])])])])])},staticRenderFns:[]},L=a("VU/8")(x,z,!1,null,null,null).exports,H={dependencies:"api",name:"Tag",created:function(){this.getPosts()},watch:{$route:["getPosts"]},methods:{getPosts:function(){var t=this;p.a.get(this.api+"/tags/"+this.$route.params.tag+"/page/"+this.page).then(function(s){t.tag=s.data.tag,t.posts=s.data.posts.docs,t.total_pages=s.data.posts.pages}).catch(function(t){console.log(t)})},loadMore:function(){var t=this;this.page=this.page+1,p.a.get(this.api+"/tags/"+this.$route.params.tag+"/page/"+this.page).then(function(s){for(var a=0;a<s.data.docs.length;a++)t.posts.push(s.data.docs[a])}).catch(function(t){console.log(t)})},markdownLimit:function(t){var s=new d.a.Converter({simpleLineBreaks:!0}),a=t.split(" ").splice(0,50).join(" ");return s.makeHtml(a)}},data:function(){return{tag:{},page:1,total_pages:0,posts:{}}}},M={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"container-fluid page-content"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-6 offset-md-3 text-center"},[a("h1",[t._v(t._s(t.tag.title))]),t._v(" "),a("p",{staticClass:"lead"},[t._v("\n                "+t._s(t.tag.content)+"\n            ")])]),t._v(" "),t._l(t.posts,function(s){return a("div",{staticClass:"col-md-6 offset-md-3"},[a("div",{staticClass:"card post"},[null!==s.image?a("router-link",{attrs:{to:{name:"Post",params:{post:s.url}}}},[a("img",{staticClass:"card-img-top",attrs:{src:"/uploads/images/"+s.image.file_name}})]):t._e(),t._v(" "),a("div",{staticClass:"card-body"},[a("small",[a("router-link",{attrs:{to:{name:"Tag",params:{tag:s.tag.url}}}},[t._v(t._s(s.tag.title))])],1),t._v(" "),a("h5",{staticClass:"card-title"},[a("router-link",{attrs:{to:{name:"Post",params:{post:s.url}}}},[t._v(t._s(s.title))])],1),t._v(" "),a("p",{staticClass:"card-text",domProps:{innerHTML:t._s(t.markdownLimit(s.content))}}),t._v(" "),a("p",[a("small",[a("router-link",{attrs:{to:{name:"User",params:{user:s.created_by._id}}}},[t._v(t._s(s.created_by.username))]),t._v("\n                             on "+t._s(t._f("formatDate")(s.created_at))+"\n                        ")],1)])])],1)])}),t._v(" "),t.page<t.total_pages?a("div",{staticClass:"col-md-6 offset-md-3 text-center"},[a("button",{staticClass:"btn btn-outline-danger",attrs:{type:"button"},on:{click:function(s){t.loadMore()}}},[t._v("Older Posts")])]):t._e()],2)])},staticRenderFns:[]},F=a("VU/8")(H,M,!1,null,null,null).exports,E={dependencies:"api",name:"User",created:function(){this.getPosts()},watch:{$route:["getPosts"]},methods:{getPosts:function(){var t=this;p.a.get(this.api+"/users/"+this.$route.params.user+"/page/"+this.page).then(function(s){t.user=s.data.user,t.posts=s.data.posts.docs,t.total_pages=s.data.posts.pages}).catch(function(t){console.log(t)})},loadMore:function(){var t=this;this.page=this.page+1,p.a.get(this.api+"/users/"+this.$route.params.user+"/page/"+this.page).then(function(s){for(var a=0;a<s.data.docs.length;a++)t.posts.push(s.data.docs[a])}).catch(function(t){console.log(t)})},markdownLimit:function(t){var s=new d.a.Converter({simpleLineBreaks:!0}),a=t.split(" ").splice(0,50).join(" ");return s.makeHtml(a)}},data:function(){return{user:{},page:1,total_pages:0,posts:{}}}},U={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"container-fluid page-content"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-6 offset-md-3 text-center"},[a("h1",[t._v(t._s(t.user.username))]),t._v(" "),a("p",{staticClass:"lead"},[t._v("\n                "+t._s(t.user.about)+"\n            ")])]),t._v(" "),t._l(t.posts,function(s){return a("div",{staticClass:"col-md-6 offset-md-3"},[a("div",{staticClass:"card post"},[null!==s.image?a("router-link",{attrs:{to:{name:"Post",params:{post:s.url}}}},[a("img",{staticClass:"card-img-top",attrs:{src:"/uploads/images/"+s.image.file_name}})]):t._e(),t._v(" "),a("div",{staticClass:"card-body"},[a("small",[a("router-link",{attrs:{to:{name:"Tag",params:{tag:s.tag.url}}}},[t._v(t._s(s.tag.title))])],1),t._v(" "),a("h5",{staticClass:"card-title"},[a("router-link",{attrs:{to:{name:"Post",params:{post:s.url}}}},[t._v(t._s(s.title))])],1),t._v(" "),a("p",{staticClass:"card-text",domProps:{innerHTML:t._s(t.markdownLimit(s.content))}}),t._v(" "),a("p",[a("small",[a("router-link",{attrs:{to:{name:"User",params:{user:s.created_by._id}}}},[t._v(t._s(s.created_by.username))]),t._v("\n                             on "+t._s(t._f("formatDate")(s.created_at))+"\n                        ")],1)])])],1)])}),t._v(" "),t.page<t.total_pages?a("div",{staticClass:"col-md-6 offset-md-3 text-center"},[a("button",{staticClass:"btn btn-outline-danger",attrs:{type:"button"},on:{click:function(s){t.loadMore()}}},[t._v("Older Posts")])]):t._e()],2)])},staticRenderFns:[]},B=a("VU/8")(E,U,!1,null,null,null).exports;e.a.use(f.a),e.a.use(_.a);var O=new f.a({routes:[{path:"/",name:"Blog",component:y},{path:"/:page",name:"Page",component:k},{path:"/post/:post",name:"Post",component:L},{path:"/tag/:tag",name:"Tag",component:F},{path:"/user/:user",name:"User",component:B}]});e.a.use(o.a),e.a.use(i.a),e.a.config.productionTip=!1,o.a.constant("api","http://localhost:8081/api"),e.a.filter("formatDate",function(t){if(t)return l()(String(t)).format("MMM Do, YYYY")}),e.a.filter("markdownLimit",function(t){var s=new d.a.Converter({simpleLineBreaks:!0}),a=t.split(" ").splice(0,50).join(" ");return s.makeHtml(a)}),new e.a({el:"#app",router:O,components:{App:v},template:"<App/>"})},uslO:function(t,s,a){var e={"./af":"3CJN","./af.js":"3CJN","./ar":"3MVc","./ar-dz":"tkWw","./ar-dz.js":"tkWw","./ar-kw":"j8cJ","./ar-kw.js":"j8cJ","./ar-ly":"wPpW","./ar-ly.js":"wPpW","./ar-ma":"dURR","./ar-ma.js":"dURR","./ar-sa":"7OnE","./ar-sa.js":"7OnE","./ar-tn":"BEem","./ar-tn.js":"BEem","./ar.js":"3MVc","./az":"eHwN","./az.js":"eHwN","./be":"3hfc","./be.js":"3hfc","./bg":"lOED","./bg.js":"lOED","./bm":"hng5","./bm.js":"hng5","./bn":"aM0x","./bn.js":"aM0x","./bo":"w2Hs","./bo.js":"w2Hs","./br":"OSsP","./br.js":"OSsP","./bs":"aqvp","./bs.js":"aqvp","./ca":"wIgY","./ca.js":"wIgY","./cs":"ssxj","./cs.js":"ssxj","./cv":"N3vo","./cv.js":"N3vo","./cy":"ZFGz","./cy.js":"ZFGz","./da":"YBA/","./da.js":"YBA/","./de":"DOkx","./de-at":"8v14","./de-at.js":"8v14","./de-ch":"Frex","./de-ch.js":"Frex","./de.js":"DOkx","./dv":"rIuo","./dv.js":"rIuo","./el":"CFqe","./el.js":"CFqe","./en-au":"Sjoy","./en-au.js":"Sjoy","./en-ca":"Tqun","./en-ca.js":"Tqun","./en-gb":"hPuz","./en-gb.js":"hPuz","./en-ie":"ALEw","./en-ie.js":"ALEw","./en-il":"QZk1","./en-il.js":"QZk1","./en-nz":"dyB6","./en-nz.js":"dyB6","./eo":"Nd3h","./eo.js":"Nd3h","./es":"LT9G","./es-do":"7MHZ","./es-do.js":"7MHZ","./es-us":"INcR","./es-us.js":"INcR","./es.js":"LT9G","./et":"XlWM","./et.js":"XlWM","./eu":"sqLM","./eu.js":"sqLM","./fa":"2pmY","./fa.js":"2pmY","./fi":"nS2h","./fi.js":"nS2h","./fo":"OVPi","./fo.js":"OVPi","./fr":"tzHd","./fr-ca":"bXQP","./fr-ca.js":"bXQP","./fr-ch":"VK9h","./fr-ch.js":"VK9h","./fr.js":"tzHd","./fy":"g7KF","./fy.js":"g7KF","./gd":"nLOz","./gd.js":"nLOz","./gl":"FuaP","./gl.js":"FuaP","./gom-latn":"+27R","./gom-latn.js":"+27R","./gu":"rtsW","./gu.js":"rtsW","./he":"Nzt2","./he.js":"Nzt2","./hi":"ETHv","./hi.js":"ETHv","./hr":"V4qH","./hr.js":"V4qH","./hu":"xne+","./hu.js":"xne+","./hy-am":"GrS7","./hy-am.js":"GrS7","./id":"yRTJ","./id.js":"yRTJ","./is":"upln","./is.js":"upln","./it":"FKXc","./it.js":"FKXc","./ja":"ORgI","./ja.js":"ORgI","./jv":"JwiF","./jv.js":"JwiF","./ka":"RnJI","./ka.js":"RnJI","./kk":"j+vx","./kk.js":"j+vx","./km":"5j66","./km.js":"5j66","./kn":"gEQe","./kn.js":"gEQe","./ko":"eBB/","./ko.js":"eBB/","./ky":"6cf8","./ky.js":"6cf8","./lb":"z3hR","./lb.js":"z3hR","./lo":"nE8X","./lo.js":"nE8X","./lt":"/6P1","./lt.js":"/6P1","./lv":"jxEH","./lv.js":"jxEH","./me":"svD2","./me.js":"svD2","./mi":"gEU3","./mi.js":"gEU3","./mk":"Ab7C","./mk.js":"Ab7C","./ml":"oo1B","./ml.js":"oo1B","./mr":"5vPg","./mr.js":"5vPg","./ms":"ooba","./ms-my":"G++c","./ms-my.js":"G++c","./ms.js":"ooba","./mt":"oCzW","./mt.js":"oCzW","./my":"F+2e","./my.js":"F+2e","./nb":"FlzV","./nb.js":"FlzV","./ne":"/mhn","./ne.js":"/mhn","./nl":"3K28","./nl-be":"Bp2f","./nl-be.js":"Bp2f","./nl.js":"3K28","./nn":"C7av","./nn.js":"C7av","./pa-in":"pfs9","./pa-in.js":"pfs9","./pl":"7LV+","./pl.js":"7LV+","./pt":"ZoSI","./pt-br":"AoDM","./pt-br.js":"AoDM","./pt.js":"ZoSI","./ro":"wT5f","./ro.js":"wT5f","./ru":"ulq9","./ru.js":"ulq9","./sd":"fW1y","./sd.js":"fW1y","./se":"5Omq","./se.js":"5Omq","./si":"Lgqo","./si.js":"Lgqo","./sk":"OUMt","./sk.js":"OUMt","./sl":"2s1U","./sl.js":"2s1U","./sq":"V0td","./sq.js":"V0td","./sr":"f4W3","./sr-cyrl":"c1x4","./sr-cyrl.js":"c1x4","./sr.js":"f4W3","./ss":"7Q8x","./ss.js":"7Q8x","./sv":"Fpqq","./sv.js":"Fpqq","./sw":"DSXN","./sw.js":"DSXN","./ta":"+7/x","./ta.js":"+7/x","./te":"Nlnz","./te.js":"Nlnz","./tet":"gUgh","./tet.js":"gUgh","./tg":"5SNd","./tg.js":"5SNd","./th":"XzD+","./th.js":"XzD+","./tl-ph":"3LKG","./tl-ph.js":"3LKG","./tlh":"m7yE","./tlh.js":"m7yE","./tr":"k+5o","./tr.js":"k+5o","./tzl":"iNtv","./tzl.js":"iNtv","./tzm":"FRPF","./tzm-latn":"krPU","./tzm-latn.js":"krPU","./tzm.js":"FRPF","./ug-cn":"To0v","./ug-cn.js":"To0v","./uk":"ntHu","./uk.js":"ntHu","./ur":"uSe8","./ur.js":"uSe8","./uz":"XU1s","./uz-latn":"/bsm","./uz-latn.js":"/bsm","./uz.js":"XU1s","./vi":"0X8Q","./vi.js":"0X8Q","./x-pseudo":"e/KL","./x-pseudo.js":"e/KL","./yo":"YXlc","./yo.js":"YXlc","./zh-cn":"Vz2w","./zh-cn.js":"Vz2w","./zh-hk":"ZUyn","./zh-hk.js":"ZUyn","./zh-tw":"BbgG","./zh-tw.js":"BbgG"};function n(t){return a(o(t))}function o(t){var s=e[t];if(!(s+1))throw new Error("Cannot find module '"+t+"'.");return s}n.keys=function(){return Object.keys(e)},n.resolve=o,t.exports=n,n.id="uslO"},zj2Q:function(t,s){}},["NHnr"]);
//# sourceMappingURL=app.05a1c07b07cb3d75e5c5.js.map