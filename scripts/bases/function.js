const setClickSong = () => {
    new Audio("musics/click.mp3").play();
}

const hideLoading = () => {
    loadingElem.style.display = "none"
}

const searchInputKeypressHandler = event => {
    const moleculeTargets = []
    const propertyName = selectBoxElem.value
    if (event.currentTarget.value !== "") {
        dataBase.forEach(molecule => {
            if (molecule[propertyName].toLowerCase().indexOf(event.currentTarget.value.toLowerCase()) !== -1) {
                moleculeTargets.push(molecule)
            }
        })
        moleculeElemGenerator(moleculeTargets)
    } else {
        moleculeElemGenerator([])
    }
}

const moleculeElemGenerator = (molecules) => {
    moleculesWrapperElem.innerHTML = ""

    if (molecules.length) {
        moleculesWrapperElem.style.display = "flex"
        molecules.forEach(molecule => {
            const moleculeElem = `<div class="molecule" data-cid="${molecule.cid}" onclick="moleculeElemClickHandler(event)">
                                <h4 class="molocule__details">${molecule.translate}</h4>
                                <h4 class="molocule__details">${molecule.molecularFormula}</h4>
                            </div>`;
            moleculesWrapperElem.innerHTML += moleculeElem
        })
    } else {
        moleculesWrapperElem.style.display = "none"
    }
}

const moleculeElemClickHandler = event => {
    setClickSong()
    const moleculeId = event.currentTarget.dataset.cid
    setTimeout(() => {
        window.location.href = `pages/viewer.html?cid=${moleculeId}`;
    }, 500);
}

const showMolecule = cid => {
    const molecule = findMolecule(dataBase, cid)
    window.initRDKitModule().then(function (RDKit) {
        window.RDKit = RDKit;
        drawMolecule(molecule.smiles);
    })
        .catch(() => {
            console.error("RDKit CDN Error");
        });

    informationMoleculeElemGenerator(molecule)
    viewerMoleculeElemGenerator(cid)
}

const findMolecule = (molecules, cid) => {
    const molecule = molecules.find(mol => {
        return mol.cid === cid
    })

    return molecule
}

const drawMolecule = smiles => {
    const mol = RDKit.get_mol(smiles);
    const svg = mol.get_svg();
    louiseWrapperElem.innerHTML = svg
};

const informationMoleculeElemGenerator = molecule => {
    informationWrapperElem.innerHTML = `
                        <h1 class="information__item">${molecule.translate}</h1>
                        <h4 class="information__item">نام انگلیسی : ${molecule.name}</h4>
                        <h4 class="information__item">فرمول مولکولی : ${molecule.molecularFormula}</h4>
                        <h4 class="information__item">وزن مولکولی : <span>${molecule.molecularWeight}</span></h4>
                        <h4 class="information__item">تعداد پیوند های کووآلانسی : ${molecule.covalentUnitCount}</h4>
                        <h4 class="information__item">تعداد ایزوتوپ اتم : ${molecule.isotopeAtomCount}</h4>
                        <h4 class="information__item">چگالی : ${molecule.density}</h4>
                        <h4 class="information__item">نقطه جوش : ${molecule.boilingPoint}</h4>
                        <h4 class="information__item">نقطه ذوب : ${molecule.meltingPoint}</h4>
                        <h4 class="information__item">نام آیوپاک : <span>${molecule.iupacName}</span></h4>

    `
}

const removeClass = className => {
    [...document.getElementsByClassName(className)].forEach(item => {
        item.classList.remove(className)
    })
}

