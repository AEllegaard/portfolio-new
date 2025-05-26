<template>
  <div>
    <h1 class="font-display mx-4 mt-30 text-5xl md:text-96 md:leading-[100px] tracking-tight">
      All my projects - <br>
      <span class="text-green-100 like-cursor">That I like</span>.
    </h1>

    <!-- Liste over projekter -->
    <div class="md:mx-8 mt-40 font-display">
      <div v-for="project in projects" :key="project.slug">
        <!-- Projekt header (Klikbar) -->
        <div 
          class="flex border-t-1 h-14 w-full cursor-pointer"
          @click="toggleProject(project.slug)"
          @mouseover="handleMouseOver(project.hover)"
          @mousemove="updatePosition"
          @mouseleave="handleMouseLeave"
        >
          <div class="container grid grid-cols-4 w-full items-center ml-4 font-display">
            <h2 class="font-display text-sm font-light md:text-2xl">{{ project.dato }}</h2>
            <h2 class="font-display text-sm md:text-2xl">{{ project.kategori }}</h2>
            <h2 class="font-display text-sm md:text-2xl">{{ project.title }}</h2>
            <img class="w-18 md:w-22 h-8 object-cover justify-self-end" :src="project.preview" alt="">
          </div>
        </div>

        <!-- Udvidet projekt info -->
        <div v-if="expandedProjectSlug === project.slug" class="border-t-1 border-green-100">
          <p class="mr-22 mt-4 ml-4 font-display text-1xl">
            {{ project.description }}
            <a class="text-green-100 underlined" target="_blank" :href="project.link">{{ project.linktext }}</a>
          </p>

          <!-- Galleri -->
          <div class="flex flex-wrap gap-4 mt-10 ml-4 mb-4">
            <template v-for="(media, index) in project.images" :key="index">
              <video 
                v-if="media.endsWith('.webm') || media.endsWith('.mp4')" 
                :src="media" 
                class="object-contain self-start w-auto h-auto max-w-60 max-h-60 video-responsive cursor-pointer" 
                autoplay 
                loop 
                muted 
                playsinline
                @click="showModal(media)"
              ></video>
              <img 
                v-else 
                :src="media" 
                class="object-contain self-start w-auto h-auto max-w-80 max-h-60 cursor-pointer" 
                alt="Project media"
                @click="showModal(media)"
              />
            </template>
          </div>
        </div>

        <!-- Hover preview -->
        <div 
          v-if="hoverImage" 
          class="hover-media min-w-60 max-h-60"
          :style="{ top: mouseY + 'px', left: mouseX + 'px' }"
        >
          <video 
            v-if="hoverImage.endsWith('.webm') || hoverImage.endsWith('.mp4')" 
            :src="hoverImage"
            autoplay 
            loop 
            muted 
            playsinline 
            class="video-responsive"
          ></video>
          <img 
            v-else 
            :src="hoverImage" 
            alt="Hover preview" 
            class="object-contain max-w-60 max-h-60" 
          />
        </div>
      </div>
    </div>

    <!-- Modal for forstørrelse -->
    <div v-if="modalMedia" style="background-color: rgba(130, 130, 130, 0.8);" class="fixed inset-0 z-50 flex justify-center items-center" @click.self="closeModal">
      <div class="max-w-[90vw] max-h-[90vh] overflow-auto">
        <video 
          v-if="modalMedia.endsWith('.webm') || modalMedia.endsWith('.mp4')" 
          :src="modalMedia" 
          class="max-w-full max-h-[90vh]" 
          autoplay 
          loop 
          muted 
          playsinline
        ></video>
        <img 
          v-else 
          :src="modalMedia" 
          alt="Full view" 
          class="max-w-full max-h-[90vh]" 
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: [],
      expandedProjectSlug: null,
      hoverImage: null,
      mouseX: 0,
      mouseY: 0,
      isTouchDevice: false,
      modalMedia: null
    };
  },
  mounted() {
    fetch('/projects.json')
      .then(response => response.json())
      .then(data => {
        this.projects = data;
      })
      .catch(error => console.error('Error fetching projects:', error));
    this.detectTouchDevice();

    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    toggleProject(slug) {
      this.expandedProjectSlug = this.expandedProjectSlug === slug ? null : slug;
    },
    showHoverImage(image) {
      this.hoverImage = image;
    },
    updatePosition(event) {
      if (!this.isTouchDevice) {
        this.mouseX = event.clientX + 1;
        this.mouseY = event.clientY + 1;
      }
    },
    hideHoverImage() {
      this.hoverImage = null;
    },
    handleMouseOver(hoverImage) {
      if (!this.isTouchDevice) {
        this.showHoverImage(hoverImage);
      }
    },
    handleMouseLeave() {
      if (!this.isTouchDevice) {
        this.hideHoverImage();
      }
    },
    detectTouchDevice() {
      this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    showModal(media) {
      this.modalMedia = media;
    },
    closeModal() {
      this.modalMedia = null;
    },
    handleKeyDown(event) {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    }
  }
};
</script>

<style scoped>
.project-details {
  padding: 10px;
  transition: all 0.3s ease-in-out;
}
.hover-media {
  position: fixed;
  width: 150px;
  height: auto;
  pointer-events: none;
  z-index: 1000;
}
.video-responsive {
  max-width: 100%;
  max-height: 200px;
  width: auto;
  height: auto;
  object-fit: contain;
}

@media (max-width: 768px) {
  .video-responsive {
    max-width: 90%;
    max-height: 200px;
  }
}

@media (hover: none) {
  .hover-image {
    display: none !important;
  }
}
</style>
