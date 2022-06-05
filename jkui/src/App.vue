<template>
    <keep-alive include="homev1">
        <router-view></router-view>
    </keep-alive>
</template>

<script>
export default {
    name: 'App',
    components: {
        
    },
    data () {
        return {
            bottomNav: 'home',
             
        }
    },
    created: function(){
        // try {
        //     document.body.removeChild(document.getElementById('appLoading'))
        //     setTimeout(function() {
        //         document.getElementById('app').style.display = 'block';
        //     }, 500)
        // } catch (e) {
        //     alert(e);
        // }
    },
    methods:{
        
        btnNavClick: function(routeName){
            // slet self = this;
            //alert(this.$route.name + routeName);
            this.$router.push({ path: `/nTemplate/${routeName}` });
        },
        infoClick: function(){
           
        }
    }
}
</script>