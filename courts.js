
/*
 * Representation Letter Generator
 * Combined courts.js — October 2026
 *
 * Five counties, 115 court entries.
 *
 * Address codes:
 * M = Listed mailing address
 * O = Official court location; mailing unconfirmed
 * D = Directory address; mailing unconfirmed
 * C = Conflicting address; confirm before use
 * N = Address needs confirmation
 *
 * Verify addresses before mailing letters.
 */

const COURT_SOURCES = {
  official: "https://www.nycourts.gov/court-locator",
  justice: "https://www.nycourts.gov/town-and-village-justice-courts",
  Albany: "https://www.albanycountyny.gov/criminal-courts",
  Saratoga: "https://newyorktraffictickets.com/courts-listing?county=Saratoga",
  Rensselaer: "https://newyorktraffictickets.com/courts-listing?county=Rensselaer",
  Montgomery: "https://newyorktraffictickets.com/courts-listing?county=Montgomery"
};

const STATUS = {
  M: "mailing-listed",
  O: "official-location-mailing-unconfirmed",
  D: "directory-address-mailing-unconfirmed",
  C: "conflicting-address-confirm-before-use",
  N: "needs-confirmation"
};

function makeCourt(county, name, address, status, source) {
  return {
    name: name,
    address: address || "",
    county: county,
    addressStatus: STATUS[status],
    source: source || COURT_SOURCES[county]
  };
}

function buildCounty(county, entries) {
  return entries.map(entry =>
    makeCourt(
      county,
      entry[0],
      entry[1],
      entry[2],
      entry[3]
    )
  );
}

