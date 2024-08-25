import routes from "../../routes.js";


const navigateTo = url => {
    history.pushState(null, null, url);
    router();
} 

export const router = async () => {
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        }
    })

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch)

    if (!match) {
        match = {
            route: routes[0],
            isMatch: true
        }
         
    }

    const view = new match.route.view();

    const app = document.getElementById("app");
    const html = await view.getHtml();
    await view.render(app, html);
    view.setEventListeners();
}

export default navigateTo;