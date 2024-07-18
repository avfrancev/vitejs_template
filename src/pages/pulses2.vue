<template lang="pug">
.container.mx-auto.px-2.mt-4
  //- pre {{ pulses }}
  //- button.mr-12.btn(onclick="data_modal.showModal()") edit
  //- //- pre {{ currentPulsesId }}
  //- .join
  //-   button.btn.join-item(
  //-     v-for="d,i in pulses"
  //-     :class="[ currentPulsesId === i ? 'btn-active':'']"
  //-     @click="currentPulsesId = i") {{ i }} 
  //- dialog.modal#data_modal.px-2
  //-   .modal-box(class="h-full w-full max-w-5xl")
  //-     textarea.textarea.w-full.h-full(:value="pulses[currentPulsesId]" @input="(e) => setPulsesModel(e.target.value, currentPulsesId)")
  //- input(v-model="ss")
  PulsesViewer2
</template>

<script setup>


</script>