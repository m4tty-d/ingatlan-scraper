const axios = require("axios");
const cheerio = require("cheerio");

const getCheerioInstance = async (url) => {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
    },
  });

  return cheerio.load(data);
};

const getNumberOfPages = ($) => {
  const pageNumberHolder = $(".pagination__page-number").text().trim();

  if (!pageNumberHolder) {
    return 1;
  }

  const numberOfPages = pageNumberHolder.split(" / ")[1].replace(" oldal", "");

  return numberOfPages;
};

const getListings = ($) => {
  const listings = [];

  $(".listing.js-listing").each((i, el) => {
    const $el = $(el);

    const price = $el.find(".price").text().trim();
    const squareMeter = $el.find(".price--sqm").text().trim();
    const address = $el.find(".listing__address").text().trim();
    const listingParameter = $el.find(".listing__parameter").text().trim();
    const link = "https://ingatlan.com" + $el.find("a").attr("href");

    listings.push({
      price,
      squareMeter,
      address,
      listingParameter,
      link,
    });
  });

  return listings;
};

const getAllListings = async (url) => {
  let $ = await getCheerioInstance(url);

  const numberOfPages = getNumberOfPages($);

  const listings = [];

  listings.push(...getListings($));

  for (let i = 2; i <= numberOfPages; i++) {
    $ = await getCheerioInstance(`${url}?page=${i}`);
    listings.push(...getListings($));
  }

  return listings;
};

module.exports = {
  getAllListings,
};
