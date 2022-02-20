import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/global.scss';

import App from './app';
import dTree from './helper/dtree';

const j = [
  {
    name: 'Niclas Superlongsurname',
    class: 'man',
    textClass: 'emphasis',
    marriages: [
      {
        spouse: {
          name: 'Iliana',
          class: 'woman',
          extra: {
            nickname: 'Illi',
          },
        },
        children: [
          {
            name: 'James',
            class: 'man',
            marriages: [
              {
                spouse: {
                  name: 'Alexandra',
                  class: 'woman',
                },
                children: [
                  {
                    name: 'Eric',
                    class: 'man',
                    marriages: [
                      {
                        spouse: {
                          name: 'Eva',
                          class: 'woman',
                        },
                      },
                    ],
                  },
                  {
                    name: 'Jane',
                    class: 'woman',
                  },
                  {
                    name: 'Jasper',
                    class: 'man',
                  },
                  {
                    name: 'Emma',
                    class: 'woman',
                  },
                  {
                    name: 'Julia',
                    class: 'woman',
                  },
                  {
                    name: 'Jessica',
                    class: 'woman',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

dTree.init(j, {
  target: '#root',
  debug: true,
  hideMarriageNodes: true,
  marriageNodeSize: 5,
  height: 800,
  width: 1200,
  callbacks: {
    // nodeClick: function (name, extra) {
    //   alert('Click: ' + name);
    // },
    // nodeRightClick: function (name, extra) {
    //   alert('Right-click: ' + name);
    // },
    // textRenderer: function (name, extra, textClass) {
    //   if (extra && extra.nickname) name = name + ' (' + extra.nickname + ')';
    //   return "<p align='center' class='" + textClass + "'>" + name + '</p>';
    // },
    // marriageClick: function (extra, id) {
    //   alert('Clicked marriage node' + id);
    // },
    // marriageRightClick: function (extra, id) {
    //   alert('Right-clicked marriage node' + id);
    // },
  },
});
