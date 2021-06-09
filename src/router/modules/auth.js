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
      meta: { title: 'roleManagement', permission: [{ label: '新增', value: 'add' }, { label: '编辑', value: 'update' }, { label: '删除', value: 'remove' }] }
    },
    {
      path: 'permission-information',
      component: () => import('@/views/authority-management/permission-information'),
      name: 'permission-information',
      meta: { title: 'permissionInformation', permission: [{ label: '新增', value: 'add' }, { label: '编辑', value: 'update' }, { label: '删除', value: 'remove' }] }
    }
  ]
}
export default authRouter
