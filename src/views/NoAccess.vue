<template>
    <div class="bg-danger text-center text-white p-3 mb-4">
        <h3>Strona pod podanym adresem URL jest obecnie zablokowana. Upewnij się, że masz do niej dostęp</h3>
    </div>
    <div class="d-flex justify-content-center gap-3 p-3">
          <button class="btn btn-secondary" v-on:click="$router.back()">Wstecz</button>
          <button class="btn btn-primary" v-on:click="$router.push('/')">Powrót do strony głównej</button>
        </div>
</template>