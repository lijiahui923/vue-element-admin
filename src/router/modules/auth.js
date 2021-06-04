import Layout from '@/layout'

const authRouter = {
  path: '/auth',
  component: Layout,
  redirect: '/auth/role-management',
  name: 'authority-management',
  meta: {
    title: '权限管理',
    icon: 'peoples'
  },
  children: [
    {
      path: 'role-management',
      component: () => import('@/views/authority-management/role-management'),
      name: 'ComplexTable',
      meta: { title: '角色管理', permission: ['add', 'update', 'remove'] }
    },
    {
      path: 'permission-information',
      component: () => import('@/views/authority-management/permission-information'),
      name: 'ComplexTable',
      meta: { title: '权限信息', permission: ['add', 'update', 'remove'] }
    }
  ]
}
export default authRouter
