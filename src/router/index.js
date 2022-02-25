import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Index.vue'),
    meta: {
      keepAlive: true,
      requireAuth: false
    }
  },
  {
    path: '/uploadoss',
    name: 'uploadoss',
    component: () => import('../views/uploadoss.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
	{
	  path: '/huati',
	  name: 'huati',
	  component: () => import('../views/huati.vue')
		
	},
  {
    path: '/indexdetail',
    name: 'IndexDetail',
    component: () => import('../views/IndexDetail.vue'),
    meta: {
      keepAlive: true,
      requireAuth: false
    }
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('../views/Editor.vue')
  },
  {
    path: '/indexdetailreplydetail',
    name: 'IndexDetailReplyDetail',
    component: () => import('../views/IndexDetailReplyDetail.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

//防止同路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
