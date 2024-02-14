export default defineNuxtRouteMiddleware((to, from) => {

    const token = useCookie('auth_token');

    if ((to.path === '/login' || to.path === '/register' ) && token.value) {
        return navigateTo('/');
      }
    if(to.path === '/create' && !token.value) {
        return navigateTo('/');
    }
  });