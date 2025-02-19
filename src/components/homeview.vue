<script setup>
const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="flex flex-col justify-end content-end h-screen -mt-13 mx-4">
    <h1 class="md:display-none font-display text-7xl md:text-9xl name-cursor">Anna Ellegaard</h1>
    <p class="font-display text-5xl md:text-96 md:leading-[100px] tracking-tighter">
      A designer based in <span class="text-green-100 land-cursor">Denmark</span> <br class=" desktop-break hidden md:inline">
      with strong interests within <span class="text-green-100 visual-cursor">visual <br class="desktop-break hidden md:inline">identity</span>, <span class="text-green-100 experience-cursor">experience</span>- and <span class="text-green-100 digital-cursor">digital design</span>.
    </p>
  </div>
</template>

<style>
@media (max-width: 767px) {
  .desktop-break {
    display: none !important;
  }
}
</style>