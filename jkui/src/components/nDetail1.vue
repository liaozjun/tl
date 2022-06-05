<template>
    <v-app >
        <v-toolbar dark color="primary" fixed dense >
            <v-btn icon  @click="backClick">
                <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title><span >{{this.playData.name}}</span></v-toolbar-title>
            <v-spacer></v-spacer>

            <!-- <v-menu :nudge-width="100">
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
            </v-menu> -->
            <!-- <v-btn icon >
                <v-icon>refresh</v-icon>
            </v-btn> -->
        </v-toolbar>
        <v-content style="margin-top:48px;" >            
            <v-container  class="pa-0">
                <v-layout column>
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
                
            </v-container>
            <!-- <span style="word-break:break-word;">{{debugInfo}}</span> -->
            <v-container grid-list-xs fluid :style="{height:scrollHeight+'px'}" style="padding:1px;">
                <cube-scroll ref="scrollone" :options="scrollOptions">
                    <v-container grid-list-md text-xs-center class="pa-1">
                        <v-layout align-center justify-space-around row wrap >
                            <v-flex xs6 v-for="(ji,index) in PlayList" :key="index"  >
                                
                                <cube-button :outline="outline(ji)" :primary="primary(ji)" @click="playerji(ji)">{{ji.name}}</cube-button>
                                    
                            </v-flex>
                        </v-layout>
                    </v-container>
                </cube-scroll>
            </v-container>
             
        </v-content>
    </v-app>
