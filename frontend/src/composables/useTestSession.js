import { ref, computed, watch } from 'vue';

const STORAGE_KEYS = {
    index: 'currentQuestionIndex',
    answerChecked: 'testAnswerChecked',
    userAnswer: 'testUserAnswer'
};

export function useTestSession(flashcardsRef = null) {

    /* =========================
       STATE
    ========================== */

    const currentIndex = ref(
        sessionStorage.getItem(STORAGE_KEYS.index) !== null ?
        Number(sessionStorage.getItem(STORAGE_KEYS.index)) :
        null
    );

    const isChecked = ref(
        sessionStorage.getItem(STORAGE_KEYS.answerChecked) === 'true'
    );

    const userAnswer = ref(
        sessionStorage.getItem(STORAGE_KEYS.userAnswer) || ''
    );

    const hasActiveSession = computed(() => currentIndex.value !== null);

    const hasSelectedAnswer = computed(() => userAnswer.value !== '');

    /* =========================
       ACTIONS
    ========================== */

    function saveIndex(index) {
        currentIndex.value = index;
        sessionStorage.setItem(STORAGE_KEYS.index, index);
    }

    function saveAnswer(answer) {
        userAnswer.value = answer;
        sessionStorage.setItem(STORAGE_KEYS.userAnswer, answer);
    }

    function markChecked() {
        isChecked.value = true;
        sessionStorage.setItem(STORAGE_KEYS.answerChecked, true);
    }

    function resetAnswerState() {
        userAnswer.value = '';
        isChecked.value = false;
        sessionStorage.removeItem(STORAGE_KEYS.userAnswer);
        sessionStorage.removeItem(STORAGE_KEYS.answerChecked);
    }

    function resetSession() {
        currentIndex.value = null;
        resetAnswerState();
        sessionStorage.removeItem(STORAGE_KEYS.index);
    }

    /* =========================
       INTERNAL LOGIC (z watchera)
    ========================== */

    if (flashcardsRef) {

        // 1️⃣ Gdy załadują się flashcards → inicjalizuj index
        watch(flashcardsRef, (newVal) => {

            if (!newVal || !newVal.length) return;

            if (currentIndex.value === null) {
                saveIndex(0);
            }

            if (currentIndex.value >= newVal.length) {
                saveIndex(0);
            }

        }, { immediate: true });


        // 2️⃣ Gdy zmieni się pytanie → resetuj odpowiedź
        watch(currentIndex, (newVal, oldVal) => {
            if (newVal !== oldVal) {
                resetAnswerState();
            }
        });
    }

    return {
        // state
        currentIndex,
        isChecked,
        userAnswer,

        // computed
        hasActiveSession,
        hasSelectedAnswer,

        // actions
        saveIndex,
        saveAnswer,
        markChecked,
        resetAnswerState,
        resetSession
    };
}