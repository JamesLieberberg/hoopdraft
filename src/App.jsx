import React, { useState, useEffect, useMemo } from "react";
import { Trophy, Flame, Check, X, ChevronRight, RotateCcw, Zap, Star, HelpCircle, Share2, Copy } from "lucide-react";

// Current NBA players with the team they FIRST PLAYED FOR (accounts for draft-night trades)
// `isInternational: true` means the answer is their country of origin (instead of US college).
//   - `country` is the primary country (where they were born OR played pre-NBA)
//   - `altCountries` is an array of also-accepted answers (handles dual citizens / players who played pro in a different country than birth)
// `tier`: "easy" = superstars/household names, "medium" = solid starters, "hard" = role players / deep cuts
const PLAYERS = [
  // 2023 draft
  { name: "Victor Wembanyama", pick: 1, team: "San Antonio Spurs", year: 2023, country: "France", isInternational: true, tier: "easy" },
  { name: "Scoot Henderson", pick: 3, team: "Portland Trail Blazers", year: 2023, college: "G League Ignite", tier: "medium" },
  { name: "Amen Thompson", pick: 4, team: "Houston Rockets", year: 2023, college: "Overtime Elite", tier: "medium" },
  { name: "Ausar Thompson", pick: 5, team: "Detroit Pistons", year: 2023, college: "Overtime Elite", tier: "medium" },
  { name: "Brandon Miller", pick: 2, team: "Charlotte Hornets", year: 2023, college: "Alabama", tier: "medium" },
  // 2022 draft
  { name: "Chet Holmgren", pick: 2, team: "Oklahoma City Thunder", year: 2022, college: "Gonzaga", tier: "easy" },
  { name: "Paolo Banchero", pick: 1, team: "Orlando Magic", year: 2022, college: "Duke", tier: "easy" },
  { name: "Jabari Smith Jr.", pick: 3, team: "Houston Rockets", year: 2022, college: "Auburn", tier: "medium" },
  { name: "Keegan Murray", pick: 4, team: "Sacramento Kings", year: 2022, college: "Iowa", tier: "medium" },
  { name: "Jaden Ivey", pick: 5, team: "Detroit Pistons", year: 2022, college: "Purdue", tier: "medium" },
  { name: "Bennedict Mathurin", pick: 6, team: "Indiana Pacers", year: 2022, college: "Arizona", tier: "medium" },
  { name: "Jalen Duren", pick: 13, team: "Detroit Pistons", year: 2022, college: "Memphis", tier: "hard" },
  // 2021 draft
  { name: "Cade Cunningham", pick: 1, team: "Detroit Pistons", year: 2021, college: "Oklahoma State", tier: "easy" },
  { name: "Jalen Green", pick: 2, team: "Houston Rockets", year: 2021, college: "G League Ignite", tier: "medium" },
  { name: "Evan Mobley", pick: 3, team: "Cleveland Cavaliers", year: 2021, college: "USC", tier: "easy" },
  { name: "Scottie Barnes", pick: 4, team: "Toronto Raptors", year: 2021, college: "Florida State", tier: "easy" },
  { name: "Jalen Suggs", pick: 5, team: "Orlando Magic", year: 2021, college: "Gonzaga", tier: "medium" },
  { name: "Josh Giddey", pick: 6, team: "Oklahoma City Thunder", year: 2021, country: "Australia", isInternational: true, tier: "medium" },
  { name: "Franz Wagner", pick: 8, team: "Orlando Magic", year: 2021, college: "Michigan", tier: "medium" },
  { name: "Alperen Şengün", pick: 16, team: "Houston Rockets", year: 2021, country: "Turkey", isInternational: true, tier: "medium" },
  // 2020 draft
  { name: "Anthony Edwards", pick: 1, team: "Minnesota Timberwolves", year: 2020, college: "Georgia", tier: "easy" },
  { name: "LaMelo Ball", pick: 3, team: "Charlotte Hornets", year: 2020, country: "USA", altCountries: ["Australia"], isInternational: true, tier: "easy" },
  { name: "Tyrese Haliburton", pick: 12, team: "Sacramento Kings", year: 2020, college: "Iowa State", tier: "easy" },
  { name: "Desmond Bane", pick: 30, team: "Memphis Grizzlies", year: 2020, college: "TCU", tier: "medium" },
  { name: "Immanuel Quickley", pick: 25, team: "New York Knicks", year: 2020, college: "Kentucky", tier: "medium" },
  { name: "Tyrese Maxey", pick: 21, team: "Philadelphia 76ers", year: 2020, college: "Kentucky", tier: "easy" },
  { name: "Jaden McDaniels", pick: 28, team: "Minnesota Timberwolves", year: 2020, college: "Washington", tier: "medium" },
  { name: "Saddiq Bey", pick: 19, team: "Detroit Pistons", year: 2020, college: "Villanova", tier: "hard" },
  // 2019 draft
  { name: "Zion Williamson", pick: 1, team: "New Orleans Pelicans", year: 2019, college: "Duke", tier: "easy" },
  { name: "Ja Morant", pick: 2, team: "Memphis Grizzlies", year: 2019, college: "Murray State", tier: "easy" },
  { name: "RJ Barrett", pick: 3, team: "New York Knicks", year: 2019, college: "Duke", tier: "medium" },
  { name: "De'Andre Hunter", pick: 4, team: "Atlanta Hawks", year: 2019, college: "Virginia", tier: "medium" },
  { name: "Darius Garland", pick: 5, team: "Cleveland Cavaliers", year: 2019, college: "Vanderbilt", tier: "medium" },
  { name: "Jarrett Culver", pick: 6, team: "Minnesota Timberwolves", year: 2019, college: "Texas Tech", tier: "hard" },
  { name: "Coby White", pick: 7, team: "Chicago Bulls", year: 2019, college: "North Carolina", tier: "medium" },
  { name: "Jaxson Hayes", pick: 8, team: "New Orleans Pelicans", year: 2019, college: "Texas", tier: "hard" },
  { name: "Cam Johnson", pick: 11, team: "Phoenix Suns", year: 2019, college: "North Carolina", tier: "medium" },
  { name: "Tyler Herro", pick: 13, team: "Miami Heat", year: 2019, college: "Kentucky", tier: "easy" },
  { name: "Brandon Clarke", pick: 21, team: "Memphis Grizzlies", year: 2019, college: "Gonzaga", tier: "hard" },
  { name: "Grant Williams", pick: 22, team: "Boston Celtics", year: 2019, college: "Tennessee", tier: "hard" },
  { name: "Nickeil Alexander-Walker", pick: 17, team: "New Orleans Pelicans", year: 2019, college: "Virginia Tech", tier: "hard" },
  // 2018 draft
  { name: "Deandre Ayton", pick: 1, team: "Phoenix Suns", year: 2018, college: "Arizona", tier: "medium" },
  { name: "Luka Dončić", pick: 3, team: "Dallas Mavericks", year: 2018, country: "Slovenia", altCountries: ["Spain"], isInternational: true, tier: "easy" },
  { name: "Trae Young", pick: 5, team: "Atlanta Hawks", year: 2018, college: "Oklahoma", tier: "easy" },
  { name: "Mo Bamba", pick: 6, team: "Orlando Magic", year: 2018, college: "Texas", tier: "hard" },
  { name: "Collin Sexton", pick: 8, team: "Cleveland Cavaliers", year: 2018, college: "Alabama", tier: "medium" },
  { name: "Mikal Bridges", pick: 10, team: "Phoenix Suns", year: 2018, college: "Villanova", tier: "medium" },
  { name: "Shai Gilgeous-Alexander", pick: 11, team: "Los Angeles Clippers", year: 2018, college: "Kentucky", tier: "easy" },
  { name: "Michael Porter Jr.", pick: 14, team: "Denver Nuggets", year: 2018, college: "Missouri", tier: "medium" },
  { name: "Kevin Huerter", pick: 19, team: "Atlanta Hawks", year: 2018, college: "Maryland", tier: "hard" },
  { name: "Grayson Allen", pick: 21, team: "Utah Jazz", year: 2018, college: "Duke", tier: "medium" },
  { name: "Robert Williams III", pick: 27, team: "Boston Celtics", year: 2018, college: "Texas A&M", tier: "medium" },
  { name: "Landry Shamet", pick: 26, team: "Philadelphia 76ers", year: 2018, college: "Wichita State", tier: "hard" },
  // 2017 draft
  { name: "Markelle Fultz", pick: 1, team: "Philadelphia 76ers", year: 2017, college: "Washington", tier: "medium" },
  { name: "Lonzo Ball", pick: 2, team: "Los Angeles Lakers", year: 2017, college: "UCLA", tier: "easy" },
  { name: "Jayson Tatum", pick: 3, team: "Boston Celtics", year: 2017, college: "Duke", tier: "easy" },
  { name: "De'Aaron Fox", pick: 5, team: "Sacramento Kings", year: 2017, college: "Kentucky", tier: "easy" },
  { name: "Jonathan Isaac", pick: 6, team: "Orlando Magic", year: 2017, college: "Florida State", tier: "hard" },
  { name: "Lauri Markkanen", pick: 7, team: "Chicago Bulls", year: 2017, college: "Arizona", tier: "medium" },
  { name: "Dennis Smith Jr.", pick: 9, team: "Dallas Mavericks", year: 2017, college: "NC State", tier: "hard" },
  { name: "Zach Collins", pick: 10, team: "Portland Trail Blazers", year: 2017, college: "Gonzaga", tier: "hard" },
  { name: "Donovan Mitchell", pick: 13, team: "Utah Jazz", year: 2017, college: "Louisville", tier: "easy" },
  { name: "Bam Adebayo", pick: 14, team: "Miami Heat", year: 2017, college: "Kentucky", tier: "easy" },
  { name: "OG Anunoby", pick: 23, team: "Toronto Raptors", year: 2017, college: "Indiana", tier: "medium" },
  { name: "Kyle Kuzma", pick: 27, team: "Los Angeles Lakers", year: 2017, college: "Utah", tier: "medium" },
  { name: "Derrick White", pick: 29, team: "San Antonio Spurs", year: 2017, college: "Colorado", tier: "medium" },
  { name: "Monte Morris", pick: 51, team: "Denver Nuggets", year: 2017, college: "Iowa State", tier: "hard" },
  // 2016 draft
  { name: "Ben Simmons", pick: 1, team: "Philadelphia 76ers", year: 2016, college: "LSU", tier: "easy" },
  { name: "Brandon Ingram", pick: 2, team: "Los Angeles Lakers", year: 2016, college: "Duke", tier: "easy" },
  { name: "Jaylen Brown", pick: 3, team: "Boston Celtics", year: 2016, college: "California", tier: "easy" },
  { name: "Buddy Hield", pick: 6, team: "New Orleans Pelicans", year: 2016, college: "Oklahoma", tier: "medium" },
  { name: "Jamal Murray", pick: 7, team: "Denver Nuggets", year: 2016, college: "Kentucky", tier: "easy" },
  { name: "Domantas Sabonis", pick: 11, team: "Oklahoma City Thunder", year: 2016, college: "Gonzaga", tier: "easy" },
  { name: "Taurean Prince", pick: 12, team: "Atlanta Hawks", year: 2016, college: "Baylor", tier: "hard" },
  { name: "Dejounte Murray", pick: 29, team: "San Antonio Spurs", year: 2016, college: "Washington", tier: "medium" },
  { name: "Pascal Siakam", pick: 27, team: "Toronto Raptors", year: 2016, college: "New Mexico State", tier: "easy" },
  { name: "Malcolm Brogdon", pick: 36, team: "Milwaukee Bucks", year: 2016, college: "Virginia", tier: "medium" },
  { name: "Caris LeVert", pick: 20, team: "Brooklyn Nets", year: 2016, college: "Michigan", tier: "hard" },
  { name: "Patrick McCaw", pick: 38, team: "Golden State Warriors", year: 2016, college: "UNLV", tier: "hard" },
  // 2015 draft
  { name: "Karl-Anthony Towns", pick: 1, team: "Minnesota Timberwolves", year: 2015, college: "Kentucky", tier: "easy" },
  { name: "D'Angelo Russell", pick: 2, team: "Los Angeles Lakers", year: 2015, college: "Ohio State", tier: "medium" },
  { name: "Kristaps Porziņģis", pick: 4, team: "New York Knicks", year: 2015, country: "Latvia", altCountries: ["Spain"], isInternational: true, tier: "medium" },
  { name: "Devin Booker", pick: 13, team: "Phoenix Suns", year: 2015, college: "Kentucky", tier: "easy" },
  { name: "Myles Turner", pick: 11, team: "Indiana Pacers", year: 2015, college: "Texas", tier: "medium" },
  { name: "Terry Rozier", pick: 16, team: "Boston Celtics", year: 2015, college: "Louisville", tier: "medium" },
  { name: "Larry Nance Jr.", pick: 27, team: "Los Angeles Lakers", year: 2015, college: "Wyoming", tier: "hard" },
  { name: "Norman Powell", pick: 46, team: "Toronto Raptors", year: 2015, college: "UCLA", tier: "medium" },
  { name: "Montrezl Harrell", pick: 32, team: "Houston Rockets", year: 2015, college: "Louisville", tier: "hard" },
  { name: "Kelly Oubre Jr.", pick: 15, team: "Washington Wizards", year: 2015, college: "Kansas", tier: "medium" },
  { name: "Josh Richardson", pick: 40, team: "Miami Heat", year: 2015, college: "Tennessee", tier: "hard" },
  // 2014 draft
  { name: "Andrew Wiggins", pick: 1, team: "Cleveland Cavaliers", year: 2014, college: "Kansas", tier: "easy" },
  { name: "Jabari Parker", pick: 2, team: "Milwaukee Bucks", year: 2014, college: "Duke", tier: "medium" },
  { name: "Joel Embiid", pick: 3, team: "Philadelphia 76ers", year: 2014, college: "Kansas", tier: "easy" },
  { name: "Aaron Gordon", pick: 4, team: "Orlando Magic", year: 2014, college: "Arizona", tier: "easy" },
  { name: "Julius Randle", pick: 7, team: "Los Angeles Lakers", year: 2014, college: "Kentucky", tier: "easy" },
  { name: "Nik Stauskas", pick: 8, team: "Sacramento Kings", year: 2014, college: "Michigan", tier: "hard" },
  { name: "Zach LaVine", pick: 13, team: "Minnesota Timberwolves", year: 2014, college: "UCLA", tier: "easy" },
  { name: "T.J. Warren", pick: 14, team: "Phoenix Suns", year: 2014, college: "NC State", tier: "hard" },
  { name: "Jusuf Nurkić", pick: 16, team: "Denver Nuggets", year: 2014, country: "Bosnia", altCountries: ["Bosnia and Herzegovina", "Croatia"], isInternational: true, tier: "medium" },
  { name: "Rodney Hood", pick: 23, team: "Utah Jazz", year: 2014, college: "Duke", tier: "hard" },
  { name: "Clint Capela", pick: 25, team: "Houston Rockets", year: 2014, country: "Switzerland", altCountries: ["France"], isInternational: true, tier: "medium" },
  { name: "Bogdan Bogdanović", pick: 27, team: "Sacramento Kings", year: 2014, country: "Serbia", isInternational: true, tier: "medium" },
  { name: "Nikola Jokić", pick: 41, team: "Denver Nuggets", year: 2014, country: "Serbia", isInternational: true, tier: "easy" },
  { name: "Spencer Dinwiddie", pick: 38, team: "Detroit Pistons", year: 2014, college: "Colorado", tier: "medium" },
  { name: "Gary Harris", pick: 19, team: "Denver Nuggets", year: 2014, college: "Michigan State", tier: "hard" },
  // 2013 draft
  { name: "Anthony Bennett", pick: 1, team: "Cleveland Cavaliers", year: 2013, college: "UNLV", tier: "hard" },
  { name: "Victor Oladipo", pick: 2, team: "Orlando Magic", year: 2013, college: "Indiana", tier: "medium" },
  { name: "Otto Porter Jr.", pick: 3, team: "Washington Wizards", year: 2013, college: "Georgetown", tier: "hard" },
  { name: "CJ McCollum", pick: 10, team: "Portland Trail Blazers", year: 2013, college: "Lehigh", tier: "easy" },
  { name: "Steven Adams", pick: 12, team: "Oklahoma City Thunder", year: 2013, college: "Pittsburgh", tier: "medium" },
  { name: "Giannis Antetokounmpo", pick: 15, team: "Milwaukee Bucks", year: 2013, country: "Greece", isInternational: true, tier: "easy" },
  { name: "Rudy Gobert", pick: 27, team: "Utah Jazz", year: 2013, country: "France", isInternational: true, tier: "easy" },
  { name: "Dennis Schröder", pick: 17, team: "Atlanta Hawks", year: 2013, country: "Germany", isInternational: true, tier: "medium" },
  // 2012 draft
  { name: "Anthony Davis", pick: 1, team: "New Orleans Hornets", year: 2012, college: "Kentucky", tier: "easy" },
  { name: "Bradley Beal", pick: 3, team: "Washington Wizards", year: 2012, college: "Florida", tier: "easy" },
  { name: "Harrison Barnes", pick: 7, team: "Golden State Warriors", year: 2012, college: "North Carolina", tier: "medium" },
  { name: "Andre Drummond", pick: 9, team: "Detroit Pistons", year: 2012, college: "Connecticut", tier: "medium" },
  { name: "Khris Middleton", pick: 39, team: "Milwaukee Bucks", year: 2012, college: "Texas A&M", tier: "easy" },
  { name: "Draymond Green", pick: 35, team: "Golden State Warriors", year: 2012, college: "Michigan State", tier: "easy" },
  { name: "Damian Lillard", pick: 6, team: "Portland Trail Blazers", year: 2012, college: "Weber State", tier: "easy" },
  { name: "Jae Crowder", pick: 34, team: "Cleveland Cavaliers", year: 2012, college: "Marquette", tier: "medium" },
  // 2011 draft
  { name: "Kyrie Irving", pick: 1, team: "Cleveland Cavaliers", year: 2011, college: "Duke", tier: "easy" },
  { name: "Klay Thompson", pick: 11, team: "Golden State Warriors", year: 2011, college: "Washington State", tier: "easy" },
  { name: "Kawhi Leonard", pick: 15, team: "San Antonio Spurs", year: 2011, college: "San Diego State", tier: "easy" },
  { name: "Jimmy Butler", pick: 30, team: "Chicago Bulls", year: 2011, college: "Marquette", tier: "easy" },
  { name: "Kemba Walker", pick: 9, team: "Charlotte Bobcats", year: 2011, college: "Connecticut", tier: "medium" },
  { name: "Tobias Harris", pick: 19, team: "Milwaukee Bucks", year: 2011, college: "Tennessee", tier: "medium" },
  { name: "Nikola Vučević", pick: 16, team: "Philadelphia 76ers", year: 2011, college: "USC", tier: "medium" },
  { name: "Reggie Jackson", pick: 24, team: "Oklahoma City Thunder", year: 2011, college: "Boston College", tier: "hard" },
  // 2010 draft
  { name: "John Wall", pick: 1, team: "Washington Wizards", year: 2010, college: "Kentucky", tier: "easy" },
  { name: "DeMarcus Cousins", pick: 5, team: "Sacramento Kings", year: 2010, college: "Kentucky", tier: "easy" },
  { name: "Paul George", pick: 10, team: "Indiana Pacers", year: 2010, college: "Fresno State", tier: "easy" },
  { name: "Gordon Hayward", pick: 9, team: "Utah Jazz", year: 2010, college: "Butler", tier: "easy" },
  { name: "Greg Monroe", pick: 7, team: "Detroit Pistons", year: 2010, college: "Georgetown", tier: "medium" },
  { name: "Evan Turner", pick: 2, team: "Philadelphia 76ers", year: 2010, college: "Ohio State", tier: "medium" },
  { name: "Hassan Whiteside", pick: 33, team: "Sacramento Kings", year: 2010, college: "Marshall", tier: "medium" },
  // 2009 draft
  { name: "Blake Griffin", pick: 1, team: "Los Angeles Clippers", year: 2009, college: "Oklahoma", tier: "easy" },
  { name: "James Harden", pick: 3, team: "Oklahoma City Thunder", year: 2009, college: "Arizona State", tier: "easy" },
  { name: "Stephen Curry", pick: 7, team: "Golden State Warriors", year: 2009, college: "Davidson", tier: "easy" },
  { name: "DeMar DeRozan", pick: 9, team: "Toronto Raptors", year: 2009, college: "USC", tier: "easy" },
  { name: "Ricky Rubio", pick: 5, team: "Minnesota Timberwolves", year: 2009, country: "Spain", isInternational: true, tier: "medium" },
  { name: "Jrue Holiday", pick: 17, team: "Philadelphia 76ers", year: 2009, college: "UCLA", tier: "easy" },
  // 2008 draft
  { name: "Derrick Rose", pick: 1, team: "Chicago Bulls", year: 2008, college: "Memphis", tier: "easy" },
  { name: "Russell Westbrook", pick: 4, team: "Seattle SuperSonics", year: 2008, college: "UCLA", tier: "easy" },
  { name: "Kevin Love", pick: 5, team: "Minnesota Timberwolves", year: 2008, college: "UCLA", tier: "easy" },
  { name: "Serge Ibaka", pick: 24, team: "Seattle SuperSonics", year: 2008, country: "Republic of the Congo", altCountries: ["Congo", "Spain"], isInternational: true, tier: "medium" },
  // 2007 draft
  { name: "Kevin Durant", pick: 2, team: "Seattle SuperSonics", year: 2007, college: "Texas", tier: "easy" },
  { name: "Al Horford", pick: 3, team: "Atlanta Hawks", year: 2007, college: "Florida", tier: "easy" },
  // 2006 draft
  { name: "LaMarcus Aldridge", pick: 2, team: "Portland Trail Blazers", year: 2006, college: "Texas", tier: "medium" },
  // 2005 draft
  { name: "Chris Paul", pick: 4, team: "New Orleans Hornets", year: 2005, college: "Wake Forest", tier: "easy" },
  // 2003 draft
  { name: "LeBron James", pick: 1, team: "Cleveland Cavaliers", year: 2003, college: "St. Vincent–St. Mary HS", tier: "easy" },
  // === 2024 draft class ===
  { name: "Zaccharie Risacher", pick: 1, team: "Atlanta Hawks", year: 2024, country: "France", isInternational: true, tier: "medium" },
  { name: "Alex Sarr", pick: 2, team: "Washington Wizards", year: 2024, country: "France", isInternational: true, tier: "medium" },
  { name: "Reed Sheppard", pick: 3, team: "Houston Rockets", year: 2024, college: "Kentucky", tier: "medium" },
  { name: "Stephon Castle", pick: 4, team: "San Antonio Spurs", year: 2024, college: "UConn", tier: "medium" },
  { name: "Ron Holland II", pick: 5, team: "Detroit Pistons", year: 2024, college: "G League Ignite", tier: "hard" },
  { name: "Tidjane Salaün", pick: 6, team: "Charlotte Hornets", year: 2024, country: "France", isInternational: true, tier: "hard" },
  { name: "Donovan Clingan", pick: 7, team: "Portland Trail Blazers", year: 2024, college: "UConn", tier: "medium" },
  { name: "Rob Dillingham", pick: 8, team: "Minnesota Timberwolves", year: 2024, college: "Kentucky", tier: "hard" },
  { name: "Zach Edey", pick: 9, team: "Memphis Grizzlies", year: 2024, college: "Purdue", tier: "medium" },
  { name: "Cody Williams", pick: 10, team: "Utah Jazz", year: 2024, college: "Colorado", tier: "hard" },
  { name: "Matas Buzelis", pick: 11, team: "Chicago Bulls", year: 2024, college: "G League Ignite", tier: "hard" },
  { name: "Nikola Topić", pick: 12, team: "Oklahoma City Thunder", year: 2024, country: "Serbia", isInternational: true, tier: "hard" },
  { name: "Devin Carter", pick: 13, team: "Sacramento Kings", year: 2024, college: "Providence", tier: "hard" },
  { name: "Bub Carrington", pick: 14, team: "Washington Wizards", year: 2024, college: "Pittsburgh", tier: "hard" },
  { name: "Kel'el Ware", pick: 15, team: "Miami Heat", year: 2024, college: "Indiana", tier: "medium" },
  { name: "Jared McCain", pick: 16, team: "Philadelphia 76ers", year: 2024, college: "Duke", tier: "medium" },
  { name: "Dalton Knecht", pick: 17, team: "Los Angeles Lakers", year: 2024, college: "Tennessee", tier: "medium" },
  { name: "Tristan da Silva", pick: 18, team: "Orlando Magic", year: 2024, college: "Colorado", tier: "hard" },
  { name: "Ja'Kobe Walter", pick: 19, team: "Toronto Raptors", year: 2024, college: "Baylor", tier: "hard" },
  { name: "Yves Missi", pick: 21, team: "New Orleans Pelicans", year: 2024, college: "Baylor", tier: "hard" },
  { name: "Bronny James", pick: 55, team: "Los Angeles Lakers", year: 2024, college: "USC", tier: "easy" },

  // === More 2022-2023 picks I missed ===
  { name: "Gradey Dick", pick: 13, team: "Toronto Raptors", year: 2023, college: "Kansas", tier: "hard" },
  { name: "Brandin Podziemski", pick: 19, team: "Golden State Warriors", year: 2023, college: "Santa Clara", tier: "medium" },
  { name: "Jalen Hood-Schifino", pick: 17, team: "Los Angeles Lakers", year: 2023, college: "Indiana", tier: "hard" },
  { name: "Cason Wallace", pick: 10, team: "Oklahoma City Thunder", year: 2023, college: "Kentucky", tier: "medium" },
  { name: "Dereck Lively II", pick: 12, team: "Dallas Mavericks", year: 2023, college: "Duke", tier: "medium" },
  { name: "Bilal Coulibaly", pick: 7, team: "Washington Wizards", year: 2023, country: "France", isInternational: true, tier: "medium" },
  { name: "Taylor Hendricks", pick: 9, team: "Utah Jazz", year: 2023, college: "UCF", tier: "hard" },
  { name: "Jarace Walker", pick: 8, team: "Indiana Pacers", year: 2023, college: "Houston", tier: "hard" },
  { name: "Anthony Black", pick: 6, team: "Orlando Magic", year: 2023, college: "Arkansas", tier: "hard" },
  { name: "Kris Murray", pick: 23, team: "Portland Trail Blazers", year: 2023, college: "Iowa", tier: "hard" },
  { name: "AJ Griffin", pick: 16, team: "Atlanta Hawks", year: 2022, college: "Duke", tier: "hard" },
  { name: "Shaedon Sharpe", pick: 7, team: "Portland Trail Blazers", year: 2022, college: "Kentucky", tier: "medium" },
  { name: "Dyson Daniels", pick: 8, team: "New Orleans Pelicans", year: 2022, college: "G League Ignite", tier: "medium" },
  { name: "Walker Kessler", pick: 22, team: "Utah Jazz", year: 2022, college: "Auburn", tier: "medium" },
  { name: "Mark Williams", pick: 15, team: "Charlotte Hornets", year: 2022, college: "Duke", tier: "hard" },
  { name: "Tari Eason", pick: 17, team: "Houston Rockets", year: 2022, college: "LSU", tier: "hard" },
  { name: "Christian Braun", pick: 21, team: "Denver Nuggets", year: 2022, college: "Kansas", tier: "medium" },
  { name: "Nikola Jović", pick: 27, team: "Miami Heat", year: 2022, country: "Serbia", isInternational: true, tier: "hard" },
  { name: "Peyton Watson", pick: 30, team: "Denver Nuggets", year: 2022, college: "UCLA", tier: "hard" },
  { name: "Jalen Williams", pick: 12, team: "Oklahoma City Thunder", year: 2022, college: "Santa Clara", tier: "easy" },

  // === More current starters/rotation — 2015-2021 fills ===
  { name: "Jalen Johnson", pick: 20, team: "Atlanta Hawks", year: 2021, college: "Duke", tier: "medium" },
  { name: "Trey Murphy III", pick: 17, team: "New Orleans Pelicans", year: 2021, college: "Virginia", tier: "medium" },
  { name: "Davion Mitchell", pick: 9, team: "Sacramento Kings", year: 2021, college: "Baylor", tier: "hard" },
  { name: "Corey Kispert", pick: 15, team: "Washington Wizards", year: 2021, college: "Gonzaga", tier: "hard" },
  { name: "Chris Duarte", pick: 13, team: "Indiana Pacers", year: 2021, college: "Oregon", tier: "hard" },
  { name: "Herbert Jones", pick: 35, team: "New Orleans Pelicans", year: 2021, college: "Alabama", tier: "medium" },
  { name: "Ayo Dosunmu", pick: 38, team: "Chicago Bulls", year: 2021, college: "Illinois", tier: "hard" },
  { name: "Isaiah Jackson", pick: 22, team: "Indiana Pacers", year: 2021, college: "Kentucky", tier: "hard" },
  { name: "Jaden Springer", pick: 28, team: "Philadelphia 76ers", year: 2021, college: "Tennessee", tier: "hard" },
  { name: "Aaron Nesmith", pick: 14, team: "Boston Celtics", year: 2020, college: "Vanderbilt", tier: "medium" },
  { name: "Isaac Okoro", pick: 5, team: "Cleveland Cavaliers", year: 2020, college: "Auburn", tier: "medium" },
  { name: "Onyeka Okongwu", pick: 6, team: "Atlanta Hawks", year: 2020, college: "USC", tier: "medium" },
  { name: "Obi Toppin", pick: 8, team: "New York Knicks", year: 2020, college: "Dayton", tier: "medium" },
  { name: "Deni Avdija", pick: 9, team: "Washington Wizards", year: 2020, country: "Israel", isInternational: true, tier: "medium" },
  { name: "Patrick Williams", pick: 4, team: "Chicago Bulls", year: 2020, college: "Florida State", tier: "hard" },
  { name: "Precious Achiuwa", pick: 20, team: "Miami Heat", year: 2020, college: "Memphis", tier: "hard" },
  { name: "Jalen Smith", pick: 10, team: "Phoenix Suns", year: 2020, college: "Maryland", tier: "hard" },
  { name: "Killian Hayes", pick: 7, team: "Detroit Pistons", year: 2020, country: "France", isInternational: true, tier: "hard" },
  { name: "Tyrell Terry", pick: 31, team: "Dallas Mavericks", year: 2020, college: "Stanford", tier: "hard" },
  { name: "Payton Pritchard", pick: 26, team: "Boston Celtics", year: 2020, college: "Oregon", tier: "medium" },
  { name: "Naz Reid", pick: null, team: "Minnesota Timberwolves", year: 2019, college: "LSU", tier: "medium" }, // undrafted
  { name: "Terance Mann", pick: 48, team: "Los Angeles Clippers", year: 2019, college: "Florida State", tier: "medium" },
  { name: "Nic Claxton", pick: 31, team: "Brooklyn Nets", year: 2019, college: "Georgia", tier: "medium" },
  { name: "Kevin Porter Jr.", pick: 30, team: "Cleveland Cavaliers", year: 2019, college: "USC", tier: "hard" },
  { name: "Matisse Thybulle", pick: 20, team: "Philadelphia 76ers", year: 2019, college: "Washington", tier: "hard" },
  { name: "Keldon Johnson", pick: 29, team: "San Antonio Spurs", year: 2019, college: "Kentucky", tier: "medium" },
  { name: "P.J. Washington", pick: 12, team: "Charlotte Hornets", year: 2019, college: "Kentucky", tier: "medium" },
  { name: "Nassir Little", pick: 25, team: "Portland Trail Blazers", year: 2019, college: "North Carolina", tier: "hard" },
  { name: "Talen Horton-Tucker", pick: 46, team: "Los Angeles Lakers", year: 2019, college: "Iowa State", tier: "hard" },
  { name: "Josh Hart", pick: 30, team: "Los Angeles Lakers", year: 2017, college: "Villanova", tier: "medium" },
  { name: "Dillon Brooks", pick: 45, team: "Memphis Grizzlies", year: 2017, college: "Oregon", tier: "medium" },
  { name: "Jarrett Allen", pick: 22, team: "Brooklyn Nets", year: 2017, college: "Texas", tier: "easy" },
  { name: "Luke Kennard", pick: 12, team: "Detroit Pistons", year: 2017, college: "Duke", tier: "hard" },
  { name: "John Collins", pick: 19, team: "Atlanta Hawks", year: 2017, college: "Wake Forest", tier: "medium" },
  { name: "Jonas Valančiūnas", pick: 5, team: "Toronto Raptors", year: 2011, country: "Lithuania", isInternational: true, tier: "medium" },
  { name: "Nikola Mirotić", pick: 23, team: "Chicago Bulls", year: 2011, country: "Montenegro", altCountries: ["Spain"], isInternational: true, tier: "hard" },
  { name: "Enes Kanter Freedom", pick: 3, team: "Utah Jazz", year: 2011, country: "Turkey", isInternational: true, tier: "medium" },
  { name: "Tristan Thompson", pick: 4, team: "Cleveland Cavaliers", year: 2011, country: "Canada", isInternational: true, tier: "medium" },
  { name: "Kenneth Faried", pick: 22, team: "Denver Nuggets", year: 2011, college: "Morehead State", tier: "hard" },
  { name: "Reggie Bullock", pick: 25, team: "Los Angeles Clippers", year: 2013, college: "North Carolina", tier: "hard" },
  { name: "Dario Šarić", pick: 12, team: "Philadelphia 76ers", year: 2014, country: "Croatia", isInternational: true, tier: "medium" },
  { name: "Elfrid Payton", pick: 10, team: "Orlando Magic", year: 2014, college: "Louisiana-Lafayette", tier: "hard" },
  { name: "Doug McDermott", pick: 11, team: "Chicago Bulls", year: 2014, college: "Creighton", tier: "hard" },
  { name: "Jordan Clarkson", pick: 46, team: "Los Angeles Lakers", year: 2014, college: "Missouri", tier: "medium" },
  { name: "Shabazz Napier", pick: 24, team: "Miami Heat", year: 2014, college: "UConn", tier: "hard" },
  { name: "Noah Vonleh", pick: 9, team: "Charlotte Hornets", year: 2014, college: "Indiana", tier: "hard" },
  { name: "Dante Exum", pick: 5, team: "Utah Jazz", year: 2014, country: "Australia", isInternational: true, tier: "hard" },
  { name: "Willie Cauley-Stein", pick: 6, team: "Sacramento Kings", year: 2015, college: "Kentucky", tier: "hard" },
  { name: "Trey Lyles", pick: 12, team: "Utah Jazz", year: 2015, college: "Kentucky", tier: "hard" },
  { name: "Rondae Hollis-Jefferson", pick: 23, team: "Brooklyn Nets", year: 2015, college: "Arizona", tier: "hard" },
  { name: "Justise Winslow", pick: 10, team: "Miami Heat", year: 2015, college: "Duke", tier: "hard" },
  { name: "Emmanuel Mudiay", pick: 7, team: "Denver Nuggets", year: 2015, country: "DR Congo", altCountries: ["USA", "China"], isInternational: true, tier: "hard" },
  { name: "Mario Hezonja", pick: 5, team: "Orlando Magic", year: 2015, country: "Croatia", isInternational: true, tier: "hard" },

  // === More Raptors/Bucks/etc role players ===
  { name: "Delon Wright", pick: 20, team: "Toronto Raptors", year: 2015, college: "Utah", tier: "hard" },
  { name: "Cory Joseph", pick: 29, team: "San Antonio Spurs", year: 2011, college: "Texas", tier: "hard" },
  { name: "Iman Shumpert", pick: 17, team: "New York Knicks", year: 2011, college: "Georgia Tech", tier: "hard" },
  { name: "MarShon Brooks", pick: 25, team: "New Jersey Nets", year: 2011, college: "Providence", tier: "hard" },
  { name: "Joakim Noah", pick: 9, team: "Chicago Bulls", year: 2007, college: "Florida", tier: "medium" },
  { name: "Spencer Hawes", pick: 10, team: "Sacramento Kings", year: 2007, college: "Washington", tier: "hard" },
  { name: "Marc Gasol", pick: 48, team: "Los Angeles Lakers", year: 2007, country: "Spain", isInternational: true, tier: "medium" },
  { name: "Thabo Sefolosha", pick: 13, team: "Philadelphia 76ers", year: 2006, country: "Switzerland", isInternational: true, tier: "hard" },

  // === LEGENDS (~25) ===
  // Kobe: drafted 13th by Hornets, traded to Lakers on draft night — first played for Lakers
  { name: "Kobe Bryant", pick: 13, team: "Los Angeles Lakers", year: 1996, college: "Lower Merion HS", tier: "easy" },
  { name: "Shaquille O'Neal", pick: 1, team: "Orlando Magic", year: 1992, college: "LSU", tier: "easy" },
  { name: "Tim Duncan", pick: 1, team: "San Antonio Spurs", year: 1997, college: "Wake Forest", tier: "easy" },
  // Dirk: drafted 9th by Bucks, traded to Mavericks on draft night
  { name: "Dirk Nowitzki", pick: 9, team: "Dallas Mavericks", year: 1998, country: "Germany", isInternational: true, tier: "easy" },
  { name: "Dwyane Wade", pick: 5, team: "Miami Heat", year: 2003, college: "Marquette", tier: "easy" },
  { name: "Carmelo Anthony", pick: 3, team: "Denver Nuggets", year: 2003, college: "Syracuse", tier: "easy" },
  { name: "Chris Bosh", pick: 4, team: "Toronto Raptors", year: 2003, college: "Georgia Tech", tier: "easy" },
  { name: "Kevin Garnett", pick: 5, team: "Minnesota Timberwolves", year: 1995, college: "Farragut Career Academy", tier: "easy" },
  // Paul Pierce: drafted by Celtics (no trade) — played 15 yrs for them
  { name: "Paul Pierce", pick: 10, team: "Boston Celtics", year: 1998, college: "Kansas", tier: "easy" },
  { name: "Allen Iverson", pick: 1, team: "Philadelphia 76ers", year: 1996, college: "Georgetown", tier: "easy" },
  { name: "Ray Allen", pick: 5, team: "Milwaukee Bucks", year: 1996, college: "UConn", tier: "easy" },
  // Steve Nash: drafted 15th by Suns in 1996
  { name: "Steve Nash", pick: 15, team: "Phoenix Suns", year: 1996, college: "Santa Clara", tier: "easy" },
  { name: "Jason Kidd", pick: 2, team: "Dallas Mavericks", year: 1994, college: "California", tier: "easy" },
  { name: "Grant Hill", pick: 3, team: "Detroit Pistons", year: 1994, college: "Duke", tier: "easy" },
  { name: "Dwight Howard", pick: 1, team: "Orlando Magic", year: 2004, college: "SW Atlanta Christian Academy", tier: "easy" },
  // Pau: drafted 3rd by Hawks, traded to Grizzlies on draft night
  { name: "Pau Gasol", pick: 3, team: "Memphis Grizzlies", year: 2001, country: "Spain", isInternational: true, tier: "easy" },
  { name: "Manu Ginóbili", pick: 57, team: "San Antonio Spurs", year: 1999, country: "Argentina", isInternational: true, tier: "easy" },
  { name: "Tony Parker", pick: 28, team: "San Antonio Spurs", year: 2001, country: "France", isInternational: true, tier: "easy" },
  { name: "Vince Carter", pick: 5, team: "Toronto Raptors", year: 1998, college: "North Carolina", tier: "easy" },
  { name: "Tracy McGrady", pick: 9, team: "Toronto Raptors", year: 1997, college: "Mount Zion Christian Academy", tier: "easy" },
  { name: "Yao Ming", pick: 1, team: "Houston Rockets", year: 2002, country: "China", isInternational: true, tier: "easy" },
  { name: "Dikembe Mutombo", pick: 4, team: "Denver Nuggets", year: 1991, country: "DR Congo", isInternational: true, tier: "medium" },
  { name: "Hakeem Olajuwon", pick: 1, team: "Houston Rockets", year: 1984, college: "Houston", tier: "easy" },
  { name: "Michael Jordan", pick: 3, team: "Chicago Bulls", year: 1984, college: "North Carolina", tier: "easy" },
  { name: "Magic Johnson", pick: 1, team: "Los Angeles Lakers", year: 1979, college: "Michigan State", tier: "easy" },
  { name: "Larry Bird", pick: 6, team: "Boston Celtics", year: 1978, college: "Indiana State", tier: "easy" },
  { name: "Patrick Ewing", pick: 1, team: "New York Knicks", year: 1985, college: "Georgetown", tier: "medium" },
  // Pippen: drafted 5th by Sonics, traded to Bulls on draft night
  { name: "Scottie Pippen", pick: 5, team: "Chicago Bulls", year: 1987, college: "Central Arkansas", tier: "easy" },
  { name: "Rasheed Wallace", pick: 4, team: "Washington Bullets", year: 1995, college: "North Carolina", tier: "medium" },
  // Baron Davis: drafted 3rd by Hornets in 1999 (still in Charlotte at that time)
  { name: "Baron Davis", pick: 3, team: "Charlotte Hornets", year: 1999, college: "UCLA", tier: "medium" },

  // === Additional fills to hit 150 ===
  { name: "Peja Stojaković", pick: 14, team: "Sacramento Kings", year: 1996, country: "Croatia", altCountries: ["Serbia"], isInternational: true, tier: "medium" },
  { name: "Stephon Marbury", pick: 4, team: "Milwaukee Bucks", year: 1996, college: "Georgia Tech", tier: "medium" },
  { name: "Jermaine O'Neal", pick: 17, team: "Portland Trail Blazers", year: 1996, college: "Eau Claire HS", tier: "medium" },
  { name: "Antoine Walker", pick: 6, team: "Boston Celtics", year: 1996, college: "Kentucky", tier: "hard" },
  { name: "Marcus Camby", pick: 2, team: "Toronto Raptors", year: 1996, college: "UMass", tier: "hard" },
  { name: "Ben Wallace", pick: null, team: "Washington Bullets", year: 1996, college: "Virginia Union", tier: "medium" }, // undrafted
  { name: "Andrei Kirilenko", pick: 24, team: "Utah Jazz", year: 1999, country: "Russia", isInternational: true, tier: "medium" },
  { name: "Elton Brand", pick: 1, team: "Chicago Bulls", year: 1999, college: "Duke", tier: "medium" },
  { name: "Shawn Marion", pick: 9, team: "Phoenix Suns", year: 1999, college: "UNLV", tier: "medium" },
  { name: "Lamar Odom", pick: 4, team: "Los Angeles Clippers", year: 1999, college: "Rhode Island", tier: "medium" },
  { name: "Jason Terry", pick: 10, team: "Atlanta Hawks", year: 1999, college: "Arizona", tier: "medium" },
  { name: "Richard Hamilton", pick: 7, team: "Washington Wizards", year: 1999, college: "UConn", tier: "medium" },
  { name: "Andre Iguodala", pick: 9, team: "Philadelphia 76ers", year: 2004, college: "Arizona", tier: "easy" },
  { name: "Luol Deng", pick: 7, team: "Chicago Bulls", year: 2004, college: "Duke", tier: "medium" },
  { name: "Josh Smith", pick: 17, team: "Atlanta Hawks", year: 2004, college: "Oak Hill Academy", tier: "medium" },
  { name: "Danny Granger", pick: 17, team: "Indiana Pacers", year: 2005, college: "New Mexico", tier: "medium" },
  { name: "Channing Frye", pick: 8, team: "New York Knicks", year: 2005, college: "Arizona", tier: "hard" },
  { name: "Andrew Bogut", pick: 1, team: "Milwaukee Bucks", year: 2005, country: "Australia", isInternational: true, tier: "medium" },
  { name: "Brandon Roy", pick: 6, team: "Portland Trail Blazers", year: 2006, college: "Washington", tier: "easy" },
  { name: "Rajon Rondo", pick: 21, team: "Boston Celtics", year: 2006, college: "Kentucky", tier: "easy" },
  { name: "Kyle Lowry", pick: 24, team: "Memphis Grizzlies", year: 2006, college: "Villanova", tier: "easy" },
  { name: "Rudy Gay", pick: 8, team: "Memphis Grizzlies", year: 2006, college: "UConn", tier: "medium" },
  { name: "J.J. Redick", pick: 11, team: "Orlando Magic", year: 2006, college: "Duke", tier: "medium" },
  { name: "Al Jefferson", pick: 15, team: "Boston Celtics", year: 2004, college: "Prentiss HS", tier: "hard" },
  { name: "Goran Dragić", pick: 45, team: "San Antonio Spurs", year: 2008, country: "Slovenia", isInternational: true, tier: "medium" },
  { name: "Roy Hibbert", pick: 17, team: "Toronto Raptors", year: 2008, college: "Georgetown", tier: "hard" },
  { name: "Brook Lopez", pick: 10, team: "New Jersey Nets", year: 2008, college: "Stanford", tier: "medium" },
  { name: "Eric Gordon", pick: 7, team: "Los Angeles Clippers", year: 2008, college: "Indiana", tier: "medium" },
  { name: "DeAndre Jordan", pick: 35, team: "Los Angeles Clippers", year: 2008, college: "Texas A&M", tier: "medium" },
  { name: "Danilo Gallinari", pick: 6, team: "New York Knicks", year: 2008, country: "Italy", isInternational: true, tier: "medium" },
  { name: "Greg Oden", pick: 1, team: "Portland Trail Blazers", year: 2007, college: "Ohio State", tier: "medium" },
  { name: "Jeff Teague", pick: 19, team: "Atlanta Hawks", year: 2009, college: "Wake Forest", tier: "hard" },
  { name: "Ty Lawson", pick: 18, team: "Denver Nuggets", year: 2009, college: "North Carolina", tier: "hard" },
  { name: "Brandon Jennings", pick: 10, team: "Milwaukee Bucks", year: 2009, country: "USA", altCountries: ["Italy"], tier: "hard" },
  { name: "Tyreke Evans", pick: 4, team: "Sacramento Kings", year: 2009, college: "Memphis", tier: "medium" },
];

