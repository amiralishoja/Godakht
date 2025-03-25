window.addEventListener("DOMContentLoaded", hideLoading)
navbarBackIconElem.addEventListener("click", event => {
    window.location.href = "../index.html"
})
changeTheme(themeMode)
themeIconElem.addEventListener("click", changeThemeHandler)