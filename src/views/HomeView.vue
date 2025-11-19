<template>
  <div class="text-center">
    <h1 class="bg-primary text-white p-3 m-0">{{ message }}</h1>
    <h3 class="m-4">Chcesz się uczyć czy sprawdzić swoją wiedzę poprzez odpowiadanie na fiszki?</h3>
    <div class="btn-group">
      <router-link class="btn btn-primary btn-lg" v-bind:to="{name: 'category', params: { op: 'learning'}}">Nauka</router-link>
      <router-link class="btn btn-primary btn-lg" v-bind:to="{name: 'category', params: { op: 'testing'}}">Fiszki</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "Witamy w apliakcji Historyczne Fiszki!"
    }
  }
}
</script>
