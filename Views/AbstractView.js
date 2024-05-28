export default class {
    constructor() {

    }

    setTitle(title) {
        document.setTitle(title);
    }

    getHtml() {
        throw new Error("Abstract method!");
    }
}