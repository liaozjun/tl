<template>
    <v-app>
        <v-toolbar dark color="primary" fixed dense  >
            <template v-slot:extension>
                
            </template>
            <v-btn icon @click="backClick">
                <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title><span class="body-1"> </span></v-toolbar-title>
            <v-spacer></v-spacer>
             
            <v-btn icon>
                <v-icon>refresh</v-icon>
            </v-btn>
        </v-toolbar>
        
        <v-content style="margin-top:48px;" >
            <cube-scroll-nav-bar :current="current" :labels="labels" :txts="txts" @change="changeHandler" />
            <v-card>
                <v-container fluid grid-list-xs  class="pt-0 pl-1 pr-1" :style="{height:scrollHeight + 'px'}" >
                    <cube-scroll ref="scrollTemplate" :data="list" :options="scrollOptions" @pulling-up="pupevent"   >
                        <v-layout  row wrap fill-height >
                            <v-flex xs4 v-for="f in list" :key="f.vod_id">
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
                        
                    </cube-scroll>
                </v-container>
            </v-card>
            
        </v-content>
         
    </v-app>
</template>
<script>
import naj from 'axios';
import cjs from "crypto-js";
export default {
    name: 'nTemplate',
    components:{},
    data(){
        return {
            page:1,
            list: [],
            current: 0,
            labels: [ 0, 7, 14,15,11,17, 13,16],
            txts: ["全部","喜剧片", "科幻片", "恐怖片","动作片" , "战争片", "爱情片", "剧情片"],
            movies: [],
            
            pageSize: 30,
            scrollOptions: {
                scrollbar: true,
                startY: 0,
                //stopPropagation:true,
                /* lock x-direction when scrolling horizontally and  vertically at the same time */
                directionLockThreshold: 0,
                 
                pullUpLoad: {
                    threshold: -30,
                },
            },
            scrollHeight:200,
            curTypeUrl:'',
            menuTypes: [
                {
                    labels: [ 0, 7, 14,15,11,17, 13,16],
                    txts: ["全部","喜剧片", "科幻片", "恐怖片","动作片" , "战争片", "爱情片", "剧情片"],
                    fattem: 'U2FsdGVkX19tuh5AoOID8hZIk7yBgT4+2zGWIGBvs4Yyc1LyJLZr9KUllUJldEfm',
                },
                {
                    labels: [ 0, 3,24],
                    txts: ["全部","动漫","剧场版"],
                    fattem: 'U2FsdGVkX19rZK70NNg5VJoOKGYxU39BnCdgkS9hJxkn2hDBZGA3xVzXk164OZU1',
                },
                {
                    labels: [ 0, 18,19,22,9,20,21,23,10,],
                    txts: ["全部","国产剧","港剧","日剧","美剧","韩剧","台剧","泰剧","海外剧"],
                    fattem: 'U2FsdGVkX19gHXQhqUc6AV7s63u4hlyN7otUlG7/I0vf55L03Qg/gz9Au8ARhm38',
                },
            ],
            toast: null,
            lb: 'U2FsdGVkX1/OHMQCwZm/DD0iZx5t1hRahtXe3qXed7P2Cl5GSb9adMPs1uaUcFhd',
            llb:'@1v#ii',
        };
    },
    created: function(){
        
    },
    computed: {
        vi: function(){
            let self = this;
            var bytes  = cjs.AES.decrypt(self.lb, self.llb);
            return bytes.toString(cjs.enc.Utf8);
        },
    },
    mounted: function() {
        let self = this;
        self.toast = this.$createToast({
            time: 0,
            mask: true,
            txt: `加载${self.page}页`
        });
    },
    beforeRouteEnter (to, from, next) {
        next(vm=>{
            vm.onResize();
            if(from.name == 'home'){
                vm.$refs.scrollTemplate.scrollTo(0,0,1000);
                vm.getCurMenu();
                
                vm.getData();
            }else if(from.name == 'nDetail'){
                vm.$refs.scrollTemplate.scrollTo(0,from.meta.scrollY,1000);
                vm.$refs.scrollTemplate.refresh();
            }
        });
    },
    beforeRouteLeave (to, from, next) {
        let self = this;
        
        if(to.name == 'nDetail'){
            to.meta.scrollY = this.$refs.scrollTemplate.scroll.y;
        }else {
            self.current = 0;
        }
        self.toast.hide();
        next();
    },
    methods: {
        dg: function(m,m1) {
            var bytes  = cjs.AES.decrypt(m,m1);
            return bytes.toString(cjs.enc.Utf8);
        },
        getCurMenu: function(){
            let self = this;
            
            self.page = 1;
            self.list = [];
            self.current = 0;

            let ms = self.menuTypes;
            let mt = self.$route.params.menuType;
           // let m1 = ')(*126*-';
            if(mt == '电影'){
                self.labels = ms[0].labels;
                self.txts = ms[0].txts;
                self.curTypeUrl = "http://192.168.0.108:8099/tp5/public/gf";//self.dg(ms[0].fattem,m1);
            }else if(mt == '动漫'){
                self.labels = ms[1].labels;
                self.txts = ms[1].txts;
                self.curTypeUrl = "http://192.168.0.108:8099/tp5/public/ga";//self.dg(ms[1].fattem,m1);
            }else if(mt == '电视剧'){
                self.labels = ms[2].labels;
                self.txts = ms[2].txts;
                self.curTypeUrl = "http://192.168.0.108:8099/tp5/public/gt";//self.dg(ms[2].fattem,m1);
            }
        },
        getData: function(ch) {
            let self = this;
            self.toast = this.$createToast({
                time: 0,
                mask: true,
                txt: `加载${self.page}页`
            });
            self.toast.show()
            let pi = self.page;// - 1;
             
            naj.get(self.curTypeUrl
            , { params: {
                secType: self.current,
                pageIndex: pi ,
                pageSize: self.pageSize,
            }})
            .then(({ data }) => {
                // eslint-disable-next-line
                // console.log(data.data)
                if (data.data.data.length) {
                    self.page += 1;
                    self.list = self.list.concat(data.data.data);
                }else{
                    self.$refs.scrollTemplate.forceUpdate();
                }
                if(ch === true){
                    self.$refs.scrollTemplate.scrollTo(0,0,1000);
                    self.$refs.scrollTemplate.refresh();
                    
                }
                self.toast.hide();
            })
            .catch(err => {
                // eslint-disable-next-line
                alert(err.message);
            });
        },
        onResize: function(){
             this.scrollHeight = window.innerHeight - 48 - 64;
        },
        backClick: function(){
            this.$router.back();
        },
        detailClick: function(f){
            this.$router.push({ path: `/nDetail/${f.vod_id}/${f.vod_cid}` });
            //alert(JSON.stringify(f));
        },
        addTimeFormat: function(addtime){
            let newDate = new Date();
             newDate.setTime(addtime * 1000);
             return  newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
        },
        changeHandler(cur) {           
            let self = this;
            if(self.current != cur){
                //self.$refs.scrollTemplate.scrollTo(0,0,1000);
                self.page = 1;
                self.list = [];
                self.current = cur;

                self.getData(true);
            }            
        },
        pupevent: function(){
           
            let self = this;
            self.getData();
           
        },
        
    }
}
</script>

<style>
.navfixed{
    position:fixed;
    z-index:10;
}
</style>
