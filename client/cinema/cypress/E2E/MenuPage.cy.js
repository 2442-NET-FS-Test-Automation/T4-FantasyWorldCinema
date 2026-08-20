import { MenuPage } from "../Pages/MenuPage";

describe("home page gets cinemas and movies", () => {

    it('Gets the cinemas from api', () => {
        const menu = new MenuPage();
        menu.visit();
        
        menu.getCinemas().should("have.length", 4);
    });

    it('Gets the movies from api', () => {
        const menu = new MenuPage();

        menu.visit();

        menu.getMovies("The Chronicles of Narnia: The Lion, the Witch and the Wardrobe")
            .should("exist");
    });
});