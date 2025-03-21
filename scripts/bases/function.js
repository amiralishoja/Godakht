const setClickSong = (element, soundSource) => {
    element.addEventListener("click", function () {
        new Audio(soundSource).play();
    });
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
    const moleculeId = event.currentTarget.dataset.cid
    window.location.href = `pages/viewer.html?cid=${moleculeId}`;
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
        data-style='stick:radius=0.15;sphere:scale=0.25' data-backgroundcolor="white" data-spin='axis:y;speed:1'></div>
        <div onclick="viewerElemClickHandler(event)" style="position: relative;" class='viewer_3Dmoljs viewer' data-cid="${cid}" data-style='sphere'
        data-backgroundcolor="white" data-spin='axis:y;speed:1'></div>
        <div onclick="viewerElemClickHandler(event)" style="position: relative;" class='viewer_3Dmoljs viewer' data-cid="${cid}" data-backgroundcolor="white"
        data-spin='axis:y;speed:1' data-surface='opacity:0.9;' data-style='stick:radius=0.15;sphere:scale=0.25'></div>`
}

const viewerElemClickHandler = event => {
    removeClass("viewer--active")
    event.currentTarget.classList.add("viewer--active")
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
        optionElem.innerHTML = `فصل ${i}`        
        bankSeasonSelectBoxElem.appendChild(optionElem)
    }
}

const bankExamSubmitClickHandler = event => {
    const baseExam = bankBaseSelectBoxElem.value
    const seasonExam = bankSeasonSelectBoxElem.value
    window.location.href = `pages/exam.html?base=${baseExam}&season=${seasonExam}`;
}