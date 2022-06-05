<template>
    <v-app >
        <v-toolbar dark color="primary" fixed dense >
            <v-btn icon @click="backClick">
                <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title><span class="body-2">{{titleName}}</span></v-toolbar-title>
            <v-spacer></v-spacer>

            <v-menu :nudge-width="100">
                <template v-slot:activator="{ on }">
                <v-toolbar-title v-on="on">
                    <span class='body-1'>{{srcName}}</span>
                    <v-icon dark>arrow_drop_down</v-icon>
                </v-toolbar-title>
                </template>

                <v-list>
                    <v-list-tile
                        v-for="(item, index) in ffvod.vod_url"
                        :key="index" @click="sourceSelectClick(item)"
                    >
                        
                        <v-list-tile-avatar>
                            <v-icon :color="selectColor(item)">info</v-icon>
                        </v-list-tile-avatar>

                        <v-list-tile-content  >
                            <v-list-tile-title  >{{item.name}}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-menu>
            <v-btn icon @click="refreshClick">
                <v-icon>refresh</v-icon>
            </v-btn>
        </v-toolbar>
        
         

        <v-content style="margin-top:48px;" >
            
                <v-container  class="pa-0">
                    <v-layout  column  v-show="!showAdv">
                        <v-touch
                            @panend="playerpanend"
                            @panleft="playerpanleft" 
                            @panright="playerpanright" 
                            @panup="plaerypanup" 
                            @pandown="plaerypandown"
                            @doubletap="playerdoubletap"
                            v-bind:doubletap-options="{intervall: 400}"
                            @tap="onTap"
                             
                        >
                            <v-flex xs12 :style="{height:playHeight+'px'}">
                                <d-player ref="player"  :style="{height:playHeight+'px'}"
                                    :options="options" 
                                    @fullscreen="fullscreen" 
                                    @fullscreen_cancel="fullscreen_cancel"                                    
                                    @canplay="canplay"
                                    @canplaythrough="canplaythrough"
                                    @emptied="emptied"
                                    @ended="ended"
                                    @error="error"
                                    @loadeddata="loadeddata"
                                    @pause="pause"
                                    @play="play"
                                    @playing="playing"
                                    @progress="progress"
                                    @ratechange="ratechange"
                                    @seeked="seeked"
                                    @seeking="seeking"
                                    @stalled="stalled"
                                    @suspend="suspend"
                                    @timeupdate="timeupdate"
                                    @volumechange="volumechange"
                                    @waiting="waiting"
                                    @loadedmetadata="loadedmetadata"
                                    @loadstart="loadstart"
                                ></d-player>
                            </v-flex >
                        </v-touch>
                    </v-layout>
                    <v-layout  column v-show="showAdv" >
                        <v-flex :style="{height:playHeight+'px'}" class='pt-2'>
                            <ul style="height:200px;">
                                <li v-for="(info,index) in infos" :key="index" v-html="info" class="subtitle-1"> </li>
                            </ul>
                        </v-flex>
                    </v-layout>
                </v-container>
                
                <v-container grid-list-xs fluid style="padding:1px;">
                    <v-layout align-space-around justify-center column >
                        <v-flex xs12 >
                            
                            <cube-tab-bar v-model="selectedLabel"
                                            show-slider
                                            :use-transition="false"
                                            ref="tabNav"
                                            :data="tabLabels">
                            </cube-tab-bar>
                            <div >
                                
                                <cube-slide ref="slide" :loop="false" :initial-index="initialIndex" 
                                    :auto-play="false" :show-dots="false" :options="slideOptions" @scroll="scroll" @change="changePage"  >
                                    <!-- 分集 -->
                                    <cube-slide-item>
                                        <cube-scroll-nav-bar v-if="labels.length > 1" ref="groupNavbar" :options="scrollnavbarOptions" :current="current" :labels="labels" @change="changeHandler" />

                                        <div :style="{height:scrollHeight+'px'}" style="margin:5px;"> 
                                            <cube-scroll ref="scrollone" :options="scrollOptions">
                                                <v-container grid-list-md text-xs-center class="pa-1">
                                                    <v-layout align-center justify-space-around row wrap >
                                                        <v-flex xs6 v-for="(ji,index) in playArr" :key="index"  >
                                                           
                                                            <cube-button :outline="getActive(ji.index)" @click="playerji(ji)">{{ji.name}}</cube-button>
                                                             
                                                        </v-flex>
                                                    </v-layout>
                                                </v-container>
                                            </cube-scroll>
                                        </div>
                                    </cube-slide-item>
                                    <!-- 介绍 -->
                                    <cube-slide-item>
                                        <div :style="{height:scrollHeight+'px'}" style="margin:5px;"> 
                                            <cube-scroll ref="scrolltwo" :options="scrollOptions">
                                                <v-card class=" ma-0 pa-0" >
                                                    <v-container>
                                                        <v-layout>
                                                            <v-flex xs4>
                                                                <v-img aspect-ratio="1" 
                                                                :src="vi + ffvod.vod_pic" contain ></v-img>
                                                            </v-flex>
                                                            <v-flex xs8>
                                                                <v-card-title class="pa-1">
                                                                    <div>
                                                                        <p style="white-space:normal;" class="subheading font-weight-regular mb-1">{{ffvod.vod_name}}</p>
                                                                        <!-- <p style="white-space:normal;" class="caption mt-1 mb-1">{{ffvod.vod_actor}}</p> -->
                                                                        <p style="white-space:normal;" class="caption" v-html="ffvod.vod_content" ></p>
                                                                    </div>
                                                                </v-card-title>
                                                            </v-flex>
                                                        </v-layout>
                                                    </v-container>
                                                </v-card>
                                            </cube-scroll>
                                        </div>
                                    </cube-slide-item>
                                     
                                </cube-slide>
                            </div>
                                
                        </v-flex> 
                    </v-layout>
                </v-container>
            
        </v-content>
    </v-app>
