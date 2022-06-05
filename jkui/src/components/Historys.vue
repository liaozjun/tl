<template>
    <v-app>
        <v-toolbar dark color="primary" fixed dense>
            <v-btn icon @click="backClick">
                <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title><span class="body-1">历史记录</span></v-toolbar-title>
            <v-spacer></v-spacer>
             
        </v-toolbar>
        <v-content style="margin-top:48px;" >
            <v-list two-line v-if="historys.length > 0">            
                <template  v-for="(r,i) in historys" >
                    <v-list-tile :key="r.vod_id+i" @click="historyClick(r)">
                        <v-list-tile-content> 
                            <v-list-tile-title >{{r.fname}} <span class="body-1 caption"> {{r.playtime}}</span> </v-list-tile-title>
                            <v-list-tile-sub-title>上次观看：{{r.name}}</v-list-tile-sub-title>
                           
                        </v-list-tile-content>                        
                    </v-list-tile>
                    <v-divider light :key="r.vod_id+i+1"></v-divider>
                </template>
            </v-list>
        </v-content>
    </v-app>
</template>
<script>
import _ from 'lodash';

export default {
    name: 'historys',
    components: { },
    data(){
        return {
            historys:[],
        };
    },
    mounted: function(){
        let self = this;
        
        let hs = window.localStorage.getItem("historys");
        // eslint-disable-next-line
       
        if(hs == null){
            self.historys = [];
        }else {
            let hsjson = JSON.parse(hs);
            let shallow = _.clone(hsjson);
            self.historys = shallow;
        }
       // window.localStorage.clear();
    },
    methods:{
        historyClick: function(h){
            this.$router.push({ path: `/nDetail/${h.vod_id}/${h.vod_cid}` });
        },
         
        backClick: function(){
            this.$router.back();
        }
    }
}
</script>

