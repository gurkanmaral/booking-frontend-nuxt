<script setup>
definePageMeta({
  layout: 'user',
  middleware: 'auth'
})

</script>

<template>

  <div class="w-full max-w-4xl gap-3 flex flex-col mx-auto mt-10 p-5 md:p-0">
    <h1 class="self-center text-xl font-bold">Add new Accommodation</h1>
      <CreateForm />
  </div>

</template>