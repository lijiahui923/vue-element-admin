// Just a mock data

const constantRoutes = []

const asyncRoutes = [
  {
    path: '/auth',
    component: 'Layout',
    redirect: '/auth/role-management',
    name: 'Auth',
    meta: {
      title: 'Auth',
      icon: 'peoples',
      roles: ['editor']
    },
    children: [
      {
        path: 'role-management',
        component: 'authority-management/role-management',
        name: 'ComplexTable',
        meta: { title: 'role-management', roles: ['editor'], permission: ['add', 'update'] }
      }
    ]
  }
]

module.exports = {
  constantRoutes,
  asyncRoutes
}
