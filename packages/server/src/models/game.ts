export interface Platform {
  name: string;
  href: string;
  icon: string;
}

export interface Game {
  _id?: string;
  company: string;
  companyHref: string;
  genre: string;
  genreHref: string;
  genreIcon: string;
  rating: string;
  ratingHref: string;
  platforms: Array<Platform>;
}
