<template>
    <v-app>
        <v-toolbar dark color="primary" flat dense app>
             
            <v-btn icon @click.stop="drawer = !drawer">
                <v-icon>person</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="searchClick">
                <v-icon>search</v-icon>
            </v-btn>
            <v-btn icon @click="refreshClick">
                <v-icon>refresh</v-icon>
            </v-btn>
            <!-- <v-btn icon @click="setClick" >
                <v-icon>refresh</v-icon>
            </v-btn> -->
        </v-toolbar>
        <v-content style="margin-top:48px;" class="pa-1">
            <v-alert :value="versionShow" type="warning" color="red lighten-2" dark><a @click="downloadClick">(点击复制下载地址) </a>{{versionInfo.message}}
            </v-alert>
            <v-card >
                <v-card-title class='pa-1'>
                    <v-layout align-center justify-start >
                        <v-icon class=" mr-1 pt-1" size="20" color="#1976D2">event</v-icon>
                        <!-- <CalendarIcon  class=" mr-1 pt-1" :fillColor="iconColor" :size='iconSize'></CalendarIcon> -->
                        <span class="mr-1">·</span>
                        <span class="body-1 mr-2 ">日常推</span>
                    </v-layout>
                </v-card-title>
                <v-container fluid grid-list-xs  class="pt-0 pl-1 pr-1 pb-1">
                    <v-layout row wrap>
                        <v-flex xs12>
                            <cube-slide ref="slideRecoms" :data="recoms"  :interval="10000" :loop="slideLoop"  :initial-index="initialIndex">
                                <cube-slide-item v-for="(items, index) in recoms" :key="index"  >
                                    <v-container class='pa-0 pb-2'>
                                        <v-layout row wrap>
                                            <v-flex xs4 v-for="f in items" :key="f.vod_id">
                                                <v-card dark  @click="detailClick(f)">
                                                    <v-img :src="vi + f.vod_pic" aspect-ratio='1' height='148' >
                                                        <v-container fill-height fluid style="padding:0px;margin:0px;">
                                                            <v-layout align-end row wrap fill-height>
                                                                <v-flex xs12  style="background-color:rgba(0, 0, 0, .50);">
                                                                    <span style="white-space: normal;" >{{f.vod_name}} {{f.vod_type}} ({{addTimeFormat(f.vod_addtime)}})</span>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-container>
                                                    </v-img>
                                                </v-card>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                    
                                </cube-slide-item>
                            </cube-slide>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
            <v-card class="mt-1"  >
                <v-card-title class='pa-1'>
                    <v-layout align-center justify-start >
                        <v-icon class=" mr-1 pt-1" size="20" color="#1976D2">event</v-icon>
                        <!-- <CalendarIcon  class=" mr-1 pt-1" :fillColor="iconColor" :size='iconSize'></CalendarIcon> -->
                        <span class="mr-1">·</span>
                        <span class="body-1 mr-2 ">日常搬运</span>
                    </v-layout>
                </v-card-title>
                <v-container  fluid grid-list-xs  class="pa-0 ma-0">
                    <v-layout row wrap class='pa-1 ma-0' >
                        <v-flex v-for="f in animes" :key="f.vod_id" xs4>
                            <v-card dark  @click="detailClick(f)">
                                 <v-img :src="vi + f.vod_pic" aspect-ratio='1' height='145' >
                                     <v-container fill-height fluid style="padding:0px;margin:0px;">
                                        <v-layout align-end justify-center row fill-height>
                                            <v-flex xs12 align-center flexbox style="background-color:rgba(0, 0, 0, .50);">
                                                <span >{{f.vod_name}} {{f.vod_type}} ({{addTimeFormat(f.vod_addtime)}})</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container> 
                                </v-img> 
                            </v-card>
                        </v-flex>
                    </v-layout>
                    <v-layout >
                        <v-flex xs6>
                            <v-list>
                                <v-list-tile v-for="item in films" :key="item.vod_id" avatar @click="detailClick(item)" >
                                    <v-list-tile-content>
                                        <v-list-tile-title >{{item.vod_name}} ({{item.vod_title}})</v-list-tile-title>
                                        <v-list-tile-sub-title>{{item.vod_type}} {{ addTimeFormat(item.vod_addtime) }}</v-list-tile-sub-title>
                                    </v-list-tile-content>

                                </v-list-tile>
                            </v-list>
                        </v-flex>
                        <v-flex xs6>
                            <v-list>
                                <v-list-tile v-for="item in tvs" :key="item.title" avatar @click="detailClick(item)" >
                                    <v-list-tile-content>
                                        <v-list-tile-title >{{item.vod_name}} ({{item.vod_title}})</v-list-tile-title>
                                        <v-list-tile-sub-title>{{item.vod_type}} {{ addTimeFormat(item.vod_addtime) }}</v-list-tile-sub-title>
                                    </v-list-tile-content>

                                </v-list-tile>
                            </v-list>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
            <v-navigation-drawer v-model="drawer" fixed touchless temporary >
                <v-toolbar flat class="transparent">
                    <v-list class="pa-0">
                        <v-list-tile avatar>
                            <v-icon>person</v-icon>
                        </v-list-tile>
                    </v-list>
                </v-toolbar>
                <v-list class="pt-0" dense>
                    <v-divider></v-divider>

                    <v-list-tile v-for="item in menuItems" :key="item.key" :disabled='item.disabled' @click="drawertileClick(item)" >
                        <v-list-tile-action style="min-width:28px;">
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
        </v-content>
        <!-- <v-footer dark color="primary" class="pa-3">
            <v-spacer></v-spacer>
            <div>久庫 beta</div>
        </v-footer> -->
    </v-app>
