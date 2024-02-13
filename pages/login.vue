<script setup>


definePageMeta({
  layout: 'login',
  middleware: 'auth'
})

</script>

<template>
    <div>
      <LoginForm />
    </div>

</template>