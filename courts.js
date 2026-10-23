
/*
 * Representation Letter Generator
 * Five-county working court directory
 *
 * Includes Albany, Schenectady, Saratoga,
 * Rensselaer and Montgomery Counties.
 *
 * The eight courts requested for omission
 * have been excluded.
 *
 * Published locations are not necessarily
 * verified mailing addresses.
 *
 * Blank addresses require manual entry.
 * Some Village Courts may need confirmation
 * of their current operating status.
 */

const COURT_DIRECTORY = {};

const COURT_NAMES = {
  Albany: [
    "Albany City Court, Criminal Part",
    "Albany City Court, Traffic Part",
    "Albany County Court",
    "Albany County Family Court",
    "Altamont Village Court",
    "Berne Town Court",
    "Bethlehem Town Court",
    "Coeymans Town Court",
    "Cohoes City Court",
    "Colonie Town Court",
    "Colonie Village Court",
    "Green Island Town Court",
    "Green Island Village Court",
    "Guilderland Town Court",
    "Knox Town Court",
    "Menands Village Court",
    "New Scotland Town Court",
    "Ravena Village Court",
    "Rensselaerville Town Court",
    "Voorheesville Village Court",
    "Watervliet City Court",
    "Westerlo Town Court"
  ],

  Schenectady: [
    "Duanesburg Town Court",
    "Glenville Town Court",
    "Niskayuna Town Court",
    "Princetown Town Court",
    "Rotterdam Town Court",
    "Schenectady City Court, Civil & Traffic",
    "Schenectady City Court, Criminal",
    "Schenectady County Court",
    "Schenectady County Family Court",
    "Schenectady County Supreme Court",
    "Scotia Village Court"
  ],

  Saratoga: [
    "Ballston Spa Village Court",
    "Ballston Town Court",
    "Charlton Town Court",
    "Clifton Park Town Court",
    "Corinth Town Court",
    "Corinth Village Court",
    "Day Town Court",
    "Edinburg Town Court",
    "Galway Town Court",
    "Galway Village Court",
    "Greenfield Town Court",
    "Hadley Town Court",
    "Halfmoon Town Court",
    "Malta Town Court",
    "Mechanicville City Court",
    "Milton Town Court",
    "Moreau Town Court",
    "Northumberland Town Court",
    "Providence Town Court",
    "Round Lake Village Court",
    "Saratoga County Court",
    "Saratoga County Family Court",
    "Saratoga County Supreme Court",
    "Saratoga Springs City Court",
    "Saratoga Town Court",
    "Schuylerville Village Court",
    "South Glens Falls Village Court",
    "Stillwater Town Court",
    "Stillwater Village Court",
    "Victory Village Court",
    "Waterford Town Court",
    "Waterford Village Court",
    "Wilton Town Court"
  ],

  Rensselaer: [
    "Berlin Town Court",
    "Brunswick Town Court",
    "Castleton-on-Hudson Village Court",
    "East Greenbush Town Court",
    "East Nassau Village Court",
    "Grafton Town Court",
    "Hoosick Falls Village Court",
    "Hoosick Town Court",
    "Nassau Town Court",
    "Nassau Village Court",
    "North Greenbush Town Court",
    "Petersburgh Town Court",
    "Pittstown Town Court",
    "Poestenkill Town Court",
    "Rensselaer City Court",
    "Rensselaer County Court",
    "Rensselaer County Family Court",
    "Rensselaer County Supreme Court",
    "Sand Lake Town Court",
    "Schaghticoke Town Court",
    "Schaghticoke Village Court",
    "Schodack Town Court",
    "Stephentown Town Court",
    "Troy City Court",
    "Valley Falls Village Court"
  ],

  Montgomery: [
    "Ames Village Court",
    "Amsterdam City Court",
    "Amsterdam Town Court",
    "Canajoharie Town Court",
    "Canajoharie Village Court",
    "Charleston Town Court",
    "Florida Town Court",
    "Fonda Village Court",
    "Fort Johnson Village Court",
    "Fort Plain Village Court",
    "Fultonville Village Court",
    "Glen Town Court",
    "Hagaman Village Court",
    "Minden Town Court",
    "Mohawk Town Court",
    "Montgomery County Court",
    "Montgomery County Family Court",
    "Montgomery County Supreme Court",
    "Nelliston Village Court",
    "Palatine Bridge Village Court",
    "Palatine Town Court",
    "Root Town Court",
    "St. Johnsville Town Court",
    "St. Johnsville Village Court"
  ]
};

/*
 * Published court addresses.
 *
 * The first line is the street or P.O. Box.
 * The second line is city, state and ZIP.
 *
 * These addresses should be confirmed
 * before legal correspondence is mailed.
 */

