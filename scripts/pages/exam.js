window.addEventListener("DOMContentLoaded", () => {
    showExam(urlBaseExam, urlSeasonExam)
})
caseSubmitElem.addEventListener("click", caseSubmitClickHandler)
caseSubmitElem.addEventListener("click", setClickSong)
casePointWrapperElem.addEventListener("click", event => {
    if (event.target.classList.contains("case")) {
        setClickSong()
    }
})