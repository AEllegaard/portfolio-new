<template>
 <div class="flex flex-col justify-end content-end h-screen -mt-13 mx-4 mb-10">
<p class="font-display text-96 leading-[100px] tracking-tight">Hire me. Or just <a href="" target="_blank" class="text-green-100 underline hi-cursor">say hi</a>. <br> 
Follow me around on <a href="https://www.instagram.com/anna.cdesign?igsh=MWFldHhvbHg2YnYxcA%3D%3D&utm_source=qr" target="_blank" class="text-green-100 underline insta-cursor">Instagram</a>, 
<a href="https://www.behance.net/annaskytte" target="_blank" class="text-green-100 underline beha-cursor">Behance</a> or 
<a href="https://www.linkedin.com/in/anna-ellegaard/" target="_blank" class="text-green-100 underline linked-cursor">LinkedIn</a>. <br>
Do you like email? 
<a href="#" class="text-green-100 underline write-cursor" @click.prevent="copyEmail">Write me one</a>. <br>
Or <span class="text-green-100 dont-cursor">don't</span>.</p>
</div>
</template>

<script>
export default {
  methods: {
    copyEmail() {
      const email = "annaeskytte@gmail.com"; // Skift til din e-mail
      navigator.clipboard.writeText(email).then(() => {
        alert("E-mail kopieret til udklipsholder! 📋");
      }).catch(err => {
        console.error("Kunne ikke kopiere e-mail: ", err);
      });
    }
  }
}
</script>