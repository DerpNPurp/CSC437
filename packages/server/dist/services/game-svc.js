const games = {
    overwatch: {
        company: "Blizzard Entertainment",
        companyHref: "/companies/blizzard.html",
        genre: "Shooter",
        genreHref: "/genres/shooter.html",
        genreIcon: "icon-shooter",
        rating: "Teen",
        ratingHref: "/ratings/teen.html",
        platforms: [
            { name: "PC", href: "/platforms/pc.html", icon: "icon-pc" }
        ]
    },
    hearthstone: {
        company: "Blizzard Entertainment",
        companyHref: "/companies/blizzard.html",
        genre: "Card Game",
        genreHref: "/genres/card.html",
        genreIcon: "icon-card",
        rating: "Teen",
        ratingHref: "/ratings/teen.html",
        platforms: [
            { name: "PC", href: "/platforms/pc.html", icon: "icon-pc" },
            { name: "Mobile", href: "/platforms/mobile.html", icon: "icon-mobile" }
        ]
    }
};
function get(id) {
    return games[id];
}
export default { get };
