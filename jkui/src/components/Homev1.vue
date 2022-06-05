<template>
    <v-app>
        <v-toolbar dark color="primary" flat dense app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <!-- <v-btn icon >
                <v-icon>person</v-icon>
            </v-btn>  -->
            <v-spacer></v-spacer>
            <v-btn icon @click="searchClick" disabled>
                <v-icon>search</v-icon>
            </v-btn>
            <!-- <v-btn icon @click="refreshClick">
                <v-icon>refresh</v-icon>
            </v-btn> -->
        </v-toolbar>
         
         <v-content  class="pa-0" style="margin-top:48px;">
            <!-- <v-alert :value="versionShow" type="warning" color="red lighten-2" dark><a @click="downloadClick">(点击复制下载地址) </a>{{versionInfo.message}} -->
            <!-- </v-alert> -->
            <v-card >
                <!-- <v-card-title class='pa-1'>
                    <v-layout align-center justify-start >
                        <v-icon class=" mr-1 pt-1" size="20" color="#1976D2">event</v-icon>
                       
                        <span class="mr-1">·</span>
                        <span class="body-1 mr-2 ">内容</span>
                    </v-layout>                    
                </v-card-title> -->
                
                 <cube-scroll-nav-bar :current="itemTypeCurrent" :labels="labels" :txts="txts" @change="changeHandler" /> 
                <v-container  fluid grid-list-md  :style="{height:scrollHeight + 'px'}" class="pa-0">                    
                    <cube-scroll ref="scrollTemplate" :data="playData" :options="scrollOptions" @pulling-up="pupevent" >
                        <v-layout row wrap style="padding-top:10px;padding-right:5px;">
                          <v-flex xs12  v-for="data in playData" :key="data.item_id">
                            <v-card color="" class="mr-1 ml-1 elevation-10" >
                              <v-card-title primary-title >
                                <div>
                                  <div class="headline title mb-2">{{data.name}}({{data.v_publishyear}})</div>
                                  <span v-html="itemContent(data.itemContent)" class="textpoint" style="max-height:200px;"></span>
                                  
                                </div>
                              </v-card-title>
                              <v-divider light></v-divider>
                              <v-card-actions>
                                <v-btn flat @click="clickPlayDesc(data)" >详情</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="info" @click="looklook(data)">看看</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-flex>

                         
                        </v-layout>
                        <!-- <v-layout row wrap fill-height>
                            <v-flex xs6 v-for="data in playData" :key="data.item_id">
                                <v-card color="blue-grey darken-2" class="white--text">
                                    <v-card-title primary-title>
                                        <div>
                                            <div class="headline">{{data.name}}</div>
                                            <span>{{data.name}}.{{data.name}}</span>
                                        </div>
                                    </v-card-title>
                                    <v-card-actions>
                                        <v-btn flat dark @click="clickPlayPage(data)">{{data.name}}</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-flex>
                        </v-layout> -->
                    </cube-scroll>

                </v-container>
            </v-card>
             
        </v-content>
      <v-navigation-drawer v-model="drawer" fixed touchless temporary >
        <v-toolbar flat class="transparent">
          <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> 
        </v-toolbar>
        <v-divider></v-divider>
        <v-list class="pt-0" dense>
          <template v-for="item in menuItems">
            <v-list-tile v-if="item.code != 'divider'" :key="item.code" :disabled='item.disabled' @click="drawertileClick(item)" >               
              <v-list-tile-action style="min-width:28px;">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>              
            </v-list-tile>
           
            <v-divider v-else :key="item.code"></v-divider>
          
          </template>          
        </v-list>
      </v-navigation-drawer>
      <!-- dialog -->
      <v-dialog v-model="descDialog.display"  fullscreen transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark dense color="primary">
            <v-btn icon dark @click="descDialog.display = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title class="subheading" >{{descDialog.item.name}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn  flat @click="looklook(descDialog.item)"  >看看</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text  class="pa-0 pl-2 pr-2" :style="{height:descDialog.cardTextHeight + 'px'}">
            <div :style="{height:descDialog.cardTextHeight + 'px',overflow:'scroll',paddingTop:'5px'}">
              <div>{{descDialog.item.v_lang}} {{descDialog.item.v_publishyear}}</div>
              <div>{{descDialog.item.v_actor}}</div>
              <v-divider class="mt-2 mb-2"></v-divider>
              <!-- <div>(2014)</div> -->
              <div v-html="itemContent(descDialog.item.itemContent)"></div>
            </div>
          </v-card-text>

          <v-divider></v-divider>
          
        </v-card>
      </v-dialog>
      <!-- about -->
      <v-dialog v-model="dialogAbout" >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            关于
          </v-card-title>

          <v-card-text>
            测试Demo,资源均来自网络。
            cordova+vuetifyjs+cube-ui+dplayer
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              flat
              @click="dialogAbout = false"
            >
              知道了
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- setting -->

    </v-app>