const viewerMoleculeElemGenerator = cid => {
    viewerWrapperElem.innerHTML = `<div onclick="viewerElemClickHandler(event)" style="position: relative;" class='viewer_3Dmoljs viewer viewer--active' data-cid="${cid}"
        data-style='stick:radius=0.15;sphere:scale=0.25' data-backgroundcolor="white" data-spin='axis:y;speed:1'><i class="ri-expand-diagonal-line icon viewer__icon--expand" onclick="expendViewerWindowHandler(event)"></i></div>
        <div onclick="viewerElemClickHandler(event)" style="position: relative;" class='viewer_3Dmoljs viewer' data-cid="${cid}" data-style='sphere'
        data-backgroundcolor="white" data-spin='axis:y;speed:1'><i class="ri-expand-diagonal-line icon viewer__icon--expand" onclick="expendViewerWindowHandler(event)"></i></div>
        <div onclick="viewerElemClickHandler(event)" style="position: relative;" class='viewer_3Dmoljs viewer' data-cid="${cid}" data-backgroundcolor="white"
        data-spin='axis:y;speed:1' data-surface='opacity:0.9;' data-style='stick:radius=0.15;sphere:scale=0.25'><i class="ri-expand-diagonal-line icon viewer__icon--expand" onclick="expendViewerWindowHandler(event)"></i></div><i class="ri-close-large-line icon viewer__icon--close" onclick="viewerCloseIconElemHandler(event)"></i>`
}

const viewerElemClickHandler = event => {
    setClickSong()
    removeClass("viewer--active")
    event.currentTarget.classList.add("viewer--active")
}

const expendViewerWindowHandler = event => {
    event.currentTarget.style.display = "none"
    viewerWrapperElem.classList.add("viewer__wrapper--show")
}

const viewerCloseIconElemHandler = event => {
    setClickSong()
    document.querySelector(".viewer--active").firstElementChild.style.display = "flex"
    viewerWrapperElem.classList.remove("viewer__wrapper--show")
}

const bankBaseSelectBoxChangeHandler = event => {
    bankBaseValueChecker(+event.currentTarget.value)
}

const bankBaseValueChecker = number => {
    if (number === 10) {
        bankSeasonElemGenerator(3)
    } else if (number === 11) {
        bankSeasonElemGenerator(3)
    } else if (number === 12) {
        bankSeasonElemGenerator(4)
    }
}

const bankSeasonElemGenerator = number => {
    bankSeasonSelectBoxElem.innerHTML = ""
    for (let i = 1; i <= number; i++) {
        const optionElem = document.createElement("option")
        optionElem.classList.add("bank__option")
        optionElem.setAttribute("value", i)
        optionElem.innerHTML = `فصل ${checkSeasonExam(i)}`
        bankSeasonSelectBoxElem.appendChild(optionElem)
    }
}

const bankExamSubmitClickHandler = event => {
    const baseExam = bankBaseSelectBoxElem.value
    const seasonExam = bankSeasonSelectBoxElem.value
    window.location.href = `pages/exam.html?base=${baseExam}&season=${seasonExam}`;
}

const showExam = (base, season) => {
    showInformation(base, season)
    showPdf(`Q.${base}.${season}.pdf`, pdfContainerElem)
    showChoice(answerDataBase[`A.${base}.${season}`].length)
}

const showInformation = (base, season) => {
    const newBase = checkBaseExam(base)
    const newSeason = checkSeasonExam(season)

    pointInformationWrapper.innerHTML = `<h2 class="information__title">آزمون شیمی</h2>
                        <h3 class="information__base">پایه ${newBase}</h3>
                        <h3 class="information__season">فصل ${newSeason}</h3>`
}

const checkBaseExam = base => {
    if (base === 10) {
        return "دهم"
    } else if (base === 11) {
        return "یازدهم"
    } else if (base === 12) {
        return "دوازدهم"
    }
}

const checkSeasonExam = season => {
    if (season === 1) {
        return "اول"
    } else if (season === 2) {
        return "دوم"
    } else if (season === 3) {
        return "سوم"
    } else if (season === 4) {
        return "چهارم"
    }
}

const showPdf = (url, container) => {
    const newUrl = `../exams/${url}`
    pdfjsLib.getDocument(newUrl).promise.then(pdf => {
        container.innerHTML = ""
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then(page => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                const viewport = page.getViewport({ scale: 3.5 });

                canvas.width = viewport.width;
                canvas.height = viewport.height;
                container.appendChild(canvas);

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                page.render(renderContext);
            });
        }
    });
}

