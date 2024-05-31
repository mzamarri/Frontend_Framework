export default class {
    constructor() {

    }

    setTitle(title) {
        document.title = title;
    }

    getHtml() {
        throw new Error("Abstract method!");
    }
}