</template>
<script>
//import nja from 'axios';
import VueDPlayer from 'vue-dplayer'
import 'vue-dplayer/dist/vue-dplayer.css'
import _ from "lodash";
var moment = require('moment');
export default {
    name:'ndetail1',
    components: {
        'd-player': VueDPlayer,
    },
    mounted:function(){        
        this.playData = this.$route.query.res;
        _.each(this.playData.playList,p=>{
            p.selected = false;
        });

        //console.log('playData',this.playData);
        // self.toast = this.$createToast({
        //     txt: '资源获取中...',
        //     mask: true,
        //     time: 0,
        // });
        this.onResize();
        var videoCurr = document.getElementsByClassName('dplayer-video-current')[0];
        videoCurr.style.display='none';
       // console.log('dplayer-video-current',videoCurr);
    },
    data: function() {
        return {
            userSelectJi: 0,
            toast:null,
            //srcName: 'src',
            windowSize:{},
            playData:{},
            playHeight: 200,
            playHeightCache:0,
            scrollHeight:200,
            ifFullScreen: false,
            debugInfo:'',
            firstPlayThrough:false,

            brightness: 0.5,
            volume:0.5,
            panDirection:{isPan:false,direction:'',leftorright:''},
            
            options: {
                video: {
                    type: 'hls',
                    url:'http://localhost:8080/',
                    //pic: './loading.png',
                },
                autoplay: false,
                theme: '#1976d2',
                screenshot: false,
                // danmaku: {
                //     id: 0,
                //     api: 'http://ywd.fun/danmaku',
                // },
                contextmenu: [{
                    text: '看看',
                    click: this._onClickKanKan
                }],
                vod_name: '',
                ji_name: '',
                onHls_Events_ERROR: this._onHls_Events_ERROR,
                onHls_Events_MANIFEST_PARSED: this._onHls_Events_MANIFEST_PARSED,
            },
            scrollOptions: {
                scrollbar: false,
                startY: 0,
                //stopPropagation:true,
                /* lock x-direction when scrolling horizontally and  vertically at the same time */
                directionLockThreshold: 0
            },
        };
    },
    computed:{
        PlayList(){
            let that = this;
            if(_.has(that.playData,'playList')){
                if(that.playData.playList.length != 0){
                    return that.playData.playList;
                }
            }
            return [];
        }
    },
    created:function(){
        let self = this;
        // eslint-disable-next-line
        let brightness = cordova.plugins.brightness;
        brightness.setKeepScreenOn(true);
        brightness.getBrightness(self.getBrgSuccess);

        
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
        //self.toast.hide();
        self.$refs.player.dp.destroy();
        next();
    },
    methods:{
        _onHls_Events_ERROR:function(event,data){
            // console.log('onHls_Events_ERROR',event,data);
           
            if('networkError' == data.type ){
                // this.debugInfo = JSON.stringify({url:data.url,details:data.details } );
                if((data.details == 'manifestParsingError' || data.details == 'manifestLoadError')
                    && data.url != undefined && data.url.indexOf('localhost') >= 0){
                    return ;
                }
                this.$refs.player.dp.ShowMessage(`网络错误`);
                this.$refs.player.dp.controller.hide();
            }
        },
        _onHls_Events_MANIFEST_PARSED:function(event,data){
            //console.log('onHls_Events_MANIFEST_PARSED',event,data);
            this.$refs.player.dp.ShowMessage(`${this.playData.name},加载中`);
        },
        _onClickKanKan: function() {
            this.$refs.player.dp.notice("冇料", 5000);
        },
        outline:function(ji){
            this.userSelectJi;
            if(ji.selected){
                return false;
            }
            return true;
        },
        primary:function(ji){
            this.userSelectJi;
            if(ji.selected){
                return true;
            }
            return false;
        },
        backClick: function(){
            if(this.ifFullScreen){
                this.$refs.player.dp.fullScreen.cancel('web');
                this.$refs.player.dp.fullScreen.cancel('browser');
                return ;
            }
            this.$router.back();
        },
        canplay: function(){
            // eslint-disable-next-line
            //console.log('canplay');
        },
        canplaythrough: function(){
            //console.log('canplaythrough');
            let self = this;            
            //this.$refs.player.dp.HideMessage();
            self.$refs.player.dp.controller.hide();
            if(!this.firstPlayThrough){
                this.firstPlayThrough = true;
                var videoCurr = document.getElementsByClassName('dplayer-video-current')[0];
                videoCurr.style.display='block';
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
        onResize: function() { 
            this.windowSize = { x: window.innerWidth, y: window.innerHeight }
            this.playHeight = (window.innerWidth / 16) * 9;
            //alert(this.playHeight + "==="+window.innerHeight);
            let navbarheight = 0;
            var loadingIcon = document.getElementsByClassName('diplayer-loading-icon')[0];
            loadingIcon.style.lineHeight= `${this.playHeight}px`;
            //console.log('onResize',loadingIcon.style);
            // if(self.labels.length > 1){
            //     navbarheight = 61;
            // }
            
            //this.scrollHeight = window.innerHeight - 48 - navbarheight -(this.playHeight+2)-47;//window.innerHeight;//(window.innerWidth / 16) * 9;
            //alert(this.scrollHeight)
            this.scrollHeight = window.innerHeight - 48 - navbarheight -(this.playHeight+2);
        },
        playerji:function(ji){
            this.$refs.player.dp.pause();            
            _.each(this.playData.playList,p=>{
                p.selected = false;
            });
            ji.selected = true;
            this.userSelectJi++;
            //console.log(ji);    dplayer-video-current        
            var videoCurr = document.getElementsByClassName('dplayer-video-current')[0];
            videoCurr.style.display='none';
            this.$refs.player.dp.switchVideo({
                type: 'hls',
                url: ji.url
            });
            this.$refs.player.dp.controller.hide();
            this.$refs.player.dp.play();
            this.setHistorys(ji);
            this.$refs.player.dp.HideMessage();
            this.$refs.player.dp.ShowMessage(`${this.playData.name}`);
        },
        setHistorys: function(pji){
            let self = this;
            let ji = {
                id:this.playData.id,
                fname:this.playData.name,
                name: pji.name,
                player: pji.player,
                url: pji.url,
                playtime:moment().format('YYYY-MM-DD HH:mm')
            };
            // //写入历史记录
            let hs = window.localStorage.getItem("historys");
            let historys = [];
            if(hs != null){
                historys = JSON.parse(hs);
            }
            let pos = _.findIndex(historys,item=>item.id == self.playData.id);
            if(pos != -1){
                historys.splice(pos,1);
            }
            historys.splice(0,0,ji);
            let hisLimitLen = 30;
            if(historys.length > hisLimitLen) {
                historys.splice(hisLimitLen,historys.length - hisLimitLen);
            }
            window.localStorage.setItem("historys", JSON.stringify(historys));
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
        playerdoubletap: function(){
            //alert('d');
            // if(this.$refs.player.dp.video.paused){
            //     this.$refs.player.dp.play();
            // }else{
            //     this.$refs.player.dp.pause();
            // }
            this.$refs.player.dp.toggle();
        },
        onTap: function(){
            
            if(this.ifFullScreen){
                // eslint-disable-next-line
                // console.log("onTap");
                 // eslint-disable-next-line
                cordova.plugins.NkPlugin.coolMethod("setfull", null, null);
            }
            
        },
        emptied: function(){
            // eslint-disable-next-line
            //console.log('emptied');
            //let self = this;
            //self.infos.push("加载中...");
            //self.$refs.player.dp.ShowMessage(this.loadingText);
        },
        ended: function(){
             return ;
            // eslint-disable-next-line
            console.log('ended');
            // let self = this;
            // let nindex = self.jiIndex + 1;
             
            // if(nindex < self.playAllLength) {

            //     let gindex = 0;
            //     let chu = Math.floor(nindex / 100);
            //     // let yu = nindex % 100;
            //     gindex = chu;
            //     self.groupIndex = gindex;
            //     self.jiIndex = nindex;
            //     let channelObj = self.ffvod.vod_url.filter(item => item.sort == self.channelIndex)[0];
                
            //     self.current = self.labels[self.groupIndex];
            //     self.playArr = channelObj.pl[self.groupIndex];
            //     self.playAllLength = channelObj.length;
            //     let ji = channelObj.pl[self.groupIndex].filter(item => item.index == self.jiIndex)[0];
            //     //if(!self.ifFullScreen){
            //         self.infos = [];
            //         //this.showAdv = true;
            //         self.infos.push(`播放 ${self.ffvod.vod_name} ${ji.name}`);
            //     //}else{
            //         self.$refs.player.dp.notice(`播放 ${self.ffvod.vod_name} ${ji.name}`,1000);
            //     //}

            //     let playji = {
            //         channelIndex: self.channelIndex,
            //         groupIndex: self.groupIndex,
            //         jiIndex:self.jiIndex,
            //         vod_id: self.ffvod.vod_id,
            //     };
            //     window.localStorage.setItem(self.ffvod.vod_id.toString(), JSON.stringify(playji));
            //     self.setHistorys(ji);
                
            //     this.$refs.player.dp.pause()
            //     this.$refs.player.dp.switchVideo({
            //         type: 'hls',
            //         url: ji.url,
            //         pic: './loading.png',
            //     }, {
            //         id: playji.vod_id,
            //         api: self.dm(),
            //         user: self.ffvod.vod_name,
            //         gindex: playji.groupIndex,
            //         index: playji.jiIndex,
            //         maximum: 100,
            //     });
            // }else{
            //     alert('已是最后一集');
            // }
        },
        error: function(){
             // eslint-disable-next-line
            //console.log('error');
            alert("加载错误...");
            this.$refs.player.dp.pause()
        },
        loadeddata: function(){
            // eslint-disable-next-line
            //console.log('loadeddata');
            //let self = this;
            // self.infos.push("加载数据中...");
        },
        loadedmetadata: function(){
            // eslint-disable-next-line
             //console.log('loadedmetadata');
             //this.$refs.player.dp.play();
        },
        loadstart: function(){
            // eslint-disable-next-line
            //console.log('loadstart');
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
            // this.$refs.player.dp.ShowMessage("等待数据中...");
        },
    }
}
</script>