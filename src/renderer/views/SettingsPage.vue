<template>
  <Layout @close="view.animationEnd && $router.push('/')">
    <div class="container">
      <main>
        <div class="pannel">
          <h3 class="title">自动开始</h3>
          <div class="body">启动时自动启动 Google Translate。</div>
          <vSwitch v-model="autoStart" />
        </div>
        <div class="pannel">
          <h3 class="title">定义快捷键</h3>
          <div class="body">
            <p>触手可及，使用此快捷键打开：</p>
            <InputShortcutKeys placeholder="按下按键记录快捷键" v-model="hotkey" />
          </div>
        </div>
      </main>
      <footer>
        <p class="help">{{ version }}</p>
      </footer>
    </div>
  </Layout>
</template>
<script>
import anime from 'animejs'
import AutoLaunch from 'auto-launch'
import Layout from '@/views/_Layout'
import Radio from '@/components/Radio'
import vSwitch from '@/components/Switch'
import vLink from '@/components/Link'
import InputShortcutKeys from '@/components/InputShortcutKeys'
import { WindowHelper } from '../utils'
import { SAVE_STATE } from '../store/types'
import { version } from '../../../package.json'
export default {
  name: 'settings-page',
  components: { Layout, Radio, vSwitch, vLink, InputShortcutKeys },
  data () {
    return {
      version,
      view: {
        height: 660,
        animeOptions: { duration: 150, easing: 'easeOutQuart' },
        animationEnd: false
      }
    }
  },
  computed: {
    autoStart: {
      get () { return this.$store.getters.state.isAutoStart },
      set (isAutoStart) { this.$store.commit(SAVE_STATE, { ...this.$store.getters.state, isAutoStart }) }
    },
    engine: {
      get () { return this.$store.getters.state.engine },
      set (engine) { this.$store.commit(SAVE_STATE, { ...this.$store.getters.state, engine }) }
    },
    hotkey: {
      get () { return this.$store.getters.state.hotkey },
      set (hotkey) { this.$store.commit(SAVE_STATE, { ...this.$store.getters.state, hotkey }) }
    }
  },
  watch: {
    autoStart () {
      const autoLaunch = new AutoLaunch({ name: 'Google 翻译' })
      if (this.autoStart) autoLaunch.enable()
      else autoLaunch.disable()
    }
  },
  mounted () {
    WindowHelper.setSize(window.innerWidth, this.view.height, this.view.animeOptions)
    document.querySelectorAll('.pannel').forEach(el => (el.style.transform = 'translateY(40px)'))
    anime({
      targets: '.pannel',
      delay: (el, index) => index * 50,
      translateY: 0,
      translateZ: 0,
      complete: () => (this.view.animationEnd = true)
    })
  }
}
</script>
<style lang="stylus" scoped>
.pannel
  position relative
  padding 15px 20px
  margin-bottom 20px
  border-radius 6px
  background #ededed
  box-sizing border-box
  .title
    color #333
    font-size 16px
    font-weight 500
    margin 0
    margin-bottom 10px
  .body
    color #666
    font-size 14px
    margin 0
  .switch
    position absolute
    top 10px
    right 20px
.container
  display flex
  flex-direction column
  height 100vh
  padding 20px
  box-sizing border-box
  font-size 14px
  position relative
  z-index 1
  main
    flex 1
    margin-bottom 20px
  footer
    text-align center
    p
      margin 5px 0
      &:nth-last-of-type(1)
        margin 0
  .help
    color #9ca3a9
    font-size 12px
</style>
