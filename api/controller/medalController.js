'use strict';

const MEDALS = [
  {
    id: 1,
    athlete: {
      id: 200,
      name: 'Coincoin'
    },
    epreuve: {
      id: 1001,
      name: '100m'
    }
  },
  {
    id: 1,
    athlete: {
      id: 200,
      name: 'Bouché'
    },
    epreuve: {
      id: 1001,
      name: 'Saut à la perche'
    }
  },
];

exports.read = function(req, res) {
  // TODO recherche dans la base
  res.json(MEDALS[0]);
};

exports.search = function(req, res) {
  // TODO recherche dans la base
  res.json(MEDALS);
};
