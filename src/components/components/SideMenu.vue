<template>
  <div class="main-sidebar main-sidebar-sticky side-menu">
    <div class="sidemenu-logo">
      <router-link class="main-logo" to="/dashboard">
        <h3>Smart Sale</h3>
      </router-link>
    </div>
    <div class="main-sidebar-body">
      <ul class="nav">
        <template v-for="(nav, i) in navigation" :key="'nav-header-' + i">
          <li class="nav-header"><span class="nav-label text-capitalize">{{nav.name}}</span></li>
          <template v-for="(link, j) in  nav.links" :key="'link-' + j + i">
            <li v-if="link.subMenu && link.subMenu.length" class="nav-item" :class="{'show': link.show}" :key="'nav-item-with-sub-'+i+'-'+j">
              <a class="nav-link with-sub" href="#" @click.prevent="link.show = !link.show">
                <span class="shape1"></span><span class="shape2"></span><i :class="link.icon + ' sidemenu-icon'"></i><span class="sidemenu-label text-capitalize">{{link.name}}</span><i class="angle fe fe-chevron-right"></i>
              </a>
              <ul class="nav-sub">
                <router-link tag="li" :to="subMenuItem.path" class="nav-sub-item" v-for="(subMenuItem, g) in link.subMenu" :key="g">
                  <a href="#" class="nav-sub-link text-capitalize" >{{subMenuItem.name}}</a>
                </router-link>
              </ul>
            </li>
            <router-link tag="li" :to="link.path" v-else class="nav-item" :key="'nav-item-'+i+'-'+ j ">
              <a class="nav-link" href="#"><span class="shape1"></span><span class="shape2"></span><i :class="link.icon + ' sidemenu-icon'"></i><span class="sidemenu-label text-capitalize">{{link.name}}</span></a>
            </router-link>
          </template>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
import navigation from '../../utility/navigation'
export default {
  name: 'SideMenu',
  data () {
    return {
      navigation: navigation
    }
  },
  methods: {
  }
}
</script>
<style>

</style>
