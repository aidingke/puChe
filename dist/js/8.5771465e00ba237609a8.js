webpackJsonp([8],{183:function(e,a,t){function r(e){t(222)}var s=t(16)(t(200),t(237),r,"data-v-0584dfef",null);e.exports=s.exports},200:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0}),a.default={name:"carDealer",data:function(){return{isShow:!1,total:0,search:{userId:"",userName:"",userTel:""},searchData:{pageNo:1,pageSize:10,userId:"",userName:"",userTel:""},tableData:[]}},created:function(){this.$store.state.breadcrumb=[{path:"/",name:"捕车平台"},{name:"车商管理"}],this.request()},methods:{lookDetail:function(e){location.hash="#/carPlatform/carDealerDetail?id="+e},searchFun:function(){this.searchData.userId=this.search.userId,this.searchData.userName=this.search.userName,this.searchData.userTel=this.search.userTel,this.searchData.pageNo=1,this.request()},currentChange:function(e){this.searchData.pageNo=e,this.request()},request:function(){var e=this;e.$c.ajax({url:"buche/api/manage/dealer",data:{reqAct:"list",pageNo:e.searchData.pageNo,pageSize:e.searchData.pageSize,id:e.searchData.userId,name:e.searchData.userName,tel:e.searchData.userTel},success:function(a){if(e.isShow=!0,"0"===a.retCode){var t=[];a.result.dealerList.forEach(function(e){var a={userId:e.id,userName:e.name,userTel:e.tel,type:"0"===e.type?"企业":"个人",isAuth:"0"===e.isAuth?"未认证":"已认证",regDate:e.regDate,authDate:e.authDate};t.push(a)}),e.total=a.result.totalCnt,e.tableData=t}else e.$message.error({duration:1500,message:a.retMsg})}})}}}},208:function(e,a,t){a=e.exports=t(177)(!0),a.push([e.i,".carDealer .searchBar[data-v-0584dfef]{margin-bottom:10px}.carDealer .searchBar .el-col[data-v-0584dfef]{margin-right:10px;margin-bottom:10px}.carDealer .searchBar button[data-v-0584dfef]{margin-top:4px}","",{version:3,sources:["E:/project/buche/src/pages/carPlatform/carDealer.vue"],names:[],mappings:"AACA,uCACE,kBAAoB,CACrB,AACD,+CACE,kBAAmB,AACnB,kBAAoB,CACrB,AACD,8CACE,cAAgB,CACjB",file:"carDealer.vue",sourcesContent:["\n.carDealer .searchBar[data-v-0584dfef] {\n  margin-bottom: 10px;\n}\n.carDealer .searchBar .el-col[data-v-0584dfef] {\n  margin-right: 10px;\n  margin-bottom: 10px;\n}\n.carDealer .searchBar button[data-v-0584dfef] {\n  margin-top: 4px;\n}\n"],sourceRoot:""}])},222:function(e,a,t){var r=t(208);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);t(178)("2c4536c3",r,!0)},237:function(e,a){e.exports={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return e.isShow?t("div",{staticClass:"carDealer"},[t("el-col",{staticClass:"searchBar",attrs:{span:24}},[t("el-col",{attrs:{span:4,xs:11}},[t("el-input",{attrs:{placeholder:"车商编号"},model:{value:e.search.userId,callback:function(a){e.$set(e.search,"userId",a)},expression:"search.userId"}})],1),e._v(" "),t("el-col",{attrs:{span:4,xs:11}},[t("el-input",{attrs:{placeholder:"车商名称"},model:{value:e.search.userName,callback:function(a){e.$set(e.search,"userName",a)},expression:"search.userName"}})],1),e._v(" "),t("el-col",{attrs:{span:4,xs:11}},[t("el-input",{attrs:{placeholder:"联系电话"},model:{value:e.search.userTel,callback:function(a){e.$set(e.search,"userTel",a)},expression:"search.userTel"}})],1),e._v(" "),t("el-col",{attrs:{span:2}},[t("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.searchFun}},[e._v("搜索")])],1)],1),e._v(" "),t("el-table",{staticStyle:{width:"100%","margin-bottom":"20px"},attrs:{data:e.tableData,border:""}},[t("el-table-column",{attrs:{prop:"userId",label:"车商编号"}}),e._v(" "),t("el-table-column",{attrs:{prop:"userName",label:"车商名称"}}),e._v(" "),t("el-table-column",{attrs:{prop:"userTel",label:"联系电话"}}),e._v(" "),t("el-table-column",{attrs:{prop:"type",label:"车行性质"}}),e._v(" "),t("el-table-column",{attrs:{prop:"isAuth",label:"是否认证"}}),e._v(" "),t("el-table-column",{attrs:{prop:"regDate",label:"注册日期"}}),e._v(" "),t("el-table-column",{attrs:{prop:"authDate",label:"认证日期"}}),e._v(" "),t("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(a){return[t("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(t){e.lookDetail(e.tableData[a.$index].userId)}}},[e._v("查看")])]}}])})],1),e._v(" "),e.total>e.searchData.pageSize?t("el-pagination",{attrs:{background:"",layout:"prev, pager, next",total:e.total},on:{"current-change":e.currentChange}}):e._e()],1):e._e()},staticRenderFns:[]}}});
//# sourceMappingURL=8.5771465e00ba237609a8.js.map