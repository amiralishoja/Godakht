searchInputElem.addEventListener("keyup", searchInputKeypressHandler)
bankBaseValueChecker(10)
bankBaseSelectBoxElem.addEventListener("change", bankBaseSelectBoxChangeHandler)
bankExamSubmitElem.addEventListener("click", () => {
    setClickSong()
    setTimeout(() => {
        bankExamSubmitClickHandler()
    }, 500);
})
selectBoxElem.addEventListener("click", setClickSong)
bankBaseSelectBoxElem.addEventListener("click", setClickSong)
bankSeasonSelectBoxElem.addEventListener("click", setClickSong)