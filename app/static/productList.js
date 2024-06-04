// Description: This file contains the list of products that are available in the store. Will evetually be fetched from a database.

function createItem(name, price, image, description) {
    return {
        name: name,
        price: price,
        imageSrc: image,
        description: description
    }
}

const items = (() => {
    let tempItems = [];
    for (let i = 1; i <= 215; i++) {
        tempItems.push(createItem(`Item ${i}`, i*10, "#", `This is item ${i}`));
    }
    return tempItems;
})()


export default items;