</template>

<script>
import nja from 'axios';
import VueDPlayer from 'vue-dplayer'
import 'vue-dplayer/dist/vue-dplayer.css'
import '../common/helpers/util.js';
import cjs from "crypto-js";
import request from 'request';
export default {
    name: 'ndetail',
    components: {
        'd-player': VueDPlayer,
    },
    data(){
        return {
            srcName: '',
            current: '',
            labels: [],
            panDirection:{isPan:false,direction:'',leftorright:''},
            infos:[],
            showAdv: true,
            titleName:'',
            scrollnavbarOptions:{
                stopPropagation:true,
            },
            slideOptions: {
                listenScroll: true,
                probeType: 3,
                scrollY: false,
                /* lock y-direction when scrolling horizontally and  vertically at the same time */
                directionLockThreshold: 0
            },
            scrollOptions: {
                scrollbar: false,
                startY: 0,
                //stopPropagation:true,
                /* lock x-direction when scrolling horizontally and  vertically at the same time */
                directionLockThreshold: 0
            },
            selectedLabel: '分集',
            tabLabels: [{ label:'分集', key:1 },{ label:'简介', key:2 }],
            
            ffvod: {},
            options: {
                video: {
                    type: 'hls',
                    pic: './loading.png',
                },
                autoplay: false,                
                theme: '#1976d2',
                screenshot: false,
                // danmaku: {
                //     id: 0,
                //     api: 'http://ywd.fun/danmaku',
                // },
                contextmenu: [{
                    text: '主站',
                    click: ( ) => {
                        this.$electron.shell.openExternal('http://9khezi.com');
                    }
                }],
                vod_name: '',
                ji_name: '',
                testfunc: function() { 
                }
            },
             
            playHeight: 200,
            playHeightCache:0,
            scrollHeight:200,
            windowSize:{},
            playArr:[],
            
            playAllLength: 0,
            
            brightness: 0.5,
            volume:0.5,
            channelIndex: 0,
            groupIndex: 0,
            jiIndex: 0,
            key: 0,
            cid: 0,
            ifFullScreen: false,
            toast: null,
            ul: 'U2FsdGVkX1/RE3G9R+sGR6niQHcfMwr8CAwke6yuCYirVXruxHYgwRuPgcTpD6sY',
            ll:'@1v#ii',
            self1:'ii@#^%',
            isPlayThrough: false,
            self1d: '##$!@Aa',
            
        };
    },
    created:function(){
        let self = this;
        // eslint-disable-next-line
        let brightness = cordova.plugins.brightness;
        brightness.setKeepScreenOn(true);
        brightness.getBrightness(self.getBrgSuccess);

        
    },
    mounted: function(){
        let self = this;
        // window.localStorage.clear();
        

        self.toast = this.$createToast({
                txt: '资源获取中...',
                mask: true,
                time: 0,
            });
        // eslint-disable-next-line
        self.key = self.$route.params.key;
        // eslint-disable-next-line
        self.cid = self.$route.params.cid;
        self.getDetail();
    },
    destroyed: function(){
        // eslint-disable-next-line
        let brightness = cordova.plugins.brightness;
        // // value should be float in range from 0 to 1.
        brightness.setBrightness(-1, null, null);
        // // success([-1,0-1]) float 0-1 is a brightness level, -1 represents a system default
        // brightness.getBrightness(success, error);
        // prevents sleep
        brightness.setKeepScreenOn(false);

    },
    beforeRouteLeave (to, from, next) {
        let self = this;
        self.toast.hide();
        self.$refs.player.dp.destroy();
        next();
    },
    computed: {
        
        initialIndex: function() {
            let self = this;
            let index = 0;
            index = this.findIndex(this.tabLabels, item => item.label === self.selectedLabel);
            return index;
        },
        vi: function(){
            let self = this;
            var bytes  = cjs.AES.decrypt(self.ul, self.ll);
            return bytes.toString(cjs.enc.Utf8);
        },
        cdm: function(){
            var dms = cjs.AES.decrypt('U2FsdGVkX19GPFl1TLDsT7elGIonpxvowd6+1NPlfpfpD7E48oUtg1WYviyzWPyc', this.self1d);
            return dms.toString(cjs.enc.Utf8);
        },
    },
    methods:{
        sourceSelectClick: function(item){
            //alert(JSON.stringify(item));  
            let self = this;
            
            let playji = JSON.parse(window.localStorage.getItem(self.ffvod.vod_id.toString()));
            if(playji == null || item.sort != playji.channelIndex){
                self.channelIndex = item.sort;
                self.groupIndex = 0;
                self.jiIndex = 0;
                self.$refs.scrollone.scrollTo(0,0);
            }else if(playji != null){
                self.channelIndex = playji.channelIndex;
                self.groupIndex = playji.groupIndex;
                self.jiIndex = playji.jiIndex;
            }
            self.changeChannel();
        },
        selectColor: function(item){
            let self = this;
            if(item.sort == self.channelIndex){return 'green darken-2';}
            return '';
        },
        dg: function() {
            var bytes  = cjs.AES.decrypt('U2FsdGVkX1+X7KkAvXKOYUD5gUgs1pVpY88LjTLBKA57yefVXhRnAldGGmGf5w7j', this.self1);
            return bytes.toString(cjs.enc.Utf8);
        },
        dm: function(){
            var dms = cjs.AES.decrypt('U2FsdGVkX19GPFl1TLDsT7elGIonpxvowd6+1NPlfpfpD7E48oUtg1WYviyzWPyc', this.self1d);
            return dms.toString(cjs.enc.Utf8);
        },
        changeChannel: function(){
            let self = this;
            self.labels = [];
            self.playArr = [];
            let channelObj = self.ffvod.vod_url.filter(item => item.sort == self.channelIndex)[0];
            
            self.srcName = channelObj.name;
            channelObj.pl.forEach((item,index) => {
                self.labels.push(`${(index*100)+1}-${(index*100)+100}`);
            });
            self.current = self.labels[self.groupIndex];
            self.playArr = channelObj.pl[self.groupIndex];

            self.onResize();
            self.$nextTick(() => {
                if(self.labels.length > 1){
                    self.$refs.groupNavbar.refresh();
                }
                let pos = self.findIndex(self.playArr,item => item.index== self.jiIndex);
                if(pos > 4){
                    let scrolltoy = ((pos/2)*58) - 58;
                        
                    self.$refs.scrollone.scrollTo(0,-scrolltoy,);
                    self.$refs.scrollone.refresh();
                }
            });
        },
        getDetail: function(){
            let self =this;
            
            self.toast.show();
            // eslint-disable-next-line
            //console.log(self.dg());
            nja.get("http://192.168.0.105:8099/tp5/public/gd"//self.dg()
            , {
                params: {
                    secType: self.cid,
                    key: self.key,
                }
            })
            .then(response => {
                let self = this;
                // eslint-disable-next-line
                // console.log(JSON.stringify(response.data.data.vod_url));
                self.ffvod = response.data.data;
                self.titleName = self.ffvod.vod_name;
                self.onResize();
                self.labels = [];
                self.channelIndex = self.ffvod.vod_url[0].sort;

                let playji = JSON.parse(window.localStorage.getItem(self.ffvod.vod_id.toString()));
                // eslint-disable-next-line
               // console.log('playji:'+JSON.stringify(playji));
                if(playji != null){
                    self.channelIndex = playji.channelIndex;
                    self.groupIndex = playji.groupIndex;
                    self.jiIndex = playji.jiIndex;
                }
                
                // eslint-disable-next-line
                // console.log(JSON.stringify(self.ffvod.vod_url));
                let channelObj = self.ffvod.vod_url.filter(item => item.sort == self.channelIndex)[0];
                self.srcName = channelObj.name;
                channelObj.pl.forEach((item,index) => {
                    self.labels.push(`${(index*100)+1}-${(index*100)+100}`);
                });
                
                self.current = self.labels[self.groupIndex];
                self.playArr = channelObj.pl[self.groupIndex];
                self.playAllLength = channelObj.length;
                //self.jiIndex = index;
                self.onResize();
                self.$nextTick(() => {
                   if(self.labels.length > 1){
                       self.$refs.groupNavbar.refresh();
                   }
                    let pos = self.findIndex(self.playArr,item => item.index == self.jiIndex);
                    if(pos > 4){
                        let scrolltoy = ((pos/2)*58) - 58;
                         
                        self.$refs.scrollone.scrollTo(0,-scrolltoy,);
                        self.$refs.scrollone.refresh();
                    }
                });
                
                let jitmp = channelObj.pl[self.groupIndex].filter(item => item.index == self.jiIndex);
                self.infos.push(`上次观看 <span class="font-weight-medium"> ${jitmp[0].name} </span> 点击播放...`);
                
                self.toast.hide();
            }).catch(err => {
                self.toast.hide();
                alert(err.message);
            });
        },
        changeHandler(cur) {
            let self = this;
            self.current = cur
            let index  = this.findIndex(self.labels,item=>item ==cur);
            self.groupIndex = index;
            let channelObj = self.ffvod.vod_url.filter(item =>item.sort == self.channelIndex)[0];
            self.playArr = channelObj.pl[self.groupIndex];
            self.playAllLength = channelObj.length;
        },
        getActive: function(index){
            let self = this;
            
            if(index == self.jiIndex){
                return false;
            }
            return true;
        },
        canplay: function(){
            // eslint-disable-next-line
            // console.log('canplay');
        },
        canplaythrough: function(){
             let self = this;
            // eslint-disable-next-line
            // console.log('canplaythrough');
           
            //if(self.showAdv) {
                //self.infos.push(`5秒后,播放...`);
                //self.isPlayThrough = true;
                //setTimeout(()=>{
                    //self.showAdv = false;
                    this.$refs.player.dp.HideMessage();
                    self.$refs.player.dp.play();
                 //   self.isPlayThrough = false;
               // },5000);
                
            //}
            //if(self.ifFullScreen){
                 
            //}
            
        },
        emptied: function(){
            // eslint-disable-next-line
            //console.log('emptied');
            let self = this;
            //self.infos.push("加载中...");
            self.$refs.player.dp.ShowMessage(this.loadingText);        
        },
        ended: function(){
            // eslint-disable-next-line
            //console.log('ended');
            let self = this;
            let nindex = self.jiIndex + 1;
             
            if(nindex < self.playAllLength) {

                let gindex = 0;
                let chu = Math.floor(nindex / 100);
                // let yu = nindex % 100;
                gindex = chu;
                self.groupIndex = gindex;
                self.jiIndex = nindex;
                let channelObj = self.ffvod.vod_url.filter(item => item.sort == self.channelIndex)[0];
                
                self.current = self.labels[self.groupIndex];
                self.playArr = channelObj.pl[self.groupIndex];
                self.playAllLength = channelObj.length;
                let ji = channelObj.pl[self.groupIndex].filter(item => item.index == self.jiIndex)[0];
                //if(!self.ifFullScreen){
                    self.infos = [];
                    //this.showAdv = true;
                    self.infos.push(`播放 ${self.ffvod.vod_name} ${ji.name}`);
                //}else{
                    self.$refs.player.dp.notice(`播放 ${self.ffvod.vod_name} ${ji.name}`,1000);
                //}

                let playji = {
                    channelIndex: self.channelIndex,
                    groupIndex: self.groupIndex,
                    jiIndex:self.jiIndex,
                    vod_id: self.ffvod.vod_id,
                };
                window.localStorage.setItem(self.ffvod.vod_id.toString(), JSON.stringify(playji));
                self.setHistorys(ji);
                
                this.$refs.player.dp.pause()
                this.$refs.player.dp.switchVideo({
                    type: 'hls',
                    url: ji.url,
                    pic: './loading.png',
                }, {
                    id: playji.vod_id,
                    api: self.dm(),
                    user: self.ffvod.vod_name,
                    gindex: playji.groupIndex,
                    index: playji.jiIndex,
                    maximum: 100,
                });
            }else{
                alert('已是最后一集');
            }
        },
        error: function(){
             // eslint-disable-next-line
            //console.log('error');
            alert("加载错误...");
            this.$refs.player.dp.pause()
        },
        loadeddata: function(){
            // eslint-disable-next-line
            // console.log('loadeddata');
            //let self = this;
            // self.infos.push("加载数据中...");
        },
        loadedmetadata: function(){
            // eslint-disable-next-line
            // console.log('loadedmetadata');
        },
        loadstart: function(){
            // eslint-disable-next-line
            // console.log('loadstart');
        },
        ///////////////////////////////
        pause: function(){
             // eslint-disable-next-line
            //console.log('pause');
        },
        play: function(){
            // eslint-disable-next-line
            // console.log('play');
            
        },
        playing: function(){
             // eslint-disable-next-line
            // console.log('playing');
          
        },
        progress: function(){
             // eslint-disable-next-line
            // console.log('progress');
        },
        ratechange: function(){
             // eslint-disable-next-line
           // console.log('ratechange');
        },
        seeked: function(){
             // eslint-disable-next-line
           // console.log('seeked');
        },
        seeking: function(){
             // eslint-disable-next-line
           // console.log('seeking');
        },
        stalled: function(){
             // eslint-disable-next-line
            // console.log('stalled');
             
        },
        suspend: function(){
             // eslint-disable-next-line
            //console.log('suspend');
        },
        timeupdate: function(){
             // eslint-disable-next-line
           // console.log('timeupdate');
        },
        volumechange: function(){
             // eslint-disable-next-line
           // console.log('volumechange');
        },
        waiting: function(){
            // this.$refs.player.dp.notice("等待数据中...");
              this.$refs.player.dp.ShowMessage("等待数据中...");
        },
         
        playerdoubletap: function(){
            //alert('d');
            // if(this.$refs.player.dp.video.paused){
            //     this.$refs.player.dp.play();
            // }else{
            //     this.$refs.player.dp.pause();
            // }
            this.$refs.player.dp.toggle();
        },
        playerpanend: function(){
            let self = this;
            // eslint-disable-next-line
            //console.log("playerpanend:"+ JSON.stringify(p));
            self.panDirection.isPan = false;
            self.panDirection.direction = '';
            self.panDirection.leftorright = '';
        },
        playerpanright: function(){
            
            //this.$refs.player.dp.notice("playerpanright", 200);
            let self = this;
            if(self.panDirection.isPan && (self.panDirection.direction == 'panright' || self.panDirection.direction == 'panleft')){
                // eslint-disable-next-line
                //console.log("playerpanright:"+ );
            }else if(!self.panDirection.isPan && self.panDirection.direction == ''){
                self.panDirection.isPan = true;
                self.panDirection.direction = 'panright'
            }
        },
        playerpanleft: function(){
            //this.$refs.player.dp.notice(JSON.stringify(p), 200);
            let self = this;
            if(self.panDirection.isPan && (self.panDirection.direction == 'panleft' || self.panDirection.direction == 'panright')){
                // eslint-disable-next-line
               // console.log("playerpanleft:"+ JSON.stringify(p));
            }else if(!self.panDirection.isPan && self.panDirection.direction == ''){
                self.panDirection.isPan = true;
                self.panDirection.direction = 'panleft'
            }
            
        },
        plaerypanup: function(p){
            let self = this;
            if(self.panDirection.isPan && (self.panDirection.direction == 'panup' || self.panDirection.direction == 'pandown')) {
                
                if(self.panDirection.leftorright == 'r'){
                    let step = 0.009;
                    //声音
                    var newv = (self.volume + step);
                    if(newv > 1) {
                        newv = 1;
                    }
                    let p = 1000;
                    newv = Math.round(newv*p)/p;
                    // eslint-disable-next-line
                    //console.log("plaerypanup:"+ JSON.stringify(p));
                    this.$refs.player.dp.volume(newv, true, false);
                    this.$refs.player.dp.notice("声量:"+ Math.round(newv*100), 500);
                    self.volume = newv;
                }else if(self.panDirection.leftorright == 'l'){
                    let step = 0.015;
                    var brgv =  self.brightness + step;
                    if(brgv > 1){
                        brgv = 1;
                    }
                    let p = 1000;
                    brgv = Math.round(brgv*p)/p;
                    // eslint-disable-next-line
                    let brightness = cordova.plugins.brightness;
                    // // value should be float in range from 0 to 1.
                    brightness.setBrightness(brgv, null, null);
                    this.$refs.player.dp.notice("亮度:"+ Math.round(brgv*100), 500);
                    self.brightness = brgv;
                }
            }else if(!self.panDirection.isPan && self.panDirection.direction == ''){
                self.panDirection.isPan = true;
                self.panDirection.direction = 'panup';
                let xcenter =  window.innerWidth/2;
                if(p.center.x < xcenter && p.center.x >0){
                    self.panDirection.leftorright = 'l';
                }else{
                    self.panDirection.leftorright = 'r';
                }
                
            }
        },
        plaerypandown: function(p){
            let self = this;
            if(self.panDirection.isPan && (self.panDirection.direction == 'pandown' || self.panDirection.direction == 'panup')){
                 
                if(self.panDirection.leftorright == 'r'){
                    let step = 0.009;
                    //声音
                    var newv = (self.volume - step);
                    if(newv < 0) {
                        newv = 0;
                    }
                    let p = 1000;
                    newv = Math.round(newv*p)/p;
                    // eslint-disable-next-line
                    //console.log("plaerypandown:"+ newv);
                    this.$refs.player.dp.volume(newv, true, false);
                    this.$refs.player.dp.notice("声量:" + Math.round(newv*100) , 500);
                    self.volume = newv;
                }else if(self.panDirection.leftorright == 'l'){
                    let step = 0.015;
                    var brgv =  self.brightness - step;
                    if(brgv < 0){
                        brgv = 0;
                    }
                    let p = 1000;
                    brgv = Math.round(brgv*p)/p;
                    // eslint-disable-next-line
                    let brightness = cordova.plugins.brightness;
                    // // value should be float in range from 0 to 1.
                    brightness.setBrightness(brgv, null, null);
                    this.$refs.player.dp.notice("亮度:"+ Math.round(brgv*100), 500);
                    self.brightness = brgv;
                }
            }else if(!self.panDirection.isPan && self.panDirection.direction == ''){
                self.panDirection.isPan = true;
                self.panDirection.direction = 'pandown';
                let xcenter =  window.innerWidth/2;
                if(p.center.x < xcenter && p.center.x >0){
                    self.panDirection.leftorright = 'l';
                }else{
                    self.panDirection.leftorright = 'r';
                }
            }
        },
        fullscreen: function() {
            //alert(JSON.stringify(this.windowSize));
            this.ifFullScreen = true;
            this.playHeightCache = this.playHeight;
            this.playHeight = this.windowSize.x;
            window.screen.orientation.lock('landscape');
            // eslint-disable-next-line
            StatusBar.hide();
            // eslint-disable-next-line
            cordova.plugins.NkPlugin.coolMethod("setfull", 1, null);
        },
        fullscreen_cancel: function() {
            this.ifFullScreen = false;
            this.playHeight = this.playHeightCache;
            window.screen.orientation.unlock();
            // eslint-disable-next-line
            StatusBar.show();
            // eslint-disable-next-line
            cordova.plugins.NkPlugin.coolMethod("cancelfull", null, null);
        },
        nowTimeFormat: function(){
            let newDate = new Date();
            // newDate.setTime(addtime * 1000);
             return  newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate() + " " + newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();
        },
        setHistorys: function(pji){
            let self = this;
            let ji = {
                ji_name: pji.name,
                vod_id: self.ffvod.vod_id,
                vod_cid: self.ffvod.vod_cid,
                vod_name: self.ffvod.vod_name,
                vod_title: self.ffvod.vod_title,
                vod_type: self.ffvod.vod_type,
                vod_area: self.ffvod.vod_area,
                vod_pic: self.ffvod.vod_pic,
                play_time:self.nowTimeFormat()
            };
            // //写入历史记录
            let hs = window.localStorage.getItem("historys");
            let historys = [];
            if(hs != null){
                historys = JSON.parse(hs);
            }

            let pos = self.findIndex(historys,item=>item.vod_id == self.ffvod.vod_id);
            if(pos != -1){
                historys.splice(pos,1);
            }
            historys.splice(0,0,ji);
            let hisLimitLen = 20;
            if(historys.length > hisLimitLen) {
                historys.splice(hisLimitLen,historys.length - hisLimitLen);
            }
            window.localStorage.setItem("historys", JSON.stringify(historys));
                        
            //alert(JSON.stringify(historys));
        },
        testm3u8Url: function(ji,tick){
            let self = this;
            self.infos = [];
            self.infos.push(`第${tick}次,测试播放地址...`);
            request.get(ji.url, {timeout: 10000}, function(error,response){
                if(!error && response.statusCode == 200){
                     // eslint-disable-next-line
                    self.infos.push('测试成功,准备播放.');
                    self.playerjiThroughTest(ji);
                } else {
                    if(tick < 3){
                        tick++;
                        self.testm3u8Url(ji,tick);
                    }else{
                        self.infos.push(`播放地址链接异常,点击集数再次尝试...`);
                    }
                }
            });
        },
        playerji: function(ji){
            let self = this;
            // if (self.isPlayThrough) {
            //     self.$refs.player.dp.ShowMessage("稍后点击,等待播放中...");
            //     return ;
            // }
            this.$refs.player.dp.pause()
            this.showAdv = false;
            self.jiIndex = ji.index;
            let playji = {
                channelIndex: self.channelIndex,
                groupIndex: self.groupIndex,
                jiIndex:self.jiIndex,
                vod_id: self.ffvod.vod_id,
            };
            // eslint-disable-next-line
           // alert(`g: ${playji.vod_id}_${playji.gindex}_${playji.index}`);
            window.localStorage.setItem(self.ffvod.vod_id.toString(), JSON.stringify(playji));
            self.setHistorys(ji);

            self.playerjiThroughTest(ji);
        },
        playerjiThroughTest: function(ji){
            let self = this;
            
            // self.infos = [];
            //self.infos.push(`播放 ${self.ffvod.vod_name} ${ji.name}`);
            self.loadingText = `${self.ffvod.vod_name} ${ji.name} 加载中...`;
            this.$refs.player.dp.vod_name = self.ffvod.vod_name;
            this.$refs.player.dp.ji_name = ji.name;
            
            this.$refs.player.dp.pause()
            this.$refs.player.dp.ResetHls();
            this.$refs.player.dp.switchVideo({
                type: 'hls',
                url: 'https://www2.88zy.net/20190705/dy0705/狄仁杰之四大天王/index.m3u8',//ji.url,
                pic: './loading.png',
            },  {
                id: self.ffvod.vod_id,
                api: self.dm(),
                user: self.ffvod.vod_name,
                gindex: self.groupIndex,
                index: self.jiIndex,
                maximum: 100,
            });
            
        },
        backClick: function(){
            if(this.ifFullScreen){
                this.$refs.player.dp.fullScreen.cancel('web');
                this.$refs.player.dp.fullScreen.cancel('browser');
                return ;
            }
            this.$router.back();
        },
        searchClick: function(){
            //this.$refs.groupNavbar.refresh();
           
        },
        onTap: function(){
            
            if(this.ifFullScreen){
                // eslint-disable-next-line
                // console.log("onTap");
                 // eslint-disable-next-line
                cordova.plugins.NkPlugin.coolMethod("setfull", null, null);
            }
            
        },
        showDataSource: function() {
            this.dialog = true;
        },
        refreshClick: function(){
            let self = this;
            self.infos = [];
            self.getDetail(); 
            
        },
        findIndex: function(ary, fn) {
            if (ary.findIndex) {
                return ary.findIndex(fn)
            }
            /* istanbul ignore next */
            let index = -1
            /* istanbul ignore next */
            ary.some(function (item, i, ary) {
                const ret = fn.call(this, item, i, ary)
                if (ret) {
                index = i
                return ret
                }
            })
            /* istanbul ignore next */
            return index
        },
        changePage:function (current) {
            this.selectedLabel = this.tabLabels[current].label
            //console.log(current)
        },
        scroll: function (pos) {
            const x = Math.abs(pos.x)
            const tabItemWidth = this.$refs.tabNav.$el.clientWidth
            const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
            const deltaX = x / slideScrollerWidth * tabItemWidth
            this.$refs.tabNav.setSliderTransform(deltaX)
        },
        onResize: function() {
            let self = this;
            this.windowSize = { x: window.innerWidth, y: window.innerHeight }
            this.playHeight = (window.innerWidth / 16) * 9;
            //alert(this.playHeight + "==="+window.innerHeight);
            let navbarheight = 0;
            if(self.labels.length > 1){
                navbarheight = 61;
            }
            
            this.scrollHeight = window.innerHeight - 48 - navbarheight -(this.playHeight+2)-47;//window.innerHeight;//(window.innerWidth / 16) * 9;
            //alert(this.scrollHeight)
        },
        
    }
}
</script>