</template>
<script>
import _ from "lodash";
import naj from 'axios';
//import CryptoJS from "crypto-js"
export default {
    name:'homev1',
    data: () => ({
        info:'123',
        descDialog:{
          display:false,
          item:{},
          cardTextHeight:300
        },
        dialogAbout:false,
        toast:null,
        drawer: null,
        menuItems: [
            {code:'video',title:'视频',icon:'movie',disabled:false},
            // {code:'manhua',title:'漫画',icon:'file_present',disabled:true},
            {code:'divider'},
            {code:'history',title:'历史',icon:'history',disabled:true},
            {code:'stars',title:'收藏',icon:'star',disabled: true},
            {code:'download',title:'下载',icon:'file_download',disabled: true},
            // {key:3,title:'电影',icon:'movie',disabled: false},
            // {key:4,title:'动漫',icon:'local_movies',disabled: false},
            {code:'setting',title:'设置',icon:'settings',disabled: true},
            // {key:6,title:'清除缓存',icon:'delete_outline',disabled:false},
            {code:'about',title:'关于',icon:'info_outline',disabled:false},
        ],
        scrollHeight:380,
        itemTypeCurrent: 99,
        itemType:[ {id:99,code:"all",name:"全部"},],
        page:1,
        playData:[],
        scrollOptions: {
            scrollbar: true,
            startY: 0,
            //stopPropagation:true,
            /* lock x-direction when scrolling horizontally and  vertically at the same time */
            directionLockThreshold: 0,
                
            pullUpLoad: {
                threshold: -50,
            },
        }
    }),
    computed:{
        labels(){
            let that = this;
            return _.map(that.itemType,it=>it.id);
        },
        txts(){
            let that = this;
            return _.map(that.itemType,it=>it.name);
        }
    },
    mounted: async function(){
      document.addEventListener("backbutton", this.onBackKeyDown, false);
      this.scrollHeight = window.innerHeight - 1 - 61;
      let result = require('@/assets/content/ity.json'); //await naj.get(`http://127.0.0.1:80/content/ity.json`);

      _.forEach(result,p=>{
        this.itemType.push(p);
      });
      this.getPage(true);
    },
    beforeRouteEnter (to, from, next) {
        next(vm=>{
            vm.onResize(); 
            
            if(from.name == 'nDetail1'){
                
                let scrolly = window.localStorage.getItem("homev1_scrolly");
                //console.log('scrolly entry',scrolly);
                if(scrolly != null){
                    let scrollyto = _.toNumber(scrolly);                
                    vm.$refs.scrollTemplate.scrollTo(0,scrollyto,0);
                    vm.$refs.scrollTemplate.refresh();
                }
            }
        });
    },
    beforeRouteLeave (to, from, next) {
        //console.log('scrolly leave',this.$refs.scrollTemplate.scroll.y);
        window.localStorage.setItem("homev1_scrolly",this.$refs.scrollTemplate.scroll.y);
        next();
    },
    methods:{
        itemContent:function(itemContent){
          var temp = document.createElement("div");
          temp.innerHTML = itemContent;
          return temp.innerText;
        },
        onResize: function(){            
            this.scrollHeight = window.innerHeight -  1 - 61;
        },
        looklook(item){
          //console.log('looklook',item);
          this.$router.push({ path: `/nDetail1/${item.id}`,query: {res: item} });
        },
        drawertileClick: function(item){
            console.log(item);
            if(item.code=='about'){
              this.dialogAbout = true;
            }else if(item.code=='video'){
              this.drawer = false;
              this.page = 1;
              this.itemTypeCurrent = 99;
              this.getPage(true);
              // eslint-disable-next-line
              // cordova.plugins.NkPlugin.coolMethod({action:'homeinfo'}, success=>{
              //   alert(success);
              // }, err=>{
              //   alert(err);
              // });
            }else if(item.code=='setting'){
              console.log('setting');
            }else if(item.code=='history'){
              this.$router.push({path : "/Historys"});
            }
            // if(item.title == '历史记录'){
            //     this.$router.push({path : "/Historys"});
            // }else if(item.title == '关于'){
            //     this.$router.push({path: '/About'});
               
            // }else if(item.title == '清除缓存'){
            //     window.localStorage.clear();
            // }else if(item.title == '电影' || item.title == '动漫' || item.title == '电视剧'){
            //     this.$router.push({path : `/nTemplate/${item.title}`});
            // }
        },
        getContentData(localpath){
          let result = require(localpath);
          return result;
            const p = new Promise((resolve,reject)=>{
                setTimeout(function(){
                  try{
                    let result = require(localpath);
                    resolve(result);
                  }catch(err){
                    reject(err);
                  }
                },5000);
            });
            return p
        },
        async getPage(ch){
          //console.log(ch);
          let that = this;
          that.toast = this.$createToast({
                  time: 0,
                  mask: true,
                  txt: `加载${that.page}页`
              });
          that.toast.show()
          if(ch === true){
            that.playData = [];
          }
          try{
            if(that.itemTypeCurrent == 99){
              let result = require(`@/assets/content/${that.page}.json`);// await naj.get(`http://127.0.0.1:80/content/${that.page}.json`);
              that.playData= that.playData.concat(result.data);        
            }else{
              let result = require(`@/assets/content/${that.itemTypeCurrent}/${that.page}.json`);// await naj.get(`http://127.0.0.1:80/content/${that.itemTypeCurrent}/${that.page}.json`);
              that.playData= that.playData.concat(result.data);
            }
          }catch(err){
            console.log('getContentData',err);
            that.$refs.scrollTemplate.forceUpdate(true);
          }        
          console.log('that.playData',that.playData);
          that.toast.hide();
          that.page++;
          if(ch === true){
            that.$refs.scrollTemplate.scrollTo(0,0,500);
            that.$refs.scrollTemplate.refresh();
          }
          // naj.get(`http://localhost:8099/${that.itemTypeCurrent}/${that.page}.json`) 
          // .then(response =>{
          //     //console.log(response.data);
          //     if(ch === true){
          //       that.playData = [];
          //     }
          //     that.playData = that.playData.concat(response.data)
          //     that.toast.hide();
          //     that.page++;
          //     if(ch === true){
          //         that.$refs.scrollTemplate.scrollTo(0,0,500);
          //         that.$refs.scrollTemplate.refresh();
          //     }
          // })
          // .catch(err => {
          //     alert(err.message);
          //     that.$refs.scrollTemplate.forceUpdate(true);
          // }); 
        },
        clickPlayPage:function(item){
            //console.log(item);
             
            this.$router.push({ path: `/nDetail1/${item.item_id}`,query: {res: item} });
        },
        clickPlayDesc(item){
         // console.log(item);
          this.descDialog.item = item;
          this.descDialog.display = true;
          this.descDialog.cardTextHeight = window.innerHeight - 58;
        },
        clickCarouselItem:function(item){
          alert(item);            
        },
        pupevent: function(){
           this.getPage();
        },
        changeHandler(cur) {
            let that = this;
            if(that.itemTypeCurrent != cur){
                that.page = 1;
                that.playData = [];
                that.itemTypeCurrent = cur;
                that.getPage(true);
            }            
        },
        refreshClick: function(){
            
        },
        searchClick: function(){
         // let that  = this;
          //https://www.jianshu.com/p/d66f058b1211
          // eslint-disable-next-line
           cordova.plugins.NkPlugin.coolMethod({action:'homeinfo'}, success=>{
            alert(success);
           }, err=>{
            alert(err);
           });
  // Encrypt 
// var ciphertext = CryptoJS.AES.encrypt('aaaaaa2112', 'touliao123456789').toString();
// console.log('ciphertext',ciphertext);
// // Decrypt
// var words = CryptoJS.enc.Base64.parse('ZH01g1eQna3vhizycW76ZA==');
// var bytes  = CryptoJS.AES.decrypt(words, '12bde4db586449a5');
// var originalText = bytes.toString(CryptoJS.enc.Utf8);

// console.log(words,bytes,originalText); // 'my message'

          // naj.get('http://localhost:8099/11.html') 
          //   .then(response =>{
              //%3C7e7e7e%3E
          //     let strs = _.split(response.data,"zhuzhualmani%3E");
          //     let res = window.decodeURIComponent(strs[1]);
          //     res = res.substr(0,res.length-2);
          //     var words = CryptoJS.enc.Base64.parse(res);
          //     var parseStr = words.toString(CryptoJS.enc.Utf8);
          //     let jsonRes= JSON.parse(parseStr);
          //     console.log(jsonRes);
          //     that.playData = that.playData.concat(jsonRes)
          //   })
          //   .catch(err => {
          //     console.log(err);
          //   }); 

          
        },
        onBackKeyDown: function() {
          let self = this;
          //alert(self);
          //e.preventDefault();
          // eslint-disable-next-line
          self.toast = this.$createToast({
                  txt: '再点击一次退出',
                  type: 'txt',
                  time: 2000,
              });
          if(self.$route.name == 'homev1'){
              
              document.removeEventListener("backbutton", this.onBackKeyDown, false); // 注销返回键  
              document.addEventListener("backbutton", this.exitApp, false);//绑定退出事件  
              
              self.toast.show();
              // 2秒后重新注册  
              var intervalID = window.setInterval(function() {  
                  //window.plugins.toast.showLongCenter('intervalid');
                  window.clearInterval(intervalID);  
                  document.removeEventListener("backbutton", self.exitApp, false); // 注销返回键  
                  document.addEventListener("backbutton", self.onBackKeyDown, false); // 返回键  
              }, 2000);  
          }else {
              self.toast.hide();
              self.$router.back();
          }
        },
        exitApp: function(){  
          //alert('exitapp');
          navigator.app.exitApp();  
        },  
    }
}
</script>

<style >
.textpoint{
  overflow: hidden;
 text-overflow: ellipsis; 
display: -webkit-box;
-webkit-line-clamp: 5;
line-clamp: 5;
-webkit-box-orient: vertical;
}
.cube-scroll-nav-bar_horizontal .cube-scroll-wrapper{
  text-align: left;
}
</style>
