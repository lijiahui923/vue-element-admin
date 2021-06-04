
const Mock = require('mockjs')
// 拓展 mock js
Mock.Random.extend({
  phone: function() {
    const phonePrefixes = ['132', '135', '189'] // 自己写前缀哈
    return this.pick(phonePrefixes) + Mock.mock(/\d{8}/) // Number()
  }
})
// 生成 1 - 10 个 随机手机号码
const { phone } = Mock.mock({
  'phone': '@phone'
})
// 所有的用户
const userList = []
const count = 35

for (let i = 0; i < count; i++) {
  userList.push(Mock.mock({
    rowId: '@increment',
    id: '@first',
    name: '@cname',
    'gender|1': [0, 1],
    'status|1': [0, 1, 2],
    'phone': phone,
    email: '@email',
    job: '@ctitle()',
    description: '@csentence',
    createTime: '@datetime'
  }))
}

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // 获取所有的用户
  {
    url: '/vue-element-admin/user/all',
    type: 'get',
    response: config => {
      const { importance, type, title, currentPage = 1, pageSize = 10, sort } = config.query

      let mockList = userList.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          rows: pageList
        }
      }
    }
  }
]
