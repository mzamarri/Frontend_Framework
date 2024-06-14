export default class {
    constructor() {

    }

    setTitle(title) {
        document.title = title;
    }

    getHtml() {
        throw new Error("Abstract method!");
    }

    render(domObj, html) {
        domObj.innerHTML = html;
    }

    setEventListeners() {
        return;
    }
}