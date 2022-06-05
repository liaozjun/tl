<template>
    <v-app>
        <v-toolbar dark color="primary" fixed dense>
            <v-btn icon @click="backClick">
                <v-icon >arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title><span class="body-1">关于</span></v-toolbar-title>
            <v-spacer></v-spacer>
             
        </v-toolbar>
        <v-content style="margin-top:48px;" >
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-icon>info_outline</v-icon>
                    </v-flex>
                    <v-flex xs12>
                        <div class="pt-2">
                            <p>本站所有資源均收集與互聯網，網友提供，轉載，並不參與資源存儲，錄製,上傳.所有資源版權歸權利人。因收錄，转载侵權，請馬上联系刪除。</p>
                            <p>本站所有资源均收集与互联网，网友提供，转载，并不参与资源存储，录制，上传.所有资源版权归权利人。因收录侵权，请马上联系删除。</p>
                            <p>2745743374#qq.com</p>
                            <p>20190822更新:<br/>
                            1.优化接口<br/>
                            2.优化播放速度<br/>
                            3.增加频度和弹幕</p>
                        </div>
                    </v-flex>
                </v-layout>
                <v-layout v-if="!showNewHref" align-center justify-center row fill-height >
                    <!-- <v-btn  :loading="loadingCheck" :disabled="loadingCheck" style="width:138px;" @click="checkVersion">
                    检查更新
                        <template v-slot:loader>
                            <span>正在检查更新...</span>
                        </template>
                    </v-btn> -->
                </v-layout>
                <v-layout v-if="showNewHref" align-center justify-center row fill-height >
                    <v-btn color="warning" :href="newHref" style="width:138px;">下载新版本 v{{version}}</v-btn>
                </v-layout>
            </v-container>
        </v-content>
        <v-footer dark color="primary" class="pa-3">
            <v-spacer></v-spacer>
            <div>久庫 beta v92</div>
        </v-footer>
    </v-app>
</template>
<script>
import ajm from "axios";
import cjs from "crypto-js";

export default {
    name: 'historys',
    components: { },
    data(){
        return {
            showNewHref: false,
            newHref: 'http://ywd.fun/jiuku.apk',
            loadingCheck: false,
            ji: 'a()1112+',
            version: "91",
        };
    },
    mounted: function(){
         
    },
    methods:{
        av: function(){
            let self = this;
            var bytes  = cjs.AES.decrypt('U2FsdGVkX19rUK8pRmFlEayKuyDFtVrr5h1q+nDZ7T0KCbqoscSEVZ1PQhUepF6+', self.ji);
            let str = bytes.toString(cjs.enc.Utf8);
            return str;
        },
        checkVersion: function(){
            let self = this;
            self.loadingCheck = true;
            
            ajm.get(self.av()).then(response =>{
                self.loadingCheck = false;
                let verObj = response.data;
                if(verObj.ver != self.version){
                    self.newHref = verObj.href;
                    self.version = verObj.ver;
                    self.showNewHref = true;

                }
            })
            .catch(err => {
                alert(err.message);
                self.loadingCheck = false;
            });
        },
        backClick: function(){
            this.$router.back();
        }
    }
}
</script>

