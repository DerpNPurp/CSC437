import mongoose from "mongoose";
import { connect } from "./services/mongo.ts";
import Games from "./services/game-svc.ts";

connect("blazing");

async function seed() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const existing = await Games.index();
  for (const g of existing) {
    if (g._id) await Games.remove(g._id as string);
  }

  await Games.create({
    title: "Overwatch 2",
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
  });

  await Games.create({
    title: "Hearthstone",
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
  });

  console.log("Database seeded.");
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
