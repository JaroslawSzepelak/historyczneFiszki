<template>
  <div class="home-view">
    <section class="hero container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">
          <div class="hero-card text-center p-4 p-md-5">
            <span class="badge text-bg-light mb-3 px-3 py-2">Nowoczesna nauka historii</span>
            <h1 class="display-5 fw-bold mb-3">{{ message }}</h1>
            <p class="lead text-secondary mb-4">
              Ucz się historii etapami, rozwiązuj testy i utrwalaj wiedzę dzięki interaktywnym fiszkom.
              Wybierz obszar oraz epokę i zacznij sesję dopasowaną do Ciebie.
            </p>
            <div class="d-flex flex-column flex-md-row justify-content-center gap-3">
              <router-link class="btn btn-primary btn-lg cta-btn px-4" v-bind:to="{name: 'category', params: { op: 'learning'}}">
                Rozpocznij naukę
              </router-link>
              <router-link class="btn btn-outline-primary btn-lg cta-btn px-4" v-bind:to="{name: 'category', params: { op: 'flashcards'}}">
                Przejdź do fiszek
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container pb-5">
      <div class="row g-4 justify-content-center">
        <div class="col-12 col-md-6 col-xl-4" v-for="feature in features" :key="feature.title">
          <article class="feature-card h-100 p-4">
            <h3 class="h5 fw-bold mb-2">{{ feature.title }}</h3>
            <p class="text-muted mb-0">{{ feature.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="container pb-5">
      <div class="quick-info p-4 p-md-5">
        <div class="row align-items-center g-4">
          <div class="col-12 col-lg-8">
            <h2 class="h3 fw-bold mb-2">Dlaczego to działa?</h2>
            <p class="text-muted mb-0">
              Regularna praktyka z krótkimi seriami pytań zwiększa skuteczność zapamiętywania.
              Aplikacja prowadzi Cię od wyboru kategorii aż po sprawdzenie wyników i kontynuację sesji.
            </p>
          </div>
          <div class="col-12 col-lg-4 text-lg-end">
            <router-link class="btn btn-success btn-lg cta-btn px-4" v-bind:to="{name: 'category', params: { op: 'learning'}}">
              Zacznij teraz
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "Witamy w aplikacji Historyczne Fiszki",
      features: [
        {
          title: "Nauka po obszarach i epokach",
          description: "Dobieraj materiał według regionu i okresu historycznego, aby szybciej opanować wybrany zakres."
        },
        {
          title: "Sesje testowe z kontynuacją",
          description: "Wracaj do rozpoczętych testów i kończ je wtedy, kiedy masz czas, bez utraty postępu."
        },
        {
          title: "Fiszki do utrwalania",
          description: "Pracuj na pytaniach i odpowiedziach w krótkich seriach, budując regularny nawyk nauki."
        }
      ]
    };
  },

  beforeRouteLeave(to) {
    if (to.name === "Flashcards") {
      return '/no-access';
    }
  }
};
</script>

<style scoped>
.home-view {
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 40%);
  min-height: calc(100vh - 160px);
}

.hero-card {
  background: #ffffff;
  border: 1px solid #e9eef5;
  border-radius: 1rem;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.feature-card {
  background: #ffffff;
  border: 1px solid #e9eef5;
  border-radius: 0.9rem;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.quick-info {
  background: #f4f8ff;
  border: 1px solid #dce8fb;
  border-radius: 1rem;
}

.cta-btn {
  min-width: 210px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .home-view {
    min-height: auto;
  }

  .cta-btn {
    width: 100%;
    min-width: 0;
  }
}
</style>