// Fact order: pick, team, origin (main 3 = 20 each), then year as a bonus round (+10)
// Getting all 4 right earns a +30 "perfect round" bonus
// `origin` dynamically asks for college (US players) or country (international)
const FACTS = [
  { key: "pick", label: "Pick Number", points: 20, bonus: false },
  { key: "team", label: "First NBA Team", points: 20, bonus: false },
  { key: "origin", label: "College / Country", points: 20, bonus: false },
  { key: "year", label: "Draft Year", points: 10, bonus: true },
];

const PERFECT_ROUND_BONUS = 30;

function normalize(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Map of accepted aliases -> canonical school name
// Keys and values are normalized (lowercase, alphanumeric only)
const COLLEGE_ALIASES = {
  // UConn
  uconn: "connecticut",
  // UNC / Carolina
  unc: "northcarolina",
  carolina: "northcarolina",
  tarheels: "northcarolina",
  // NC State
  ncst: "ncstate",
  ncstatewolfpack: "ncstate",
  // Cal
  cal: "california",
  calberkeley: "california",
  berkeley: "california",
  // Pitt
  pitt: "pittsburgh",
  // Ole Miss (not in roster but common)
  olemiss: "mississippi",
  // SC / South Carolina
  sc: "southcarolina",
  // Mich State
  msu: "michiganstate",
  michst: "michiganstate",
  // Ohio St
  osu: "ohiostate",
  ohiost: "ohiostate",
  // Okla St
  okst: "oklahomastate",
  oklast: "oklahomastate",
  // Okla
  okla: "oklahoma",
  // Gonzaga
  zags: "gonzaga",
  // Kentucky
  uk: "kentucky",
  bigblue: "kentucky",
  // Duke
  bluedevils: "duke",
  // Kansas
  ku: "kansas",
  jayhawks: "kansas",
  // Michigan
  umich: "michigan",
  // Florida
  uf: "florida",
  gators: "florida",
  // Florida State
  fsu: "floridastate",
  flst: "floridastate",
  // Texas
  ut: "texas",
  utexas: "texas",
  longhorns: "texas",
  // Texas A&M
  tamu: "texasam",
  aggies: "texasam",
  // Texas Tech
  ttu: "texastech",
  // LSU
  louisianastate: "lsu",
  tigers: "lsu",
  // USC
  southerncal: "usc",
  southerncalifornia: "usc",
  // UCLA
  bruins: "ucla",
  // Villanova
  nova: "villanova",
  // Georgetown
  hoyas: "georgetown",
  // Syracuse (not in roster but common)
  cuse: "syracuse",
  orange: "syracuse",
  // Maryland
  umd: "maryland",
  terps: "maryland",
  // Virginia
  uva: "virginia",
  // Indiana
  iu: "indiana",
  hoosiers: "indiana",
  // Louisville
  uofl: "louisville",
  cards: "louisville",
  // Memphis
  umemphis: "memphis",
  // Auburn
  auburntigers: "auburn",
  // Alabama
  bama: "alabama",
  rolltide: "alabama",
  // Georgia
  uga: "georgia",
  // Arizona
  ua: "arizona",
  zona: "arizona",
  // Arizona State
  asu: "arizonastate",
  // Butler
  butlerbulldogs: "butler",
  // Marquette
  marq: "marquette",
  // Davidson
  davidsoncollege: "davidson",
  // Vanderbilt
  vandy: "vanderbilt",
  // Missouri
  mizzou: "missouri",
  // Wake Forest
  wake: "wakeforest",
  demondeacons: "wakeforest",
  // Iowa State
  isu: "iowastate",
  iowast: "iowastate",
  // Murray State
  murrayst: "murraystate",
  // San Diego State
  sdsu: "sandiegostate",
  // Fresno State
  fresnost: "fresnostate",
  // Washington
  uw: "washington",
  uwashington: "washington",
  huskies: "washington",
  // Washington State
  wsu: "washingtonstate",
  washst: "washingtonstate",
  // Utah
  utes: "utah",
  // Baylor
  baylorbears: "baylor",
  // TCU
  texaschristian: "tcu",
  // UNLV
  unlvrebels: "unlv",
  runninrebels: "unlv",
  // Lehigh
  lehighmountainhawks: "lehigh",
  // Wyoming
  uwyo: "wyoming",
  // Colorado
  cu: "colorado",
  buffs: "colorado",
  // New Mexico State
  nmsu: "newmexicostate",
  newmexicost: "newmexicostate",
};

function resolveCollegeAlias(normalized) {
  return COLLEGE_ALIASES[normalized] || normalized;
}

// Country aliases to accept common variations
const COUNTRY_ALIASES = {
  us: "usa",
  unitedstates: "usa",
  america: "usa",
  unitedstatesofamerica: "usa",
  uk: "unitedkingdom",
  greatbritain: "unitedkingdom",
  britain: "unitedkingdom",
  drc: "republicofthecongo",
  congo: "republicofthecongo",
  bosniaandherzegovina: "bosnia",
  bih: "bosnia",
  southkorea: "korea",
  korearepublic: "korea",
};

function resolveCountryAlias(normalized) {
  return COUNTRY_ALIASES[normalized] || normalized;
}

function checkAnswer(userInput, correct, factKey) {
  const u = normalize(userInput);
  const c = normalize(correct);
  if (!u) return false;
  if (factKey === "year") {
    return u === c;
  }
  if (factKey === "pick") {
    // Undrafted player: correct value is null/undefined
    if (correct === null || correct === undefined) {
      const undraftedAliases = ["undrafted", "udfa", "na", "none", "0", "nonedrafted", "wasntdrafted", "didntgetdrafted"];
      return undraftedAliases.includes(u);
    }
    return u === c;
  }
  if (factKey === "team") {
    if (u === c) return true;
    const parts = String(correct).toLowerCase().split(" ");
    const nickname = parts[parts.length - 1];
    // Accept just the team nickname (e.g. "Lakers", "Blazers", "Rockets")
    if (u === normalize(nickname)) return true;
    // Accept last two words (e.g. "Trail Blazers" for Portland Trail Blazers)
    if (parts.length >= 3 && u === normalize(parts.slice(-2).join(""))) return true;
    // Accept full city name (e.g. "Los Angeles", "New Orleans", "Oklahoma City")
    const city = parts.slice(0, -1).join("");
    if (u === normalize(city)) return true;
    // Accept first word of city (e.g. "portland" for Portland Trail Blazers,
    // "oklahoma" for Oklahoma City Thunder, "new" is too ambiguous so min 5 chars)
    if (parts.length >= 2 && parts[0].length >= 4 && u === normalize(parts[0])) return true;
    // Common NBA-specific aliases
    const teamAliases = {
      nola: "neworleanspelicans",
      nyk: "newyorkknicks",
      lal: "losangeleslakers",
      lac: "losangelesclippers",
      okc: "oklahomacitythunder",
      sas: "sanantoniospurs",
      gsw: "goldenstatewarriors",
      phi: "philadelphia76ers",
      sixers: "philadelphia76ers",
      wolves: "minnesotatimberwolves",
      timberwolves: "minnesotatimberwolves",
      tbd: "minnesotatimberwolves",
      cavs: "clevelandcavaliers",
      mavs: "dallasmavericks",
      sonics: "seattlesupersonics",
      supersonics: "seattlesupersonics",
      pels: "neworleanspelicans",
      pelicans: "neworleanspelicans",
      grizzlies: "memphisgrizzlies",
      grizz: "memphisgrizzlies",
      blazers: "portlandtrailblazers",
      trailblazers: "portlandtrailblazers",
      sixersphiladelphia: "philadelphia76ers",
    };
    const aliasTarget = teamAliases[u];
    if (aliasTarget && aliasTarget === normalize(correct)) return true;
    return false;
  }
  if (factKey === "origin") {
    // `correct` here is either a college name or an object { country, altCountries }
    if (typeof correct === "object" && correct !== null) {
      // International player — check primary and alt countries
      const allCountries = [correct.country, ...(correct.altCountries || [])];
      for (const countryName of allCountries) {
        if (!countryName) continue;
        const cc = normalize(countryName);
        if (u === cc) return true;
        // Check country aliases
        const resolved = resolveCountryAlias(u);
        if (resolved === cc) return true;
      }
      return false;
    } else {
      // US player — check college
      if (u === c) return true;
      const base = normalize(String(correct).split("(")[0].trim());
      if (u === base) return true;
      const resolved = resolveCollegeAlias(u);
      if (resolved === c || resolved === base) return true;
      // High-school detection: if the player went to a HS/Academy (no college),
      // accept generic answers like "HS", "high school", "prep"
      const lowerCorrect = String(correct).toLowerCase();
      const wentToHS =
        lowerCorrect.includes(" hs") ||
        lowerCorrect.endsWith(" hs") ||
        lowerCorrect.includes("high school") ||
        lowerCorrect.includes("academy");
      if (wentToHS) {
        const hsAliases = ["hs", "highschool", "highsch", "prep", "prepschool", "school"];
        if (hsAliases.includes(u)) return true;
      }
      return false;
    }
  }
  return u === c;
}

const GAME_LENGTH = 10; // Number of players per game

function InstructionsModal({ onStart, highScores }) {
  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center p-6"
      style={{ background: "#0a0a0a", fontFamily: "'Inter', -apple-system, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo+Black&family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700;900&display=swap');
        .display-font { font-family: 'Archivo Black', 'Impact', sans-serif; letter-spacing: -0.02em; }
        .bebas { font-family: 'Bebas Neue', 'Impact', sans-serif; letter-spacing: 0.04em; }
        .mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }
      `}</style>
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #ff6b00 0%, transparent 70%)" }}
      />

      <div
        className="relative max-w-2xl w-full border border-white/10 rounded-2xl p-6 md:p-10"
        style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)" }}
      >
        <div className="text-center mb-8">
          <h1 className="display-font text-5xl md:text-7xl leading-[0.9] text-white">
            HOOP<span style={{ color: "#ff6b00" }}>DRAFT</span>
          </h1>
          <p className="mono text-xs text-white/50 mt-3 uppercase tracking-wider">
            NBA Draft Trivia · How High Can You Score?
          </p>
        </div>

        <div className="space-y-5 text-white/85 mb-8">
          <div>
            <div className="bebas text-xl text-white mb-1" style={{ color: "#ff6b00" }}>
              The Game
            </div>
            <p className="text-sm leading-relaxed">
              You get <span className="font-bold text-white">{GAME_LENGTH} players</span>. For each one, you'll
              answer 4 questions about their NBA draft. Rack up as many points as possible!
            </p>
          </div>

          <div>
            <div className="bebas text-xl mb-2" style={{ color: "#ff6b00" }}>
              The Questions
            </div>
            <ul className="text-sm space-y-1.5 leading-relaxed">
              <li>1. <span className="font-semibold">Pick Number</span> — where they were drafted (+20)</li>
              <li>2. <span className="font-semibold">First NBA Team</span> — includes draft-night trades (+20)</li>
              <li>3. <span className="font-semibold">College or Country</span> — US players = college, international = country (+20)</li>
              <li>4. <span className="font-semibold">Draft Year</span> — bonus round, worth fewer points (+10)</li>
            </ul>
          </div>

          <div>
            <div className="bebas text-xl mb-1" style={{ color: "#ff6b00" }}>
              Perfect Round Bonus
            </div>
            <p className="text-sm leading-relaxed">
              Get <span className="font-bold text-white">all 4 questions right</span> on a single player to earn a{" "}
              <span className="font-bold" style={{ color: "#ff6b00" }}>+30 bonus</span>. That's 100 points per player —
              a perfect game = <span className="font-bold text-white">1000</span>.
            </p>
          </div>

          <div>
            <div className="bebas text-xl mb-1" style={{ color: "#ff6b00" }}>
              Streak
            </div>
            <p className="text-sm leading-relaxed">
              Keep correct answers in a row to build your streak. Any wrong or
              skipped answer breaks it, including the bonus year question. How far can you go?
            </p>
          </div>

          <div>
            <div className="bebas text-xl mb-1" style={{ color: "#ff6b00" }}>
              Difficulty
            </div>
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">Easy</span> = superstars only ·{" "}
              <span className="font-semibold">Medium</span> = stars + starters ·{" "}
              <span className="font-semibold">Hard</span> = all players. Change anytime (starts a new game).
            </p>
          </div>
        </div>

        {(highScores.easy > 0 || highScores.medium > 0 || highScores.hard > 0) && (
          <div className="mb-8 grid grid-cols-3 gap-2">
            {["easy", "medium", "hard"].map((d) => (
              <div key={d} className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <div className="mono text-[10px] text-white/50 uppercase tracking-wider">{d} best</div>
                <div className="bebas text-2xl" style={{ color: "#ff6b00" }}>
                  {highScores[d] || 0}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onStart}
          className="bebas text-2xl w-full py-4 rounded-lg transition hover:opacity-90 flex items-center justify-center gap-2"
          style={{ background: "#ff6b00", color: "#000" }}
        >
          Let's Play <ChevronRight size={22} strokeWidth={3} />
        </button>
        <p className="mono text-[10px] text-white/40 mt-4 text-center uppercase tracking-wider">
          Tip: you can revisit these rules anytime via the "?" button
        </p>
      </div>
    </div>
  );
}

// Helper to pull the correct value from the player for a given fact
function getCorrectValue(player, factKey) {
  if (factKey === "origin") {
    // International = country object; US = college string
    if (player.isInternational) {
      return { country: player.country, altCountries: player.altCountries };
    }
    return player.college;
  }
  return player[factKey];
}

// Helper to format the correct answer for display
function formatAnswer(correct, factKey) {
  if (factKey === "pick" && (correct === null || correct === undefined)) {
    return "Undrafted";
  }
  if (factKey === "origin" && typeof correct === "object" && correct !== null) {
    const all = [correct.country, ...(correct.altCountries || [])].filter(Boolean);
    if (all.length === 1) return all[0];
    return `${correct.country} (or ${correct.altCountries.join(" / ")})`;
  }
  return String(correct);
}

export default function App() {
  const [difficulty, setDifficulty] = useState("medium"); // "easy" | "medium" | "hard"
  const [playerIndex, setPlayerIndex] = useState(null);
  const [factIndex, setFactIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [roundResults, setRoundResults] = useState([]);
  const [usedPlayers, setUsedPlayers] = useState([]);
  const [showRoundSummary, setShowRoundSummary] = useState(false);
  const [attempted, setAttempted] = useState(false);

  // Game mode state
  const [playersCompleted, setPlayersCompleted] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true); // show on first load
  const [highScores, setHighScores] = useState({ easy: 0, medium: 0, hard: 0 });
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [perfectRoundEarned, setPerfectRoundEarned] = useState(false);
  // Cumulative stats across all 10 players (for category breakdown at end of game)
  const [gameStats, setGameStats] = useState({
    pick: { correct: 0, total: 0 },
    team: { correct: 0, total: 0 },
    origin: { correct: 0, total: 0 },
    year: { correct: 0, total: 0 },
    perfectRounds: 0,
  });
  const [shareCopied, setShareCopied] = useState(false);

  const player = playerIndex !== null ? PLAYERS[playerIndex] : null;
  const currentFact = FACTS[factIndex];
  const isBonusQuestion = currentFact?.bonus;

  // Load high scores from localStorage on mount
  // Note: using v2 key to wipe scores from the old scoring system (+20 streak bonus era)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hoopdraft_highscores_v2");
      if (saved) setHighScores(JSON.parse(saved));
    } catch (e) {
      // localStorage unavailable or parse error — ignore
    }
  }, []);

  // Save high scores whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("hoopdraft_highscores_v2", JSON.stringify(highScores));
    } catch (e) {
      // ignore
    }
  }, [highScores]);

  // Get the pool of player indices that match the current difficulty
  const difficultyPool = useMemo(() => {
    return PLAYERS.map((p, i) => ({ ...p, _idx: i })).filter((p) => {
      if (difficulty === "easy") return p.tier === "easy";
      if (difficulty === "medium") return p.tier === "easy" || p.tier === "medium";
      return true; // hard = all
    }).map((p) => p._idx);
  }, [difficulty]);

  const pickRandomPlayer = (excludeUsed = usedPlayers) => {
    let available = difficultyPool.filter((i) => !excludeUsed.includes(i));
    if (available.length === 0) {
      available = difficultyPool;
    }
    const next = available[Math.floor(Math.random() * available.length)];
    setPlayerIndex(next);
    setUsedPlayers((prev) => [...prev, next]);
    setFactIndex(0);
    setInput("");
    setFeedback(null);
    setRoundResults([]);
    setShowRoundSummary(false);
    setAttempted(false);
    setPerfectRoundEarned(false);
  };

  useEffect(() => {
    // initial pick on first mount only — after instructions close, game starts
    if (playerIndex === null && !showInstructions) {
      pickRandomPlayer();
    }
    // eslint-disable-next-line
  }, [showInstructions]);

  const handleSubmit = () => {
    if (!input.trim() || attempted) return;
    const correctValue = getCorrectValue(player, currentFact.key);
    const isCorrect = checkAnswer(input, correctValue, currentFact.key);
    setAttempted(true);

    let pointsEarned = 0;
    let newStreak = streak;
    let streakBroken = false;

    if (isCorrect) {
      pointsEarned = currentFact.points;
      // All 4 questions (including year) now advance the streak
      newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      setScore((s) => s + pointsEarned);
    } else {
      // All 4 questions (including year) now break the streak
      setStreak(0);
      streakBroken = true;
    }

    setRoundResults((prev) => [
      ...prev,
      {
        fact: currentFact.label,
        correct: isCorrect,
        userAnswer: input,
        actualAnswer: correctValue,
        pointsEarned,
        isBonus: isBonusQuestion,
      },
    ]);

    // Track per-category stats for end-of-game breakdown
    setGameStats((prev) => ({
      ...prev,
      [currentFact.key]: {
        correct: prev[currentFact.key].correct + (isCorrect ? 1 : 0),
        total: prev[currentFact.key].total + 1,
      },
    }));

    setFeedback({
      correct: isCorrect,
      answer: correctValue,
      pointsEarned,
      streakBroken,
      isBonus: isBonusQuestion,
    });
  };

  const handleNext = () => {
    if (factIndex < FACTS.length - 1) {
      setFactIndex(factIndex + 1);
      setInput("");
      setFeedback(null);
      setAttempted(false);
    } else {
      // End of round — check if all 4 questions were correct = perfect round bonus
      const allCorrect = roundResults.length === FACTS.length && roundResults.every((r) => r.correct);
      if (allCorrect) {
        setScore((s) => s + PERFECT_ROUND_BONUS);
        setPerfectRoundEarned(true);
        setGameStats((prev) => ({ ...prev, perfectRounds: prev.perfectRounds + 1 }));
      } else {
        setPerfectRoundEarned(false);
      }
      setShowRoundSummary(true);
    }
  };

  const handleNextPlayer = () => {
    const newCompleted = playersCompleted + 1;
    setPlayersCompleted(newCompleted);
    if (newCompleted >= GAME_LENGTH) {
      // Final score — calculate including this last round
      const finalScore = score;
      const currentHigh = highScores[difficulty] || 0;
      if (finalScore > currentHigh) {
        setHighScores((h) => ({ ...h, [difficulty]: finalScore }));
        setIsNewHighScore(true);
      } else {
        setIsNewHighScore(false);
      }
      setShowGameOver(true);
    } else {
      pickRandomPlayer();
    }
  };

  const handleSkip = () => {
    if (attempted) return;
    setAttempted(true);
    // All questions (including year) now break the streak if skipped
    setStreak(0);
    const correctValue = getCorrectValue(player, currentFact.key);
    setRoundResults((prev) => [
      ...prev,
      {
        fact: currentFact.label,
        correct: false,
        userAnswer: "(skipped)",
        actualAnswer: correctValue,
        pointsEarned: 0,
        isBonus: isBonusQuestion,
      },
    ]);
    // Track per-category stats — skipped counts as incorrect
    setGameStats((prev) => ({
      ...prev,
      [currentFact.key]: {
        correct: prev[currentFact.key].correct,
        total: prev[currentFact.key].total + 1,
      },
    }));
    setFeedback({
      correct: false,
      answer: correctValue,
      pointsEarned: 0,
      skipped: true,
      streakBroken: true,
      isBonus: isBonusQuestion,
    });
  };

  const startNewGame = () => {
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setUsedPlayers([]);
    setPlayersCompleted(0);
    setShowGameOver(false);
    setIsNewHighScore(false);
    setPerfectRoundEarned(false);
    setGameStats({
      pick: { correct: 0, total: 0 },
      team: { correct: 0, total: 0 },
      origin: { correct: 0, total: 0 },
      year: { correct: 0, total: 0 },
      perfectRounds: 0,
    });
    setShareCopied(false);
    // Pick from a fresh pool (empty exclusion list)
    pickRandomPlayer([]);
  };

  const handleReset = () => {
    startNewGame();
  };

  const handleDifficultyChange = (newDifficulty) => {
    if (newDifficulty === difficulty) return;
    setDifficulty(newDifficulty);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setUsedPlayers([]);
    setPlayersCompleted(0);
    setShowGameOver(false);
    setPerfectRoundEarned(false);
    setGameStats({
      pick: { correct: 0, total: 0 },
      team: { correct: 0, total: 0 },
      origin: { correct: 0, total: 0 },
      year: { correct: 0, total: 0 },
      perfectRounds: 0,
    });
    setShareCopied(false);
  };

  // When difficulty changes, pick a new player from the new pool (fresh exclusion list)
  useEffect(() => {
    if (playerIndex !== null && !showInstructions) {
      pickRandomPlayer([]);
    }
    // eslint-disable-next-line
  }, [difficulty]);

  // Generate and copy the shareable score text
  const handleShareScore = async () => {
    const factLabels = { pick: "Pick", team: "Team", origin: "College/Country", year: "Year" };
    const statsLines = ["pick", "team", "origin", "year"]
      .map((k) => `${factLabels[k]}: ${gameStats[k].correct}/${gameStats[k].total}`)
      .join(" · ");
    const shareText = `🏀 HoopDraft: ${score}/1000 (${difficulty[0].toUpperCase() + difficulty.slice(1)})
🎯 ${gameStats.perfectRounds} perfect rounds · 🔥 Best streak: ${bestStreak}
${statsLines}
Play at hoopdraft.org`;

    try {
      await navigator.clipboard.writeText(shareText);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (e) {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch (err) {
        // give up silently
      }
      document.body.removeChild(textarea);
    }
  };

  const roundTotalPoints = useMemo(
    () => roundResults.reduce((sum, r) => sum + r.pointsEarned, 0),
    [roundResults]
  );

  const correctCount = roundResults.filter((r) => r.correct).length;

  const getPlaceholder = () => {
    if (currentFact.key === "year") return "e.g. 2019";
    if (currentFact.key === "pick") return "e.g. 1, 14, or 'undrafted'";
    if (currentFact.key === "team") return "e.g. Lakers or Los Angeles Lakers";
    if (currentFact.key === "origin") {
      return player?.isInternational
        ? "Country (e.g. France, Spain, Serbia)"
        : "e.g. Duke, Kentucky";
    }
    return "";
  };

  // Dynamic label for the origin question based on player
  const getOriginLabel = () => {
    if (currentFact?.key !== "origin") return currentFact?.label;
    return player?.isInternational ? "Country" : "College";
  };

  if (showInstructions) {
    return <InstructionsModal onStart={() => setShowInstructions(false)} highScores={highScores} />;
  }

  if (!player) return null;

  return (
    <div className="w-full text-white relative" style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: "#0a0a0a",
      minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Archivo+Black&family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700;900&display=swap');

        .display-font { font-family: 'Archivo Black', 'Impact', sans-serif; letter-spacing: -0.02em; }
        .bebas { font-family: 'Bebas Neue', 'Impact', sans-serif; letter-spacing: 0.04em; }
        .mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-orange {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.7); }
          50% { box-shadow: 0 0 0 12px rgba(255, 107, 0, 0); }
        }
        .animate-slide-in { animation: slideIn 0.4s ease-out; }
        .pulse-orange { animation: pulse-orange 2s infinite; }
      `}</style>

      {/* Background decorative blurs */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #ff6b00 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #0066ff 0%, transparent 70%)" }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-8 md:py-12">
        {/* Header */}
        <header className="mb-6 md:mb-8 border-b-2 border-white/10 pb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-3 w-3 rounded-full pulse-orange" style={{ background: "#ff6b00" }} />
                <span className="mono text-xs text-white/60 uppercase tracking-widest">
                  Player {Math.min(playersCompleted + 1, GAME_LENGTH)} / {GAME_LENGTH}
                </span>
              </div>
              <h1 className="display-font text-4xl md:text-6xl leading-[0.9]">
                HOOP
                <span style={{ color: "#ff6b00" }}>DRAFT</span>
              </h1>
              <p className="mono text-xs text-white/50 mt-2 uppercase tracking-wider">
                Pick · Team · College/Country · Year
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center min-w-[90px]">
                <div className="mono text-[10px] text-white/50 uppercase tracking-wider">Score</div>
                <div className="bebas text-2xl text-white">{score}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center min-w-[90px]">
                <div className="mono text-[10px] text-white/50 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Flame size={10} /> Streak
                </div>
                <div className="bebas text-2xl" style={{ color: "#ff6b00" }}>{streak}</div>
              </div>
              <button
                onClick={() => setShowInstructions(true)}
                className="p-3 border border-white/10 rounded-lg hover:bg-white/5 transition"
                title="How to play"
              >
                <HelpCircle size={16} />
              </button>
              <button
                onClick={handleReset}
                className="p-3 border border-white/10 rounded-lg hover:bg-white/5 transition"
                title="Restart game"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Difficulty selector */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <div className="mono text-[10px] text-white/50 uppercase tracking-wider">Difficulty</div>
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
            {[
              { id: "easy", label: "Easy", desc: "Stars only" },
              { id: "medium", label: "Medium", desc: "Stars + starters" },
              { id: "hard", label: "Hard", desc: "All players" },
            ].map((d) => {
              const count =
                d.id === "easy"
                  ? PLAYERS.filter((p) => p.tier === "easy").length
                  : d.id === "medium"
                  ? PLAYERS.filter((p) => p.tier === "easy" || p.tier === "medium").length
                  : PLAYERS.length;
              const isActive = difficulty === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleDifficultyChange(d.id)}
                  className="bebas text-sm px-4 py-2 rounded transition"
                  style={
                    isActive
                      ? { background: "#ff6b00", color: "#000" }
                      : { color: "rgba(255,255,255,0.7)", background: "transparent" }
                  }
                  title={`${d.desc} · ${count} players`}
                >
                  {d.label}
                  <span className="mono text-[9px] ml-1.5 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="mono text-[10px] text-white/40 uppercase tracking-wider hidden sm:block">
            {difficulty === "easy" && "Superstars · household names"}
            {difficulty === "medium" && "Includes solid starters"}
            {difficulty === "hard" && "Deep cuts · role players"}
          </div>
        </div>

        {!showRoundSummary ? (
          <>
            <div
              key={playerIndex}
              className="animate-slide-in border border-white/10 rounded-2xl p-6 md:p-10 mb-6 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)" }}
            >
              <div
                className="absolute -right-8 -top-8 display-font text-[200px] md:text-[280px] leading-none text-white/[0.03] select-none pointer-events-none"
              >
                {String(factIndex + 1).padStart(2, "0")}
              </div>

              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="mono text-xs text-[#ff6b00] uppercase tracking-widest">
                    Player #{usedPlayers.length}
                  </div>
                  <div className="h-px flex-1 bg-white/10" />
                  <div className="mono text-xs text-white/50 uppercase tracking-widest">
                    Fact {factIndex + 1} / {FACTS.length}
                  </div>
                </div>

                <h2 className="display-font text-3xl md:text-5xl leading-tight mb-6">
                  {player.name}
                </h2>

                {/* Progress dots */}
                <div className="flex gap-2 mb-8">
                  {FACTS.map((f, i) => {
                    const result = roundResults[i];
                    let bg = "bg-white/10";
                    if (result?.correct) bg = "bg-[#22c55e]";
                    else if (result && !result.correct) bg = "bg-[#ef4444]";
                    else if (i === factIndex) bg = "bg-[#ff6b00]";
                    return (
                      <div key={f.key} className="flex-1">
                        <div className={`h-1.5 rounded-full transition-all ${bg}`} />
                        <div className="mono text-[10px] text-white/40 mt-1.5 uppercase truncate flex items-center gap-1">
                          {f.label}
                          {f.bonus && <Star size={8} className="text-[#ffb800] fill-[#ffb800]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bonus banner */}
                {isBonusQuestion && !feedback && (
                  <div className="mb-4 flex items-center gap-2 bg-[#ffb800]/10 border border-[#ffb800]/30 rounded-lg px-4 py-2">
                    <Star size={14} className="text-[#ffb800] fill-[#ffb800]" />
                    <span className="mono text-xs text-[#ffb800] uppercase tracking-wider">
                      Bonus round · Worth fewer points (+10)
                    </span>
                  </div>
                )}

                {/* Question */}
                <div className="mb-6">
                  <div className="mono text-xs text-white/50 uppercase tracking-widest mb-2">
                    What is the
                  </div>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="bebas text-4xl md:text-5xl text-white">
                      {getOriginLabel()}?
                    </h3>
                    <div className="mono text-sm" style={{ color: "#ff6b00" }}>
                      +{currentFact.points} pts
                    </div>
                  </div>
                </div>

                {/* Input */}
                {!feedback && (
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <input
                      type={currentFact.key === "year" ? "number" : "text"}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder={getPlaceholder()}
                      autoFocus
                      className="flex-1 bg-black/40 border-2 border-white/10 focus:border-[#ff6b00] rounded-lg px-5 py-4 text-lg outline-none transition font-medium"
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!input.trim()}
                      className="bebas text-xl px-8 py-4 rounded-lg transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ background: "#ff6b00", color: "#000" }}
                    >
                      Submit <ChevronRight size={20} strokeWidth={3} />
                    </button>
                    <button
                      onClick={handleSkip}
                      className="mono text-xs uppercase tracking-wider px-4 py-4 border border-white/10 rounded-lg hover:bg-white/5 transition"
                    >
                      Skip
                    </button>
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div
                    className={`animate-slide-in rounded-xl p-5 border-2 ${
                      feedback.correct
                        ? "bg-[#22c55e]/10 border-[#22c55e]/40"
                        : "bg-[#ef4444]/10 border-[#ef4444]/40"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          feedback.correct
                            ? "bg-[#22c55e]"
                            : "bg-[#ef4444]"
                        }`}
                      >
                        {feedback.correct ? (
                          <Check size={20} strokeWidth={3} className="text-black" />
                        ) : (
                          <X size={20} strokeWidth={3} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="bebas text-2xl">
                          {feedback.correct
                            ? "CORRECT!"
                            : feedback.skipped
                            ? "SKIPPED"
                            : "NOT QUITE"}
                        </div>
                        <div className="text-white/80 mt-1">
                          Answer: <span className="font-bold text-white">{formatAnswer(feedback.answer, currentFact.key)}</span>
                        </div>
                        {feedback.correct && feedback.pointsEarned > 0 && (
                          <div className="mono text-xs text-[#22c55e] mt-2 uppercase tracking-wider flex items-center gap-2 flex-wrap">
                            +{feedback.pointsEarned} points
                            {feedback.isBonus && (
                              <span className="bg-[#ffb800] text-black px-2 py-0.5 rounded flex items-center gap-1">
                                <Star size={10} strokeWidth={3} /> Bonus
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleNext}
                      className="bebas text-lg w-full mt-4 py-3 rounded-lg transition flex items-center justify-center gap-2 hover:opacity-90"
                      style={{ background: "#ffffff", color: "#000" }}
                    >
                      {factIndex < FACTS.length - 1 ? "Next Fact" : "See Round Results"}
                      <ChevronRight size={18} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="mono text-[10px] text-white/50 uppercase tracking-wider">Best Streak</div>
                <div className="bebas text-2xl flex items-center gap-2">
                  <Flame size={18} style={{ color: "#ff6b00" }} /> {bestStreak}
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="mono text-[10px] text-white/50 uppercase tracking-wider">High Score</div>
                <div className="bebas text-2xl">{highScores[difficulty] || 0}</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="mono text-[10px] text-white/50 uppercase tracking-wider">This Round</div>
                <div className="bebas text-2xl" style={{ color: "#ff6b00" }}>{correctCount} / {roundResults.length || FACTS.length}</div>
              </div>
            </div>
          </>
        ) : (
          /* Round Summary */
          <div
            className="animate-slide-in border border-white/10 rounded-2xl p-6 md:p-10"
            style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Trophy size={20} style={{ color: "#ff6b00" }} />
              <div className="mono text-xs uppercase tracking-widest" style={{ color: "#ff6b00" }}>
                Round {playersCompleted + 1} / {GAME_LENGTH}
              </div>
            </div>
            <h2 className="display-font text-3xl md:text-5xl mb-2">{player.name}</h2>
            <div className="mono text-sm text-white/60 mb-4">
              You earned <span style={{ color: "#ff6b00" }} className="font-bold">{roundTotalPoints + (perfectRoundEarned ? PERFECT_ROUND_BONUS : 0)}</span> points ·
              {" "}{correctCount} / {FACTS.length} correct
            </div>

            {perfectRoundEarned && (
              <div
                className="mb-6 p-4 rounded-xl border-2 flex items-center gap-3 animate-slide-in"
                style={{ background: "rgba(255, 107, 0, 0.1)", borderColor: "rgba(255, 107, 0, 0.4)" }}
              >
                <Trophy size={28} style={{ color: "#ff6b00" }} />
                <div>
                  <div className="bebas text-xl" style={{ color: "#ff6b00" }}>
                    Perfect Round! +{PERFECT_ROUND_BONUS}
                  </div>
                  <div className="mono text-xs text-white/60 uppercase tracking-wider">
                    All 4 questions correct
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2 mb-8">
              {roundResults.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    r.correct
                      ? "bg-[#22c55e]/5 border-[#22c55e]/30"
                      : "bg-[#ef4444]/5 border-[#ef4444]/20"
                  }`}
                >
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      r.correct ? "bg-[#22c55e]" : "bg-[#ef4444]"
                    }`}
                  >
                    {r.correct ? (
                      <Check size={16} strokeWidth={3} className="text-black" />
                    ) : (
                      <X size={16} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mono text-xs text-white/50 uppercase tracking-wider flex items-center gap-1">
                      {r.fact}
                      {r.isBonus && <Star size={10} className="text-[#ffb800] fill-[#ffb800]" />}
                    </div>
                    <div className="font-medium truncate">
                      {formatAnswer(r.actualAnswer, FACTS.find(f => f.label === r.fact)?.key)}
                    </div>
                    {!r.correct && (
                      <div className="text-xs text-white/50 truncate">
                        You said: {r.userAnswer}
                      </div>
                    )}
                  </div>
                  <div className="bebas text-lg shrink-0" style={{ color: "#ff6b00" }}>
                    {r.pointsEarned > 0 ? `+${r.pointsEarned}` : "—"}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNextPlayer}
              className="bebas text-xl w-full py-4 rounded-lg transition flex items-center justify-center gap-2 hover:opacity-90"
              style={{ background: "#ff6b00", color: "#000" }}
            >
              {playersCompleted + 1 >= GAME_LENGTH ? "See Final Score" : "Next Player"} <ChevronRight size={22} strokeWidth={3} />
            </button>
          </div>
        )}

        <footer className="mt-8 text-center mono text-[10px] text-white/30 uppercase tracking-widest">
          {PLAYERS.length} players total · {difficultyPool.length} in current difficulty
        </footer>
      </div>

      {/* Game Over Modal */}
      {showGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: "rgba(0,0,0,0.85)" }}>
          <div
            className="animate-slide-in max-w-lg w-full border border-white/10 rounded-2xl p-6 md:p-8 my-auto"
            style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)" }}
          >
            <div className="text-center">
              <Trophy size={40} className="mx-auto mb-3" style={{ color: "#ff6b00" }} />
              <div className="mono text-xs text-white/60 uppercase tracking-widest mb-2">
                Game Over
              </div>
              <h2 className="display-font text-4xl md:text-5xl mb-2">
                {score} / 1000
              </h2>
              {isNewHighScore && (
                <div className="mb-3 inline-block px-4 py-1.5 rounded-full mono text-xs uppercase tracking-wider" style={{ background: "#ff6b00", color: "#000" }}>
                  🎉 New High Score!
                </div>
              )}
              <div className="mono text-sm text-white/60 mb-6">
                {difficulty.toUpperCase()} · {gameStats.perfectRounds} perfect rounds · Best streak: {bestStreak}
              </div>
            </div>

            {/* Category breakdown */}
            <div className="mb-6">
              <div className="mono text-xs text-white/50 uppercase tracking-wider mb-2">
                Category Breakdown
              </div>
              <div className="space-y-2">
                {[
                  { key: "pick", label: "Pick Number" },
                  { key: "team", label: "First NBA Team" },
                  { key: "origin", label: "College / Country" },
                  { key: "year", label: "Draft Year" },
                ].map(({ key, label }) => {
                  const stat = gameStats[key];
                  const pct = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
                  let barColor = "#ef4444";
                  if (pct >= 80) barColor = "#22c55e";
                  else if (pct >= 50) barColor = "#ffb800";
                  return (
                    <div key={key} className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="text-sm font-medium">{label}</div>
                        <div className="mono text-sm text-white/80">
                          {stat.correct} / {stat.total}
                        </div>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: barColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* High scores strip */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {["easy", "medium", "hard"].map((d) => (
                <div key={d} className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                  <div className="mono text-[10px] text-white/50 uppercase">{d} best</div>
                  <div className="bebas text-xl" style={{ color: d === difficulty ? "#ff6b00" : "#fff" }}>
                    {highScores[d] || 0}
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleShareScore}
                className="bebas text-lg flex-1 py-3 rounded-lg transition flex items-center justify-center gap-2 border border-white/20 hover:bg-white/5"
                style={{ color: "#fff" }}
              >
                {shareCopied ? (
                  <><Check size={18} strokeWidth={3} /> Copied!</>
                ) : (
                  <><Share2 size={18} strokeWidth={2.5} /> Share Score</>
                )}
              </button>
              <button
                onClick={startNewGame}
                className="bebas text-lg flex-1 py-3 rounded-lg transition flex items-center justify-center gap-2 hover:opacity-90"
                style={{ background: "#ff6b00", color: "#000" }}
              >
                Play Again <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
