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
  <header class="flex w-full bg-linear-to-t from-grey-200 to-grey-100 sticky top-0 z-50">
    <router-link to="/" class="flex items-center">
      <div class="flex items-center">
        <button class="bg-red-100 border-red-200 border-1 rounded-full w-3 h-3 ml-2"></button>
        <button class="bg-yellow-100 border-yellow-200 border-1 rounded-full w-3 h-3 ml-2"></button>
        <button class="bg-green-200 border-green-300 border-1 rounded-full w-3 h-3 ml-2"></button>
      </div>
    </router-link>
    <div class="h-10 flex items-center justify-end px-9 w-full">
      <router-link to="/about" class="bg-linear-to-t from-grey-300 to-grey-100 drop-shadow-sm px-4 m-4 rounded-md">About</router-link>
      <router-link to="/work" class="bg-linear-to-t from-grey-300 to-grey-100 drop-shadow-sm px-4 m-4 rounded-md">Work</router-link>
      <router-link to="/contact" class="bg-linear-to-t from-grey-300 to-grey-100 drop-shadow-sm px-4 ml-4 rounded-md">Contact</router-link>
    </div>
  </header>

  <main>
    <router-view />
  </main>
</template>

<style>

</style>