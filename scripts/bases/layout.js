window.addEventListener("DOMContentLoaded", hideLoading)
changeTheme(themeMode)
themeIconElem.addEventListener("click", changeThemeHandler)
themeIconElem.addEventListener("click", setClickSong)
navbarBackIconElem.addEventListener("click", event => {
    setClickSong()
    setTimeout(()=> {
        window.location.href = "../index.html"
    }, 500)
})