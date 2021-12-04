export default function auth ({ next, store }) {
  console.log(store.state.auth);
  if (!store.state.auth.isAuthenticated) {
    return next({
      name: 'auth'
    })
  }
  return next()
}
