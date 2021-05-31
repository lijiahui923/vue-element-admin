<template>
  <section id="app-main-body" class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  watch: {
    '$store.getters.sidebar': {
      immediate: true,
      handler() {
        this.getAndStoreSystemLayoutMsg()
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.getAndStoreSystemLayoutMsg()
    }, 400)
    window.addEventListener('resize', _ => {
      this.getAndStoreSystemLayoutMsg()
    })
  },
  methods: {
    getAndStoreSystemLayoutMsg() {
      setTimeout(() => {
        const mainBodyH = document.getElementById('app-main-body').clientHeight
        const mainBodyW = document.getElementById('app-main-body').clientWidth
        this.$store.commit('system/CLIENT_RESIZE', { mainBodyH, mainBodyW })
      }, 400)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #f0f2f5 ;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
