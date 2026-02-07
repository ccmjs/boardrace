/**
 * @overview Data-based resources of ccmjs-based web component for a racing board game.
 * @author André Kless <andre.kless@web.de> 2025
 * @license The MIT License (MIT)
 */

/**
 * English texts and labels for a racing board game.
 * @type {Object.<string,string>}
 */
export const en = {};

/**
 * German texts and labels for a racing board game.
 * @type {Object.<string,string>}
 */
export const de = {};

/**
 * Boards data.
 */
export const boards = [
  {
    "name": "USA",
    "fields": [
        [1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1]
    ],
    "curves": [2,5,8],
    "rounds": 2,
  },
];