</template>

<script>
import naj from 'axios';
import cjs from "crypto-js";
// import EventEmitter from 'eventemitter3';
export default {
    name: 'home',
    components: { },
    data: () => ({
        submenu: '',
        message: '',
        films: [],
        animes: [],
        tvs: [],
        recoms:[],
        isLoading: false,
        drawer: null,
        menuItems: [
            {key:1,title:'历史记录',icon:'history',disabled:false},
            // {key:2,title:'收藏',icon:'star',disabled: false},
            {key:3,title:'电影',icon:'movie',disabled: false},
            {key:4,title:'动漫',icon:'local_movies',disabled: false},
            {key:5,title:'电视剧',icon:'tv',disabled: false},
            // {key:6,title:'清除缓存',icon:'delete_outline',disabled:false},
            {key:7,title:'关于',icon:'info_outline',disabled:false},
        ],
        getUrl:'U2FsdGVkX1/KoxGQaY4rbmA6ZRor3tf0kApOsephCF/bBkvaXszyDTkMcn6p/Fdi',
        getVerUrl:'U2FsdGVkX1+SKD25l1NwyzCIFrNVNIC7D2SacCk9cqf1OFxs4R5cckkJXRf/uM6P',
        slideLoop:true,
        initialIndex: 0,
        iconSize: 18,
        iconColor: '#1976D2',
        versionShow: false,
      
        versionInfo: {},
        version: 92,
        toast: null,
        jaim:'%$1a##',
        flwv:'U2FsdGVkX1+QtfxJZW964uGhiYCgL0/R2tb8ValiQbewlc2uAYfobRTTPJKmGOeb',
        vic: 'U2FsdGVkX19SFCeju170Q+RWY/6rU8Dbgv0b2B/put2nWPP7ldZwLu0bbLfnoGwR',
        ll:'@1v#ii',
        //ee: null,
    }),
    mounted: function(){
        let self = this;
        //self.getUrl = self.u();
        //self.getVerUrl = self.vu();
        document.addEventListener("backbutton", self.onBackKeyDown, false);
        self.getData();

        // naj.get(self.flwvm()) 
        // .then(response =>{
        //     let verObj = response.data;
        //     // eslint-disable-next-line
        //     // console.log(verObj);
        //     self.versionInfo = verObj.data;
        //     if(self.versionInfo.ver !== self.version){
        //         self.versionShow = true;
        //     }          
        // })
        // .catch(err => {
        //     alert(err.message);
        // });

        self.toast = this.$createToast({
            txt: '数据加载中...',
            mask: true,
            time: 0,
        });

        //self.ee = new EventEmitter();
        //self.ee.on('another-event', self.emittedtest);
    },
    computed: {
      vi: function(){
            let self = this;
            var bytes  = cjs.AES.decrypt(self.vic, self.ll);
            return bytes.toString(cjs.enc.Utf8);
        },
    },

    methods: {
        downloadClick: function() {
            let dstr = `${this.versionInfo.href}?v=${this.vtime()}`;
            // eslint-disable-next-line
            cordova.plugins.clipboard.copy(dstr);
            alert(`${dstr},\r\n下载地址已复制剪贴板，打开浏览器下载!`);
        },
        vtime: function(){
            return (new Date()).getTime();
        },
        emittedtest: function(c){
            // eslint-disable-next-line
            alert(JSON.stringify(c));
        },
        f: function(){
            let self = this;
            var bytes  = cjs.AES.decrypt('U2FsdGVkX19CURqPX1eXjjG8szrzku9wv5m+oGtQ1OtCmn5NNntYVU9rgFKQPxxP', self.jaim);
            return bytes.toString(cjs.enc.Utf8);
        },
        a: function(){
            let self = this;
            var bytes  = cjs.AES.decrypt('U2FsdGVkX18x8FAdON49BM5x67G4L+QiCe3I/uVk9jndZi+8uA3C7mkmN0Uc7aol', self.jaim);
            return bytes.toString(cjs.enc.Utf8);
        },
        t: function(){
            let j ='%$1a##1';
            var bytes  = cjs.AES.decrypt('U2FsdGVkX19HWx0KPBw9ix4uOIxMKGqE0xjvOCBvtaraHdQji0PM0SCG/G/hoYMt', j);
            return bytes.toString(cjs.enc.Utf8);
        },
        r: function(){
            let j ='%$1a##21';
            var bytes  = cjs.AES.decrypt('U2FsdGVkX19gkwuSZBmaxZdkTbJOB0EaybRCCi4DdUlPH5H2deCpa6jMJ91MVkMB', j);
            return bytes.toString(cjs.enc.Utf8);
        },
        u: function(){
            let self = this;
            var bytes  = cjs.AES.decrypt(this.getUrl, self.jaim);
            return bytes.toString(cjs.enc.Utf8);
        },
        vu: function(){
            let self = this;
            var bytes  = cjs.AES.decrypt(this.getVerUrl, self.jaim);
            return bytes.toString(cjs.enc.Utf8);
        },
        flwvm: function(){
            let self = this;
            var bytes  = cjs.AES.decrypt(this.flwv, self.jaim);
            return bytes.toString(cjs.enc.Utf8);
        },
        //返回键点击响应
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
            if(self.$route.name == 'home'){
                
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
        partition: function(arr, length) {
            let result = [];
            let gindex = 0;
            for (let i = 0, j = arr.length; i < j; i++) {
                if (i % length === 0) {
                    result.push([]);
                    if(i != 0){
                        gindex++;
                    }
                }
                arr[i].gindex = gindex;
                result[result.length - 1].push(arr[i]);
            }
            return result;
        },
        getData: function(){
            let self = this;
            let requestArr = [];
            //alert(self.getUrl + self.r());
            requestArr.push(naj.get("http://192.168.0.105:8099/tp5/public/glf"));//self.f()));
            requestArr.push(naj.get("http://192.168.0.105:8099/tp5/public/gla"));//self.a()));
            requestArr.push(naj.get("http://192.168.0.105:8099/tp5/public/glt"));//self.t()));
            requestArr.push(naj.get("http://192.168.0.105:8099/tp5/public/glr"));//self.r()));
            
            self.toast = this.$createToast({
                txt: '数据加载中...',
                mask: true,
                time: 0,
            });
            self.toast.show();
            naj.all(requestArr)
            .then(naj.spread(function (fr,ar,tr,recoms) {

                 // eslint-disable-next-line
                //console.log(fr.data.data);
                
                self.films = fr.data.data.data;
                self.animes = ar.data.data.data;
                self.tvs = tr.data.data.data;
                self.recoms = self.partition(recoms.data.data.data,6);
                self.toast.hide();
            }))
            .catch(err => {
                self.toast.hide();
                if (err) {
                    alert(JSON.stringify(err));
                }
                //self.loading = false;
            });
        },
        refreshClick: function(){
            let self = this;
            self.getData();
        },
        setClick: function(){
            // this.$router.push({path: '/set'});
            //this.ee.emit('another-event',{name: '111', age: 12});
        },
        searchClick: function(){
            this.$router.push({path : "/Search"});
        },
        drawertileClick: function(item){
            //alert(JSON.stringify(item));
            if(item.title == '历史记录'){
                this.$router.push({path : "/Historys"});
            }else if(item.title == '关于'){
                this.$router.push({path: '/About'});
               
            }else if(item.title == '清除缓存'){
                window.localStorage.clear();
            }else if(item.title == '电影' || item.title == '动漫' || item.title == '电视剧'){
                this.$router.push({path : `/nTemplate/${item.title}`});
            }
        },
        addTimeFormat: function(addtime){
            let newDate = new Date();
             newDate.setTime(addtime * 1000);
             return  newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
        },
        detailClick: function(f){

            this.$router.push({ path: `/nDetail/${f.vod_id}/${f.vod_cid}` });
            //alert(JSON.stringify(f));
            
        }
    },
    beforeRouteEnter (to, from, next) {
        
        next(vm => {
            
            vm.slideLoop = true;
            vm.initialIndex = 0;
          
        })
    },
    beforeRouteLeave(to,from,next) {
        
        let self = this;
        self.slideLoop = false;
        next();

    }
}
</script>
