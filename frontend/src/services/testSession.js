const STORAGE_KEYS = {
    index: 'currentQuestionIndex',
    answerChecked: 'testAnswerChecked',
    userAnswer: 'testUserAnswer'
};

export function testSession() {

    function getInitialState() {
        return {
            currentIndex: sessionStorage.getItem(STORAGE_KEYS.index) !== null ?
                Number(sessionStorage.getItem(STORAGE_KEYS.index)) : null,

            isChecked: sessionStorage.getItem(STORAGE_KEYS.answerChecked) === 'true',

            userAnswer: sessionStorage.getItem(STORAGE_KEYS.userAnswer) || ''
        };
    }

    function saveIndex(index) {
        sessionStorage.setItem(STORAGE_KEYS.index, index);
    }

    function saveAnswer(answer) {
        sessionStorage.setItem(STORAGE_KEYS.userAnswer, answer);
    }

    function markChecked() {
        sessionStorage.setItem(STORAGE_KEYS.answerChecked, true);
    }

    function resetAnswerState() {
        sessionStorage.removeItem(STORAGE_KEYS.userAnswer);
        sessionStorage.removeItem(STORAGE_KEYS.answerChecked);
    }

    function resetSession() {
        sessionStorage.removeItem(STORAGE_KEYS.index);
        resetAnswerState();
    }

    return {
        getInitialState,
        saveIndex,
        saveAnswer,
        markChecked,
        resetAnswerState,
        resetSession
    };
}