<template>
    <v-app>
        <v-toolbar dark color="primary" fixed dense>
            <v-btn icon @click="backClick">
                <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title><span class="body-1">搜索结果 "{{keyword}}"</span></v-toolbar-title>
            <v-spacer></v-spacer>
             
            <v-btn icon @click="refreshClick">
                <v-icon>refresh</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content style="margin-top:48px;" >
            <v-card>
                <v-card-title class='pa-1'>
                    <v-layout align-center justify-start >
                        <v-icon class=" mr-1 pt-1" size="20" color="#1976D2">event</v-icon>
                        <span class="mr-1">·</span>
                        <span class="body-1 mr-2 ">共搜索 {{searchResults.length}} 结果</span>
                    </v-layout>
                </v-card-title>
                <v-container fluid grid-list-md  class="pt-1 ">
                    <v-layout  row wrap fill-height >
                        <v-flex xs12 v-if="!contentHidden">{{loadingText}}</v-flex>
                        
                        <v-flex xs4 v-for="(f,index) in searchResults" :key="index">
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
                </v-container>
            </v-card>
        </v-content>
    </v-app>
</template>

<script>
import axios from 'axios';
import cjs from "crypto-js";
export default {
    name: 'searchResult',
    components: {},
    data(){
        return {
            keyword: '',
            contentHidden: true,
            loadingText: '空',
            searchResults: [],
            iconSize: 18,
            iconColor: '#1976D2',
            toast: null,
            tvi: 'U2FsdGVkX1+yQEUzovQVTezQ1jiP/dEz6Kh7MeFJf3etqLyqzWawxFDYpuZD4OO0',
            vim:'@1v#ii',
            ggy:'dayude$!^',
        };
    },
    created: function(){
      
    },
    mounted: function(){
        let self = this;
        //self.getSearchResult();
        self.toast = this.$createToast({
            txt: '数据加载中...',
            mask: true,
            time: 0,
        });
    },
    computed:{
        vi: function(){
            let self = this;
            var bytes  = cjs.AES.decrypt(self.tvi, self.vim);
            return bytes.toString(cjs.enc.Utf8);
        },
    },
    beforeRouteEnter (to, from, next) {
        
        next(vm=>{
            vm.keyword = vm.$route.params.kw;
            if(from.name == 'search'){
                vm.getSearchResult();
            }
        });
    },
    beforeRouteLeave (to, from, next) {
        let self = this;
        self.toast.hide();
        
        next();
    },
    methods: {
        s: function(){
            var bytes  = cjs.AES.decrypt('U2FsdGVkX1+wufaKZZyluF4sxarVIyF0bJeyjVZTxsFIgxXipTJevzUIQLMTo9Dd',this.ggy);
            let str = bytes.toString(cjs.enc.Utf8);
           
            return str;
        },
        getSearchResult: function(){
            let self = this;
            self.searchResults = [];
            var st = 0;
            let c = window.localStorage.getItem('searchtime');
            if( c== null || c == 'undefined'){
                st = 0;
            }else{
                st = c;
            }

            self.toast.show();
            
            axios.get(self.s(),{ params: {kw:self.keyword,searchtime:parseInt(st)}})
            .then(response => {
                // eslint-disable-next-line
                // console.log(response.data);
                 window.localStorage.setItem('searchtime',response.data.st);
                if(response.data.status == 1){
                    self.searchResults = response.data.list;
                    //alert(JSON.stringify(self.searchResults));
                    self.contentHidden = true;
                }else if(response.data.status == 0){
                    self.contentHidden = false;
                    self.loadingText = response.data.info;
                }
                self.toast.hide();
            })
            .catch(err => {
                self.toast.hide();
                alert(err.message);
            });
        },
        refreshClick: function(){
            let self = this;
            self.getSearchResult();
        },
        addTimeFormat: function(addtime){
            let newDate = new Date();
             newDate.setTime(addtime * 1000);
             return  newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();
        },
        detailClick: function(f){

            this.$router.push({ path: `/nDetail/${f.vod_id}/${f.vod_cid}` });
            //alert(JSON.stringify(f));
            
        },
        backClick: function(){
            this.$router.back();
        }
    },
}
</script>

