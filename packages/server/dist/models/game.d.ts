export interface Platform {
    name: string;
    href: string;
    icon: string;
}
export interface Game {
    company: string;
    companyHref: string;
    genre: string;
    genreHref: string;
    genreIcon: string;
    rating: string;
    ratingHref: string;
    platforms: Array<Platform>;
}