const showChoice = count => {
    for (let i = 1; i <= count; i++) {
        const numberElem = `<p class="case__number">${i}</p>`
        caseNumberWrapperElem.innerHTML += numberElem
        const caseElem = `<div class="point__case" data-number="${i}">
                                        <div onclick="caseClickHandler(event)" class="case"><span>1</span></div>
                                        <div onclick="caseClickHandler(event)" class="case"><span>2</span></div>
                                        <div onclick="caseClickHandler(event)" class="case"><span>3</span></div>
                                        <div onclick="caseClickHandler(event)" class="case"><span>4</span></div>
                                    </div>`
        casePointWrapperElem.innerHTML += caseElem
    }
}

const caseClickHandler = event => {
    if (event.currentTarget.classList.contains("case--choice")) {
        event.currentTarget.classList.remove("case--choice")
    } else {
        [...event.currentTarget.parentElement.getElementsByClassName("case--choice")].forEach(item => {
            item.classList.remove("case--choice")
        })
        event.currentTarget.classList.add("case--choice")
    }
}

const caseSubmitClickHandler = event => {
    const examResult = {};

    [...casePointWrapperElem.children].forEach(elem => {
        [...elem.children].forEach(choice => {
            if (choice.classList.contains("case--choice")) {
                examResult[elem.dataset.number] = +choice.firstElementChild.innerHTML
            }
        })
    });

    checkResultOfExam(examResult, answerDataBase, urlBaseExam, urlSeasonExam)
    showPdf(`A.${urlBaseExam}.${urlSeasonExam}.pdf`, pdfContainerElem)
}

const checkResultOfExam = (result, dataBase, base, season) => {
    const answers = dataBase[`A.${base}.${season}`]

    for (let i = 1; i <= answers.length; i++) {
        if (result[i]) {
            if (result[i] === answers[i - 1]) {
                correctChoicedPointHandler(i)
            } else {
                wrongChoicedPointHandler(i, answers[i - 1])
            }
        } else {
            notChoicedPointHandler(i, answers[i - 1])
        }
    };

    [...casePointWrapperElem.children].forEach(point => {
        [...point.children].forEach(caseItem => {
            caseItem.removeAttribute("onclick")
        });
    })

    caseSubmitElem.removeEventListener("click", caseSubmitClickHandler)
    setTimeout(() => {
        caseSubmitElem.removeEventListener("click", setClickSong)
    }, 500);
}


const correctChoicedPointHandler = number => {
    [...casePointWrapperElem.children].forEach(point => {
        if (+point.dataset.number === number) {
            point.querySelector(".case--choice").classList.add("case--correct")
        }
    })
}

const wrongChoicedPointHandler = (number, correctAnswer) => {
    [...casePointWrapperElem.children].forEach(point => {
        if (+point.dataset.number === number) {
            point.querySelector(".case--choice").classList.add("case--wrong");
            [...point.children][correctAnswer - 1].classList.add("case--choice");
        }
    })
}

const notChoicedPointHandler = (number, correctAnswer) => {
    [...casePointWrapperElem.children].forEach(point => {
        if (+point.dataset.number === number) {
            [...point.children][correctAnswer - 1].classList.add("case--choice");
        }
    })
}

const changeTheme = mode => {
    document.documentElement.className = mode
    if (mode === "light") {
        changeThemeIcon("ri-moon-line")
    } else if (mode === "dark") {
        changeThemeIcon("ri-sun-line")
    }

    localStorage.setItem("theme", mode)
}

const changeThemeHandler = event => {
    if (themeMode === "light") {
        changeTheme("dark")
        themeMode = "dark"
    } else if (themeMode === "dark") {
        changeTheme("light")
        themeMode = "light"
    }
}

const changeThemeIcon = classList => {
    themeIconElem.className = `${classList} icon navbar__icon--theme`
}