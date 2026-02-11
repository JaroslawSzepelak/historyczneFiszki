import { ref, computed } from 'vue';

const STORAGE_KEYS = {
    index: 'currentQuestionIndex',
    answerChecked: 'testAnswerChecked',
    userAnswer: 'testUserAnswer'
};

export function useTestSession() {
    // stan reaktywny inicjalizowany z sessionStorage
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

    // czy sesja testowa jest aktywna?
    const hasActiveSession = computed(() => currentIndex.value !== null);

    /* ========= zapisy ========= */

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

    return {
        // state
        currentIndex,
        isChecked,
        userAnswer,

        // computed
        hasActiveSession,

        // actions
        saveIndex,
        saveAnswer,
        markChecked,
        resetAnswerState,
        resetSession
    };
}