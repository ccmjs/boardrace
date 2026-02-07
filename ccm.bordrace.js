"use strict";

/**
 * @overview <i>ccm</i>-based web component for a racing board game.
 * @author André Kless <andre.kless@web.de> 2025
 * @license The MIT License (MIT)
 */

ccm.files["ccm.boardrace.js"] = {
  name: "boardrace",
  ccm: "././libs/ccm/ccm.js",
  config: {
    "boards": ["ccm.load", {"type": "module", "url": "././resources/resources.js#boards"}],
    "css": ["ccm.load", "././resources/styles.css"],
    "data": {"store": ["ccm.store"]},
    /*
    "lang": ["ccm.start", "././libs/lang/ccm.lang.js", {
      "translations": {
        "de": ["ccm.load", {"url": "././resources/resources.js#de", "type": "module"}],
        "en": ["ccm.load", {"url": "././resources/resources.js#en", "type": "module"}],
      }
    }],
     */
    "helper": ["ccm.load", {"url": "././libs/ccm/helper.js", "type": "module"}],
    "html": ["ccm.load", "././resources/templates.html"],
    "path": "././resources/images/",
    "size": 71,
    "text": ["ccm.load", {"url": "././resources/resources.js#de", "type": "module"}],
  },
  Instance: function () {

    /**
     * shortcut to help functions
     * @type {Object.<string,Function>}
     */
    let $;

    /**
     * game data
     * @type {Object}
     */
    let game;

    this.init = async () => {};

    this.ready = async () => {

      // set shortcut to help functions
      $ = Object.assign({}, this.ccm.helper, this.helper);
      $.use(this.ccm);

    };

    /**
     * starts the app
     * @returns {Promise<void>}
     */
    this.start = async () => {

      // load game state data
      game = await $.dataset(this.data);

      // no board? => choose board
      if (!game.board) return this.render.chooseBoard();

    };

    /**
     * contains all render functions
     * @type {Object.<string,Function>}
     */
    this.render = {

      /** lets the user choose a board */
      chooseBoard: () => {

        // renders HTML template for selecting boards
        $.setContent(this.element, $.html(this.html.choose_racetrack));

        // select the (empty) webpage area that contains the boards
        const div_boards = this.element.querySelector("#boards");

        // render each board in that webpage area
        this.boards.forEach(({name, fields}, i) => {

          // create webpage area for the board
          const div_board = $.html(this.html.board, {
            name,
            width: fields[0].length,
            height: fields.length,
            size: this.size / 2
          });

          // append the webpage area  to the webpage area that contains all boards
          $.append(div_boards, div_board);

          // render each field of the board
          for (let i = 0; i < fields.length; i++) {
            for (let j = 0; j < fields[i].length; j++) {
              $.append(div_board, $.html(this.html.field, {
                path: this.path,
                id: fields[i][j].id
              }));
            }
          }

          // set click event for the board
          div_board.querySelector(".board").addEventListener('click', () => this.events.onSelectedBoard(i + 1));
        });

        /*
        this.racetracks.forEach((racetrack, i) =>
            render.objects(this.element.querySelectorAll('.board')[i], racetrack.objects, racetrack.board[0].length)
        );
         */
      }

    };

    /**
     * contains all event handlers
     * @type {Object.<string,Function>}
     */
    this.events = {

      /**
       * when a racetrack has been selected
       * @param {number} nr - racetrack number
       * @returns {Promise<void>}
       */
      onSelectedRacetrack: async nr => {
        console.log(nr);
        return;
        Object.assign(game, {
          racetrack: nr,
          objects: $.clone(this.racetracks[nr - 1].objects)
        });
        helper.findFields(nr, 'POWER').forEach(field => game.objects.push({
          type: "ECUBE",
          x: field.x,
          y: field.y,
          width: this.size / 5,
          height: this.size / 5
        }));
        await helper.save();
        console.log('Die ' + nr + '. Rennstrecke wurde ausgewählt.');
        await play();
      },

      /**
       * when a robot has been selected
       * @param {string} robot_id - ID of the selected robot
       * @returns {Promise<void>}
       */
      onSelectedRobot: async robot_id => {
        const robot = robot_id;
        if (!game.master) game.master = robot;
        const player = game.robots[robot] = {deck: [], energy: 5};
        for (const id in this.cards)
          for (let i = 0; i < this.cards[id].amount; i++)
            player.deck.push(this.cards[id].id);
        $.shuffleArray(player.deck);
        await helper.save();
        console.log(helper.getRobotName() + ' wurde als Roboter ausgewählt.');
        await play();
      }

    };
  }
};
