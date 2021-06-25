<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="PassWord">
      <g-pwd-input v-model.trim="user.password" clearable :show-password="showPassword">
        <span slot="suffix">
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="showPassword ? 'eye-open' : 'eye'" />
          </span>
        </span>
      </g-pwd-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          password: ''
        }
      }
    }
  },
  data() {
    return {
      showPassword: false
    }
  },
  methods: {
    showPwd() {
      this.showPassword = !this.showPassword
    },
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
