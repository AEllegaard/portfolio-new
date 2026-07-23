<template>
  <div class="flex flex-col min-h-screen mx-4">
    <p class="w-1/2 font-display font-light text-lg md:text-5xl  mt-30 tracking-tight">
      In need of good ideas? <br>I've got plenty! <br> <br> </p>
      <p class="w-1/2 font-display font-light text-lg md:text-3xl  mt-10 tracking-tight">
      Follow me on <br> 
      <a href="https://www.instagram.com/anna.cdesign?igsh=MWFldHhvbHg2YnYxcA%3D%3D&utm_source=qr" target="_blank" class="bg-green-100 underline decoration-2 px-1">Instagram</a>, <br>
      <a href="https://www.behance.net/annaskytte" target="_blank" class="bg-green-100 underline decoration-2 px-1">Behance</a>, <br>
      <a href="https://www.linkedin.com/in/anna-ellegaard/" target="_blank" class="bg-green-100 underline decoration-2 px-1">LinkedIn</a>. <br><br>
      Do you like email? 
      <a href="#" class="bg-green-100 underline decoration-2 px-1 write-cursor" @click.prevent="copyEmail">Write me one.</a> <br>
      Or <span class="">don't</span>.
    </p>
  </div>
</template>

<script>
export default {
  methods: {
    copyEmail() {
      const email = "annaeskytte@gmail.com"; // Skift til din e-mail
      navigator.clipboard.writeText(email).then(() => {
        alert("E-mail copied");
      }).catch(err => {
        console.error("Could not copy email: ", err);
      });
    }
  }
}
</script>