<template>
  <div class="card-body mt-2 mb-2">
    <img src="@/assets/img/brand/logo.png" class=" d-lg-none header-brand-img text-left float-left mb-4" alt="logo">
    <div class="clearfix"></div>
    <form @submit.prevent="onSubmit()">
      <h5 class="text-left mb-2">signInAccount</h5>
      <p class="mb-4 text-muted tx-13 ml-0 text-left">signInAccountInfo</p>
      <div class="form-group text-left">
        <label for="email">email</label>
        <input id="email" v-model="loginFormData.email"  type="email" name="email" class="form-control"
               placeholder="enter Email"/>
      </div>
      <div class="form-group text-left">
        <label for="password">password</label>
        <input v-model="loginFormData.password" type="password" id="password" name="password" class="form-control"
               placeholder="enter Password"/>
      </div>
      <button class="btn ripple btn-main-primary btn-block" :disabled="disabledSubmitBtn">signIn</button>
      <small class="text-danger">{{errorMsg}}</small>
    </form>
    <div class="text-left mt-5 ml-0">
      <div class="mb-1">
        <router-link to="/auth/forgot-password">Forgot Password ?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SignIn',
  data () {
    return {
      loginFormData: {},
      disabledSubmitBtn: false,
      errorMsg: ''
    }
  },
  methods: {
    ...mapActions({
      login: 'auth/login'
    }),

    onSubmit () {
      console.log(77777);
      this.errorMsg = ''
      this.login(this.loginFormData).then(() => {
        this.$router.push('/')
      }).catch(err => {
        if (err.response.data.error === 'incorrect_credentials') {
          this.errorMsg = 'неправильный логин или пароль!'
          return false
        } else {
          this.errorMsg = 'Что то пошло не так!'
        }
      }).finally(() => {
        this.disabledSubmitBtn = false
      })
    }
  }
}
</script>
