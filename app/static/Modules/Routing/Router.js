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

    const html = await view.getHtml();
    document.getElementById("app").innerHTML = html;
    view.setEventListeners();
}

export default navigateTo;