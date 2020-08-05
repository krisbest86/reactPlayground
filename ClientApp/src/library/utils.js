import shortid from 'shortid';
import {
    setTimeout
} from 'timers';


export function isMobileDevice() {

    return (
        typeof window.orientation !== "undefined" ||
        navigator.userAgent.indexOf("IEMobile") !== -1
    );
}

export function isAtLeastSmallScreen() {

    return (
        window.innerWidth > 530
    );
}

export function ToggleModal(id, autofocusId) {


    addRemovePointerOff(id);


    if (autofocusId)
        document.getElementById(autofocusId).focus();

}

function addRemovePointerOff(id) {
    const className = "modal--pointerOff";
    let checkbox = document.getElementById(id);
    let element = document.getElementById(id).nextSibling;
    checkbox.checked = !checkbox.checked;


    if (!element.classList.contains(className))
        element.classList.add(className);

    setTimeout(function () {
        let element = document.getElementById(id).nextSibling;
        element.classList.remove(className);
    }, 500);
    // } else {
    //     element.classList.add(className);
    // }

}

export function returnHeightBasedOnScreen(min, max, factor) {

    const adjFactor = factor || 1;
    const proportion = 1 - (Math.abs(window.innerHeight - 900) / 900) * adjFactor;
    const value = Math.max(min, Math.min(max, proportion * max));
    return value + "em";
}

export function returnWidthBasedOnScreen(min, max, factor) {

    const adjFactor = factor || 1;
    const proportion = 1 - (Math.abs(window.innerWidth - 1800) / 1800) * adjFactor;
    const value = Math.max(min, Math.min(max, proportion * max));
    return value + "em";
}

export function createImage(imgSrc) {
    const img = new Image();
    img.src = imgSrc;
    return img;
}

export function scrollTop() {
    return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

export function scrollLeft() {
    return (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
}


export function getKeyTableTr(item) {
    return item._id || shortid.generate();
}

export function getKeyTableTd(item, column) {
    // console.log(item);
    // console.log(column);
    return getKeyTableTr(item) + (column.path || column.key || column);
}


export function getKeyFixed(htmlObject, column) {
    return htmlObject + (column.path || column.key || column);
}

export function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

export function isObjectEmpty(obj) {
    for (var key in obj) {
        if (obj[key] !== null && obj[key] !== "")
            return false;
    }
    return true;
}

export function getImages() {
    return {
        noPlayer: createImage(require("../resources/images/tshirtBlank.png")),
        defaultPlayerImg: createImage(require("../resources/images/tshirt.png")),
        xButton: createImage(require("../resources/images/xButton.jpg"))
    };
};

export function getArrayFromObject(object) {
    let array = [];


    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const element = object[key];
            element.key = key;
            element.title = key;
            // element.input = true;

            array.push(element);
        }
    }

    return array;
};

export function parseIsoDatetime(a) {
    if (!a)
        return ""
    var parts = a.match(/\d+/g);

    return parts[0] + "-" + parts[1] + "-" + parts[2] + "T" + parts[3] + ":" + parts[4]
}