const COURT_ADDRESSES = {
  Albany: {
    "Albany City Court, Criminal Part":
      "1 Morton Avenue\nAlbany, New York 12202",

    "Albany City Court, Traffic Part":
      "24 Eagle Street, Room 93\nAlbany, New York 12207",

    "Albany County Court":
      "6 Lodge Street, Room 113\nAlbany, New York 12207",

    "Albany County Family Court":
      "30 Clinton Avenue\nAlbany, New York 12207",

    "Altamont Village Court":
      "P.O. Box 643\nAltamont, New York 12009",

    "Berne Town Court":
      "P.O. Box 57\nBerne, New York 12023",

    "Bethlehem Town Court":
      "447 Delaware Avenue\nDelmar, New York 12054"
  },

  Schenectady: {
    "Duanesburg Town Court":
      "5853 Western Turnpike\nDuanesburg, New York 12056",

    "Glenville Town Court":
      "18 Glenridge Road\nGlenville, New York 12302",

    "Niskayuna Town Court":
      "One Niskayuna Circle\nNiskayuna, New York 12309",

    "Princetown Town Court":
      "165 Princetown Plaza\nPrincetown, New York 12306",

    "Rotterdam Town Court":
      "101 Princetown Road\nRotterdam, New York 12306",

    "Schenectady City Court, Civil & Traffic":
      "105 Jay Street\nSchenectady, New York 12305",

    "Schenectady City Court, Criminal":
      "531 Liberty Street\nSchenectady, New York 12305",

    "Schenectady County Court":
      "612 State Street\nSchenectady, New York 12305",

    "Schenectady County Family Court":
      "620 State Street\nSchenectady, New York 12305",

    "Schenectady County Supreme Court":
      "612 State Street\nSchenectady, New York 12305",

    "Scotia Village Court":
      "4 North Ten Broeck Street\nScotia, New York 12302"
  },

  Saratoga: {
    "Ballston Spa Village Court":
      "30 Bath Street\nBallston Spa, New York 12020-1705",

    "Ballston Town Court":
      "P.O. Box 67\nBallston Spa, New York 12020-3413",

    "Charlton Town Court":
      "758 Charlton Road\nCharlton, New York 12019-2671",

    "Saratoga County Court":
      "30 McMaster Street, Building 3\nBallston Spa, New York 12020",

    "Saratoga County Family Court":
      "35 West High Street, Room 2\nBallston Spa, New York 12020",

    "Saratoga County Supreme Court":
      "30 McMaster Street, Building 3\nBallston Spa, New York 12020",

    "Saratoga Springs City Court":
      "474 Broadway\nSaratoga Springs, New York 12866"
  },

  Rensselaer: {
    "Berlin Town Court":
      "P.O. Box 488\nBerlin, New York 12022",

    "Rensselaer City Court":
      "62 Washington Street\nRensselaer, New York 12144",

    "Rensselaer County Court":
      "80 Second Street\nTroy, New York 12180",

    "Rensselaer County Family Court":
      "1504 5th Avenue\nTroy, New York 12180",

    "Rensselaer County Supreme Court":
      "80 Second Street\nTroy, New York 12180",

    "Troy City Court":
      "51 State Street\nTroy, New York 12180"
  },

  Montgomery: {
    "Charleston Town Court":
      "480 Corbin Hill Road\nSprakers, New York 12166",

    "Montgomery County Court":
      "P.O. Box 1500\nFonda, New York 12068",

    "Montgomery County Family Court":
      "P.O. Box 1500\nFonda, New York 12068",

    "Montgomery County Supreme Court":
      "P.O. Box 1500\nFonda, New York 12068"
  }
};

/*
 * Build the directory in the format used
 * by the existing Word questionnaire.
 */

const COURT_SOURCES = {
  justice:
    "https://www.nycourts.gov/town-and-village-justice-courts",
  other:
    "https://www.nycourts.gov/court-locator"
};

for (const county of Object.keys(COURT_NAMES)) {
  const names = COURT_NAMES[county];
  const addresses = COURT_ADDRESSES[county] || {};

  COURT_DIRECTORY[county] = names.map(name => {
    const address = addresses[name] || "";

    const isJusticeCourt =
      name.includes("Town Court") ||
      name.includes("Village Court");

    const isPostalBox =
      address.startsWith("P.O. Box");

    const addressStatus = !address
      ? "needs-confirmation"
      : isPostalBox
        ? "mailing-listed"
        : "official-location-mailing-unconfirmed";

    return {
      name: name,
      address: address,
      county: county,
      addressStatus: addressStatus,
      source: isJusticeCourt
        ? COURT_SOURCES.justice
        : COURT_SOURCES.other
    };
  });
}
