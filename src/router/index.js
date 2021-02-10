import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import User from '../views/user/User'
import Notice from '../views/forum/Notice'
import Topic from '../views/forum/Topic'
import NewNotice from '../views/forum/NewNotice'
import Category from '../views/library/Category'
import Board from '../views/forum/Board';
import Project from "@/views/project/Project";
import Fiction from "@/views/library/Fiction";

Vue.use(VueRouter);

const routes = [
    {
        path: '/login',
        component: Login
    },
    {
        path: '/',
        name: 'home',
        component: Home,
        children: [
            {
                path: '/user',
                name: 'user',
                component: User
            },
            {
                path: '/notice',
                name: 'notice',
                component: Notice
            },
            {
                path: '/topic',
                name: 'topic',
                component: Topic
            },
            {
                path: '/toSubmitNotice',
                name: 'NewNotice',
                component: NewNotice
            },
            {
                path: '/category',
                name: 'Category',
                component: Category
            },
            {
                path: '/board',
                name: 'Board',
                component: Board
            },
            {
                path: '/project',
                name: 'Project',
                component: Project
            },
            {
                path: '/fiction',
                name: 'Fiction',
                component: Fiction
            },
        ]
    },
];

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
});

//全局守卫路由
router.beforeEach((to, from, next) => {
    const LOGIN_URL = '/login';
    let url, user;
    url = to.path;
    user = sessionStorage.getItem('user');

    if (url === LOGIN_URL) {
        sessionStorage.removeItem('user');
    }

    //判断是否登录
    if (!user && url !== LOGIN_URL) {
        next({path: LOGIN_URL});
    } else {
        next();
    }

});

export default router
