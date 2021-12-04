<template>
  <div class="main-header side-header sticky sticky-pin" style="margin-bottom: -64px;">
    <div class="container-fluid">
      <div class="main-header-left">
        <a class="main-header-menu-icon" @click.prevent="toggleMenu()" href="#" id="mainSidebarToggle"><span></span></a>
      </div>
      <div class="main-header-center">
        <div class="responsive-logo">
          <a href=""><img src="" class="mobile-logo" alt="logo"></a>
          <a href=""><img src="" class="mobile-logo-dark" alt="logo"></a>
        </div>
        <div class="input-group">
          <input type="search" class="form-control" placeholder="Search for anything...">
          <button class="btn search-btn"><i class="fe fe-search"></i></button>
        </div>
      </div>
      <div class="main-header-right">
        <div class="dropdown header-search">
          <a class="nav-link icon header-search">
            <i class="fe fe-search header-icons"></i>
          </a>
          <div class="dropdown-menu">
            <div class="main-form-search p-2">
              <div class="input-group">
                <input type="search" class="form-control" placeholder="Search for anything...">
                <button class="btn search-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button>
              </div>
            </div>
          </div>
        </div>
        <button class="navbar-toggler navresponsive-toggler" type="button">
          <i class="fe fe-more-vertical header-icons navbar-toggler-icon"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Header',
  data () {
    return {
      isOpenMenu: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      isAuthenticated: state => state.auth.isAuthenticated
    })
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout'
    }),
    changeLanguage (lang) {
      this.$i18n.locale = lang
      localStorage.setItem('lang', lang)
    },
    signOut () {
      this.$swal.fire({
        text: this.$t('message.warning.signOut'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#748C41',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('buttons.yes'),
        cancelButtonText: this.$t('buttons.no')
      }).then((result) => {
        if (result.value) {
          this.logout().then(() => {
            this.$router.push('/auth')
          })
        }
      })
    },
    toggleMenu () {
      this.isOpenMenu = !this.isOpenMenu
      this.$eventBus.$emit('toggleMenu', this.isOpenMenu)
    }
  }
}
</script>
<style>

</style>
