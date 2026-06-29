<script setup>
import { createRouter, createWebHashHistory } from 'vue-router'
import { onMounted, onUnmounted } from 'vue';

import homeview from './components/homeview.vue'
import aboutview from './components/aboutview.vue'
import workview from './components/workview.vue'
import contactview from './components/contactview.vue'

const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

const moveCursor = (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
};

onMounted(() => {
  document.addEventListener('mousemove', moveCursor);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', moveCursor);
  document.body.removeChild(cursor);
});
</script>

<template>
  <header class="flex w-full sticky top-0 z-50">
    <router-link to="/" class="flex items-center">
 
    </router-link>
    <div class="h-10 flex items-center justify-end md:px-9 w-full">
      <router-link to="/" class="md:text-2xl px-4 m-2 md:m-4">Home</router-link>
      <router-link to="/about" class="md:text-2xl px-4 m-2 md:m-4">About</router-link>
      <router-link to="/work" class="md:text-2xl  px-4 m-2 md:m-4 ">Work</router-link>
      <router-link to="/contact" class="md:text-2xl px-4 ml-2 md:ml-5 md:ml-4 ">Contact</router-link>
    </div>
  </header>

  <main>
    <router-view />
  </main>
</template>

<style>

</style>