const COURT_DIRECTORY = {

  Albany: buildCounty("Albany", [
    ["Albany City Court, Criminal Part",
     "1 Morton Avenue\nAlbany, New York 12202", "O",
     COURT_SOURCES.official],

    ["Albany City Court, Traffic Part",
     "24 Eagle Street, Room 93\nAlbany, New York 12207",
     "O", COURT_SOURCES.official],

    ["Albany County Court",
     "6 Lodge Street, Room 113\nAlbany, New York 12207",
     "O", COURT_SOURCES.official],

    ["Albany County Family Court",
     "30 Clinton Avenue\nAlbany, New York 12207",
     "O", COURT_SOURCES.official],

    ["Altamont Village Court",
     "P.O. Box 643\nAltamont, New York 12009",
     "M", COURT_SOURCES.justice],

    ["Berne Town Court",
     "P.O. Box 57\nBerne, New York 12023",
     "M", COURT_SOURCES.justice],

    ["Bethlehem Town Court",
     "447 Delaware Avenue\nDelmar, New York 12054",
     "O", COURT_SOURCES.justice],

    ["Coeymans Town Court",
     "18 Russell Avenue\nRavena, New York 12143",
     "D", "https://www.coeymans.org/department/justice-court/"],

    ["Cohoes City Court",
     "97 Mohawk Street\nCohoes, New York 12047", "D"],

    ["Colonie Town Court",
     "312 Wolf Road\nLatham, New York 12110", "D"],

    ["Colonie Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Green Island Town Court",
     "69 Hudson Avenue\nGreen Island, New York 12183", "D"],

    ["Green Island Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Guilderland Town Court",
     "P.O. Box 339\nGuilderland, New York 12084", "D"],

    ["Knox Town Court",
     "P.O. Box 124\nKnox, New York 12107", "D"],

    ["Menands Village Court",
     "250 Broadway\nMenands, New York 12204", "D"],

    ["New Scotland Town Court",
     "P.O. Box 318\nClarksville, New York 12041", "D"],

    ["Ravena Village Court",
     "15 Mountain Road\nRavena, New York 12143", "D"],

    ["Rensselaerville Town Court",
     "87 Barger Road\nMedusa, New York 12120", "D"],

    ["Voorheesville Village Court",
     "P.O. Box 367\nVoorheesville, New York 12186", "D"],

    ["Watervliet City Court",
     "2 15th Street\nWatervliet, New York 12189", "D"],

    ["Westerlo Town Court",
     "671 County Route 401\nWesterlo, New York 12193", "D"]
  ]),

  Schenectady: buildCounty("Schenectady", [
    ["Duanesburg Town Court",
     "5853 Western Turnpike\nDuanesburg, New York 12056",
     "O", COURT_SOURCES.justice],

    ["Glenville Town Court",
     "18 Glenridge Road\nGlenville, New York 12302",
     "O", COURT_SOURCES.justice],

    ["Niskayuna Town Court",
     "One Niskayuna Circle\nNiskayuna, New York 12309",
     "O", COURT_SOURCES.justice],

    ["Princetown Town Court",
     "165 Princetown Plaza\nPrincetown, New York 12306",
     "O", COURT_SOURCES.justice],

    ["Rotterdam Town Court",
     "101 Princetown Road\nRotterdam, New York 12306",
     "O", COURT_SOURCES.justice],

    ["Schenectady City Court, Civil & Traffic",
     "105 Jay Street\nSchenectady, New York 12305",
     "O", COURT_SOURCES.official],

    ["Schenectady City Court, Criminal",
     "531 Liberty Street\nSchenectady, New York 12305",
     "O", COURT_SOURCES.official],

    ["Schenectady County Court",
     "612 State Street\nSchenectady, New York 12305",
     "O", COURT_SOURCES.official],

    ["Schenectady County Family Court",
     "620 State Street\nSchenectady, New York 12305",
     "O", COURT_SOURCES.official],

    ["Schenectady County Supreme Court",
     "612 State Street\nSchenectady, New York 12305",
     "O", COURT_SOURCES.official],

    ["Scotia Village Court",
     "4 North Ten Broeck Street\nScotia, New York 12302",
     "O", COURT_SOURCES.justice]
  ]),

  Saratoga: buildCounty("Saratoga", [
    ["Ballston Spa Village Court",
     "30 Bath Street\nBallston Spa, New York 12020", "D"],

    ["Ballston Town Court",
     "P.O. Box 67\nBurnt Hills, New York 12027", "D"],

    ["Charlton Town Court",
     "758 Charlton Road\nCharlton, New York 12019", "D"],

    ["Clifton Park Town Court",
     "5 Municipal Plaza\nClifton Park, New York 12065", "D"],

    ["Corinth Town Court",
     "600 Palmer Avenue\nCorinth, New York 12822", "D"],

    ["Corinth Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Day Town Court",
     "1650 North Shore Road\nHadley, New York 12835", "D"],

    ["Edinburg Town Court",
     "47 Military Road\nEdinburg, New York 12134", "D"],

    ["Galway Town Court",
     "P.O. Box 219\nGalway, New York 12074", "D"],

    ["Galway Village Court",
     "P.O. Box 219\nGalway, New York 12074", "D"],

    ["Greenfield Town Court",
     "P.O. Box 10\nGreenfield Center, New York 12833", "D"],

    ["Hadley Town Court",
     "P.O. Box 323\nHadley, New York 12835", "D"],

    ["Halfmoon Town Court",
     "1 Halfmoon Town Plaza\nHalfmoon, New York 12065", "D"],

    ["Malta Town Court",
     "2538 Route 9\nBallston Spa, New York 12020", "D"],

    ["Mechanicville City Court",
     "36 North Main Street\nMechanicville, New York 12118", "D"],

    ["Milton Town Court",
     "345 Rowland Street\nBallston Spa, New York 12020", "D"],

    ["Moreau Town Court",
     "1390 Route 9\nGansevoort, New York 12831", "D"],

    ["Northumberland Town Court",
     "P.O. Box 128\nGansevoort, New York 12831", "D"],

    ["Providence Town Court",
     "7187 Barkersville Road\nMiddle Grove, New York 12850", "D"],

    ["Round Lake Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Saratoga County Court",
     "30 McMaster Street, Building 3\nBallston Spa, New York 12020",
     "O", COURT_SOURCES.official],

    ["Saratoga County Family Court",
     "35 West High Street, Room 2\nBallston Spa, New York 12020",
     "O", COURT_SOURCES.official],

    ["Saratoga County Supreme Court",
     "30 McMaster Street, Building 3\nBallston Spa, New York 12020",
     "O", COURT_SOURCES.official],

    ["Saratoga Springs City Court",
     "474 Broadway\nSaratoga Springs, New York 12866",
     "O", COURT_SOURCES.official],

    ["Saratoga Town Court",
     "12 Spring Street\nSchuylerville, New York 12871", "D"],

    ["Schuylerville Village Court",
     "", "N", COURT_SOURCES.justice],

    ["South Glens Falls Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Stillwater Town Court",
     "P.O. Box 700\nStillwater, New York 12170", "D"],

    ["Stillwater Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Victory Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Waterford Town Court",
     "65 Broad Street\nWaterford, New York 12188", "D"],

    ["Waterford Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Wilton Town Court",
     "20 Traver Road\nGansevoort, New York 12831", "D"]
  ]),

  Rensselaer: buildCounty("Rensselaer", [
    ["Berlin Town Court",
     "P.O. Box 488\nBerlin, New York 12022", "D"],

    ["Brunswick Town Court",
     "336 Town Office Road\nTroy, New York 12180", "D"],

    ["Castleton-on-Hudson Village Court",
     "P.O. Box 126\nCastleton, New York 12033", "D"],

    ["East Greenbush Town Court",
     "225 Columbia Turnpike\nRensselaer, New York 12144", "D"],

    ["East Nassau Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Grafton Town Court",
     "P.O. Box G\nGrafton, New York 12082", "D"],

    ["Hoosick Falls Village Court",
     "P.O. Box 203\nHoosick Falls, New York 12090", "D"],

    ["Hoosick Town Court",
     "P.O. Box 17\nHoosick Falls, New York 12090", "D"],

    ["Nassau Town Court",
     "P.O. Box 587\nNassau, New York 12123", "D"],

    ["Nassau Village Court",
     "P.O. Box 452\nNassau, New York 12123", "D"],

    ["North Greenbush Town Court",
     "2 Douglas Street\nWynantskill, New York 12198", "D"],

    ["Petersburgh Town Court",
     "P.O. Box 233\nPetersburgh, New York 12138", "D"],

    ["Pittstown Town Court",
     "123 Tomhannock Road\nValley Falls, New York 12185", "D"],

    ["Poestenkill Town Court",
     "P.O. Box 164\nPoestenkill, New York 12140", "D"],

    ["Rensselaer City Court",
     "62 Washington Street\nRensselaer, New York 12144",
     "O", COURT_SOURCES.official],

    ["Rensselaer County Court",
     "80 Second Street\nTroy, New York 12180",
     "O", COURT_SOURCES.official],

    ["Rensselaer County Family Court",
     "1504 5th Avenue\nTroy, New York 12180",
     "O", COURT_SOURCES.official],

    ["Rensselaer County Supreme Court",
     "80 Second Street\nTroy, New York 12180",
     "O", COURT_SOURCES.official],

    ["Sand Lake Town Court",
     "P.O. Box 273\nSand Lake, New York 12153", "D"],

    ["Schaghticoke Town Court",
     "290 Northline Drive\nMelrose, New York 12121", "D"],

    ["Schaghticoke Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Schodack Town Court",
     "265 Schuurman Road\nCastleton, New York 12033", "D"],

    ["Stephentown Town Court",
     "P.O. Box 268\nStephentown, New York 12168", "D"],

    ["Troy City Court",
     "51 State Street\nTroy, New York 12180",
     "O", COURT_SOURCES.official],

    ["Valley Falls Village Court",
     "", "N", COURT_SOURCES.justice]
  ]),

  Montgomery: buildCounty("Montgomery", [
    ["Ames Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Amsterdam City Court",
     "1 Guy Park Avenue Extension, Room 208\nAmsterdam, New York 12010",
     "D"],

    ["Amsterdam Town Court",
     "283 Manny's Corners Road\nAmsterdam, New York 12010",
     "D"],

    ["Canajoharie Town Court",
     "12 Mitchell Street\nCanajoharie, New York 13317", "C"],

    ["Canajoharie Village Court",
     "75 Erie Boulevard\nCanajoharie, New York 13317", "D"],

    ["Charleston Town Court",
     "480 Corbin Hill Road\nSprakers, New York 12166", "D"],

    ["Florida Town Court",
     "214 Fort Hunter Road\nAmsterdam, New York 12010", "D"],

    ["Fonda Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Fort Johnson Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Fort Plain Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Fultonville Village Court",
     "P.O. Box 337\nFultonville, New York 12072", "D"],

    ["Glen Town Court",
     "7 Erie Street\nFultonville, New York 12072", "D"],

    ["Hagaman Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Minden Town Court",
     "136 State Highway 80\nFort Plain, New York 13339", "D"],

    ["Mohawk Town Court",
     "P.O. Box 415\nFonda, New York 12068", "D"],

    ["Montgomery County Court",
     "P.O. Box 1500\nFonda, New York 12068",
     "M", COURT_SOURCES.official],

    ["Montgomery County Family Court",
     "P.O. Box 1500\nFonda, New York 12068",
     "M", COURT_SOURCES.official],

    ["Montgomery County Supreme Court",
     "P.O. Box 1500\nFonda, New York 12068",
     "M", COURT_SOURCES.official],

    ["Nelliston Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Palatine Bridge Village Court",
     "", "N", COURT_SOURCES.justice],

    ["Palatine Town Court",
     "P.O. Box 40\nPalatine Bridge, New York 13428", "D"],

    ["Root Town Court",
     "1048 Carlisle Road\nSprakers, New York 12166", "D"],

    ["St. Johnsville Town Court",
     "P.O. Box 28\nSt. Johnsville, New York 13452", "D"],

    ["St. Johnsville Village Court",
     "16 Washington Street\nSt. Johnsville, New York 13452", "D"]
  ])
};
