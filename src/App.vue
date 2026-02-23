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
  <header class="flex w-full sticky top-0 z-50 bg-back-100">
    <nav class="h-10 flex items-center justify-end gap-6 md:gap-8 md:px-9 w-full py-6">
      <router-link to="/" class="nav-item">
        <span class="radio-circle"></span>
        <span class="nav-text">Home</span>
      </router-link>
      <router-link to="/work" class="nav-item">
        <span class="radio-circle"></span>
        <span class="nav-text">Work</span>
      </router-link>
      <router-link to="/about" class="nav-item">
        <span class="radio-circle"></span>
        <span class="nav-text">About</span>
      </router-link>
      <router-link to="/contact" class="nav-item">
        <span class="radio-circle"></span>
        <span class="nav-text">Contact</span>
      </router-link>
    </nav>
  </header>

  <main>
    <router-view />
  </main>
</template>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #000;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.radio-circle {
  width: 14px;
  height: 14px;
  border: 1.5px solid #000;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  transition: all 0.2s ease;
}

.radio-circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  background-color: #000;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.2s ease;
}

.nav-item.router-link-active .radio-circle::after {
  width: 7px;
  height: 7px;
  opacity: 0.8;
}

.nav-text {
  font-size: 1rem;
}


</style>