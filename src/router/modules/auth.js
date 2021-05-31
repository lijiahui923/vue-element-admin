import Layout from '@/layout'

const authRouter = {
  path: '/auth',
  component: Layout,
  redirect: '/auth/role-management',
  name: 'Auth',
  meta: {
    title: 'Auth',
    icon: 'peoples'
  },
  children: [
    {
      path: 'role-management',
      component: () => import('@/views/authority-management/role-management'),
      name: 'ComplexTable',
      meta: { title: 'role-management', permission: ['add', 'update', 'remove'] }
    }
  ]
}
export default authRouter
