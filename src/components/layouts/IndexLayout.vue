<template>
    <div class="page">
      <SideMenu/>
      <Header/>
      <div class="jumps-prevent"></div>
      <div class="main-content side-content pt-0">
        <div class="container-fluid">
          <div class="inner-body">
            <router-view/>
          </div>
        </div>
      </div>
      <audio ref="callRingtone">
        Your browser does not support the audio element.
      </audio>
    </div>
</template>

<script>
import SideMenu from '../components/SideMenu'
import Header from '../components/Header'

export default {
  name: 'IndexLayout',
  components: {
    Header,
    SideMenu
  },
  data () {
    return {
    }
  }
}
</script>
<style>
</style>
