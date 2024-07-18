<template lang="pug">
.drawer
  input#my-drawer.drawer-toggle(type="checkbox")
  .drawer-content
    .fixed.z-10
      label.btn.btn-primary.btn-square.m-2.drawer-button1(for="my-drawer")
        i-ci:hamburger-md.text-3xl
    router-view
  .drawer-side
    //- .container.mx-auto
    label.drawer-overlay(for="my-drawer", aria-label="close sidebar")
    ul.menu.p-4.pt-12.w-80.min-h-full.bg-base-200.text-base-content
      .btn(
        v-for="r in router.options.routes"
        @click="router.push(r.path)"
        :class="{ 'btn-active': router.currentRoute.value.path === r.path }"
        ) {{ r.path }}

</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
const location = useRoute();
const router = useRouter();

</script>



<style lang="sass">
html, body
  scroll-behavior: smooth
  height: 100%
  display: grid
</style>

<style lang="sass">
#app
  // overflow-x: hidden
  position: relative
  width: 100%
  min-height: 100vh
</style>
