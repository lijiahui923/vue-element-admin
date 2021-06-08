import Layout from '@/layout'

const authRouter = {
  path: '/auth',
  component: Layout,
  redirect: '/auth/role-management',
  name: 'authority-management',
  meta: {
    title: 'authorityManagement',
    icon: 'peoples'
  },
  children: [
    {
      path: 'role-management',
      component: () => import('@/views/authority-management/role-management'),
      name: 'role-management',
      meta: { title: 'roleManagement', permission: ['add', 'update', 'remove'] }
    },
    {
      path: 'permission-information',
      component: () => import('@/views/authority-management/permission-information'),
      name: 'permission-information',
      meta: { title: 'permissionInformation', permission: ['add', 'update', 'remove'] }
    }
  ]
}
export default authRouter
