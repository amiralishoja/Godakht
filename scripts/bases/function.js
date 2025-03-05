const setClickSong = (element, soundSource) => {
    element.addEventListener("click", function () {
        new Audio(soundSource).play();
    });
}