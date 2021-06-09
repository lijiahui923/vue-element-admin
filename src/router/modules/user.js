import Layout from '@/layout'

const authRouter = {
  path: '/base-data',
  component: Layout,
  redirect: '/base-data/user-management',
  name: 'base-data',
  meta: {
    title: 'base-data',
    icon: 'peoples'
  },
  children: [
    {
      path: 'user-management',
      component: () => import('@/views/base-data/user-management'),
      name: 'user-management',
      meta: { title: 'userManagement', permission: ['add', 'update', 'remove'] }
    }
  ]
}
export default authRouter
