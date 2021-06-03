<template>
  <div>
    <VerticalLayout class="app-container">
      <template #top>
        <div class="search-container">aaaaa</div>
      </template>
      <template #buttom="{ height }">
        <g-table
          class="table-container"
          :height="height"
          :columns="columns"
          :data="rolesList"
          :columns-config="{'align': 'center'}"
        >
          <template #headerLeft>
            <g-button type="primary" unique-key="add" @click="handleAddRole">新增</g-button>
          </template>
        </g-table>
      </template>
    </VerticalLayout>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="center">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="routesData" :props="defaultProps" show-checkbox node-key="path" class="permission-tree" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <!-- <HorizontalLayout v-if="!isShow" class="app-container">
      <template #left="{ height }">
        <div :style="{ 'height': height+ 'px' }" class="left-tree">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
          />
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            :filter-node-method="filterNode"
            :style="{ 'height': height - 40 + 'px' }"
            class="menu-tree"
          />
        </div>
      </template>
      <template #rightTop>
        <el-form :model="role" label-width="80px" label-position="right" class="right-top-form">
          <el-form-item label="Name">
            <el-input v-model="role.name" placeholder="Role Name" />
          </el-form-item>
          <el-form-item label="Desc">
            <el-input
              v-model="role.description"
              :autosize="{ minRows: 2, maxRows: 4}"
              type="textarea"
              placeholder="Role Description"
            />
          </el-form-item>
        </el-form>
      </template>
      <template #rightBottom="{ height }">
        <g-table
          class="right-bottom-table"
          :height="height - 40"
          :columns="columns"
          :data="rolesList"
          :columns-config="{'align': 'center'}"
        >
          <template #headerLeft>
            按钮资源
          </template>
        </g-table>
        <div class="bottom-btn">
          <el-button type="danger">取消</el-button>
          <el-button type="primary">保存</el-button>
        </div>
      </template>
    </HorizontalLayout> -->
  </div>
</template>

<script>
/**
@description: 角色管理
@createTime:2021-05-31
@create:lijiahui
*/
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import i18n from '@/lang'
const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}
export default {
  name: 'RoleManagement',
  props: {},
  data() {
    return {
      filterText: '',
      isShow: false,
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      columns: [{
        prop: 'key',
        label: 'key'
      }, {
        prop: 'name',
        label: 'name'
      }, {
        prop: 'description',
        label: 'description'
      }, {
        type: 'operate',
        align: 'center',
        width: '300px',
        buttons: {
          update: {
            type: 'primary',
            label: '编辑',
            click: (row) => {
              this.handleEdit(row)
            }
          },
          remove: {
            type: 'danger',
            label: '删除',
            click: (row) => {
              this.handleDelete(row)
            }
          }
        }
      }]
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {},
  created() {
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      const routes = this.generateRoutes(res.data)
      this.routes = this.i18n(routes)
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    i18n(routes) {
      const app = routes.map(route => {
        route.title = i18n.t(`route.${route.title}`)
        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      console.log(this.dialogVisible)
    },
    handleEdit(row) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.key)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        await updateRole(this.role.key, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].key === this.role.key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole(this.role)
        this.role.key = data.key
        this.rolesList.push(this.role)
      }

      const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${key}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>
<style lang='scss' scoped>
.left-tree {
    background-color: #fff;
    padding: 6px;
    border-radius: 6px;
}
.menu-tree {
  padding-top: 6px;
  overflow: auto;
}
.right-top-form {
  margin-left: 10px;
  padding: 6px;
  border-radius: 6px;
  background-color: #fff;
}
.right-bottom-table {
  padding: 6px;
  margin-left: 10px;
  border-radius: 6px;
  background-color: #fff;
}
.bottom-btn {
  text-align: center;
  margin-top: 10px;
}
</style>
