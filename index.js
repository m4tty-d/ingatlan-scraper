const fs = require("fs");
const jsonExport = require("jsonexport");
const { getAllListings } = require("./utils");
require("dotenv").config();

const { URL } = process.env;

(async () => {
  const listings = await getAllListings(URL);

  jsonExport(listings, (err, csv) => {
    if (err) console.log(err);
    fs.writeFileSync("listings.csv", csv);
  });
})();
