<script setup>

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
</script>

<template>
  <div class="flex flex-col justify-end content-end h-screen -mt-13 mx-4">

    <H1 class="font-display text-9xl name-cursor">Anna Ellegaard</H1>
    <p class="font-display text-96 leading-[100px] tracking-tighter">A designer based in <span class="text-green-100 land-cursor">Denmark</span> <br>
      with strong interests within <span class="text-green-100 visual-cursor">visual <br>identity</span>, <span class="text-green-100 experience-cursor">experience</span>- and <span class="text-green-100 digital-cursor">digital design</span>.</p>
  </div>
</template>