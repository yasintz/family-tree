import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import style from './Tree.module.scss';

function useTree(el: any, setSize: any, deps: any[]) {
  useEffect(() => {
    const element = (
      <div>
        <ul>
          <li>
            <div className="tree-wrapper">
              <div className="female">Parent</div>
            </div>
            {el}
          </li>
        </ul>
      </div>
    );

    const str = ReactDOMServer.renderToString(element);
    const domItem = document.createElement('div');
    domItem.classList.add(style.sizeWrapper, 'tree');
    domItem.innerHTML = str;
    document.body.appendChild(domItem);

    const div = domItem.children[0];

    const ul = div.children[0];
    const li = ul.children[0];

    const width = div.clientWidth + 50;
    const height = li.clientHeight + 50;

    setSize({ width, height });

    document.body.removeChild(domItem);
    // eslint-disable-next-line
  }, deps);
}

export default useTree;
