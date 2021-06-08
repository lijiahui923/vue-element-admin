<template>
  <div>
    <VerticalLayout class="app-container">
      <template #top>
        <div class="search-container">用户管理</div>
      </template>
      <template #buttom="{ height }">
        <g-table
          class="table-container"
          :height="height"
          :columns="columns"
          :data="userList"
          :columns-config="{'align': 'center', 'min-width': '200'}"
        >
          <template #headerLeft>
            <g-button type="primary" unique-key="add" @click="handleAddUser">新增</g-button>
          </template>
        </g-table>
      </template>
    </VerticalLayout>
  </div>
</template>

<script>
/**
@description:用户管理
@createTime:2021-06-04
@create:lijiahui
*/
import { getUserAll } from '@/api/user'
export default {
  name: 'UserManagement',
  components: {},
  props: {},
  data() {
    return {
      columns: [{
        prop: 'id',
        label: 'id'
      }, {
        prop: 'name',
        label: 'name'
      }, {
        prop: 'gender',
        label: 'gender'
      }, {
        prop: 'status',
        label: 'status'
      }, {
        prop: 'phone',
        label: 'phone'
      }, {
        prop: 'email',
        label: 'email'
      }, {
        prop: 'job',
        label: 'job'
      }, {
        prop: 'description',
        label: 'description'
      }, {
        prop: 'createTime',
        label: 'createTime'
      }],
      userList: []
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {
    this.getUserAllList()
  },
  methods: {
    handleAddUser() {},
    getUserAllList() {
      getUserAll().then(({ data }) => {
        this.userList = data.rows
      })
    }
  }
}
</script>
<style lang='scss' scoped></style>
