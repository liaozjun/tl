<template>
    <v-app>
        <v-toolbar dark color="primary" fixed dense>
            <v-btn icon @click="backClick">
                <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title><span class="body-1">搜索</span></v-toolbar-title>
        
        </v-toolbar>
        <v-content style="margin-top:48px;" >
            <v-container>
                <v-layout align-center justify-center row wrap fill-height>
                    <v-flex  xs12 >
                        <v-form @submit.prevent="searchClick">
                            <v-text-field v-model="keyword" solo prepend-inner-icon="search" clearable  label="关键字"  ></v-text-field>
                        </v-form>
                    </v-flex>
                    
                    <v-flex xs12  >
                        <v-card
                            class="mx-auto" max-width="400" >
                            <v-card-title>
                                 
                                <v-icon left class="mr-1">history</v-icon>
                                <span class="body-1">搜索历史</span>
                            </v-card-title>

                            <v-item-group>
                                <v-item v-for="(kw,index) in keywords" :key="index">
                                    <v-chip depressed  small @click="chipClick(kw)">{{kw}}</v-chip>
                                </v-item>
                                 
                            </v-item-group>

                            
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>

export default {
    name: 'search',
    components: {},
    data(){
        return {
            keywords: [],
            keyword: '',
            localStorageStr: 'SearchKeywords'
        };
    },
    mounted: function(){
        let self = this;
        let kwsStr = window.localStorage.getItem(self.localStorageStr);
        if(kwsStr != null){
            self.keywords = JSON.parse(kwsStr);
        }
    },
    methods:{
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
        chipClick: function(kw){
            let self = this;
            self.keyword = kw;
            self.searchClick();
        },
        searchClick: function(){
            let self = this;
            //alert(self.keyword.length);
            if(self.keyword.length != 0){

                let pos = self.findIndex(self.keywords,item => item == self.keyword);
                if(pos != -1){
                    self.keywords.splice(pos,1);
                }
                self.keywords.splice(0,0,self.keyword);
                window.localStorage.setItem(self.localStorageStr, JSON.stringify(self.keywords));
                let limitLen = 30;
                if(self.keywords.length > limitLen) {
                    self.keywords.splice(limitLen,self.keywords.length - limitLen);
                }

                self.$router.push({path: `/SearchResult/${self.keyword}`});
            }
        },
        backClick: function(){
            this.$router.back();
        }
    }
}
</script>

