import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'homev1',
            component: require('@/components/Homev1').default
        },
        {
            path: '/h',
            name: 'home',
            component: require('@/components/Home').default
        },
        {
            path: '/set',
            name: 'set',
            component: require('@/components/Set').default
        },
        {
            path: '/nDetail1/:content',
            name: 'nDetail1',
            component: require('@/components/nDetail1').default,
            meta:{scrollY:0}
        },
        {
            path: '/nDetail/:key/:cid',
            name: 'nDetail',
            component: require('@/components/nDetail').default,
            meta:{scrollY:0}
        },
        {
            path: '/Search',
            name: 'search',
            component: require('@/components/Search').default,
        },
        {
            path: '/SearchResult/:kw',
            name: '/searchRecord',
            component: require('@/components/SearchResult').default,
        },
        {
            path: '/Historys',
            name: 'historys',
            component: require('@/components/Historys').default,
        },
        {
            path: '/nTemplate/:menuType',
            name: 'nTemplate',
            component: require('@/components/nTemplate').default,
        },
        {
            path: '/About',
            name: 'about',
            component: require('@/components/About').default,
        }
    ]
});
