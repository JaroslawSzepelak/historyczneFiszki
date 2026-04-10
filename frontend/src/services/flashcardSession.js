const STORAGE_KEYS = {
    index: 'flashcardIndex',
    answered: 'flashcardHasAnswered',
    choice: 'flashcardChoice'
};

export function flashcardSession() {
    function getInitialState() {
        return {
            currentIndex: sessionStorage.getItem(STORAGE_KEYS.index) !== null ?
                Number(sessionStorage.getItem(STORAGE_KEYS.index)) : null,
            hasAnswered: sessionStorage.getItem(STORAGE_KEYS.answered) === 'true',
            userChoice: sessionStorage.getItem(STORAGE_KEYS.choice) || null
        };
    }

    function saveIndex(index) {
        sessionStorage.setItem(STORAGE_KEYS.index, index);
    }

    function saveChoice(choice) {
        sessionStorage.setItem(STORAGE_KEYS.choice, choice);
    }

    function markAnswered() {
        sessionStorage.setItem(STORAGE_KEYS.answered, true);
    }

    function resetAnswerState() {
        sessionStorage.removeItem(STORAGE_KEYS.answered);
        sessionStorage.removeItem(STORAGE_KEYS.choice);
    }

    function resetSession() {
        sessionStorage.removeItem(STORAGE_KEYS.index);
        resetAnswerState();
    }

    return {
        getInitialState,
        saveIndex,
        saveChoice,
        markAnswered,
        resetAnswerState,
        resetSession
    };
}
