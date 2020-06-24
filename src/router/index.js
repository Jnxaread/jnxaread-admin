import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import User from '../views/user/User'
import Notice from '../views/forum/Notice'
import Topic from '../views/forum/Topic'
import NewNotice from '../views/forum/NewNotice'

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
  const LOGINURL = '/login';
  let url, user;
  url = to.path;
  user = sessionStorage.getItem('user');

  if (url === LOGINURL) {
    sessionStorage.removeItem('user');
  }

  //判断是否登录
  if (!user && url !== LOGINURL) {
    next({path: LOGINURL});
  } else {
    next();
  }

});

export default router
