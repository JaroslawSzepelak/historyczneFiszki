<template>
    <div class="bg-danger text-center text-white p-3 mb-4">
        <h3>Podany adres URL nie wskazuje na żadną stronę</h3>
    </div>
    <div class="d-flex justify-content-center gap-3 p-3">
          <button class="btn btn-secondary" v-on:click="$router.back()">Wstecz</button>
          <button class="btn btn-primary" v-on:click="$router.push('/')">Powrót do strony głównej</button>
        </div>
</template>