// 模拟所有需要权限的页面配置权限
const asyncRoutes = [
  {
    path: '/permission',
    component: 'layout/layout',
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'permission',
      icon: 'lock'
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission'
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission'
        }
      }
    ]
  },

  {
    path: '/icon',
    component: 'layout/layout',
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '/auth',
    component: 'layout/layout',
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
  },
  {
    path: '/base-data',
    component: 'layout/layout',
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
        meta: { title: 'userManagement', permission: [{ label: '新增', value: 'add' }, { label: '编辑', value: 'update' }, { label: '删除', value: 'remove' }] }
      }
    ]
  },
  {
    path: '/example',
    component: 'layout/layout',
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'example',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'articleList', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: 'layout/layout',
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error-log',
    component: 'layout/layout',
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'errorLog', icon: 'bug' }
      }
    ]
  },
  {
    path: '/clipboard',
    component: 'layout/layout',
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'clipboardDemo', icon: 'clipboard' }
      }
    ]
  },

  {
    path: 'external-link',
    component: 'layout/layout',
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'externalLink', icon: 'link' }
      }
    ]
  }
]

module.exports = {
  asyncRoutes
}
