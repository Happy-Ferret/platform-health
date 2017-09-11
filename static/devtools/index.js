/* global fetch */
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Perfherder from './perfherder';

export default class DevToolsIndex extends React.Component {
  constructor(props) {
    super(props);
    document.body.classList.add('multipage');
    this.setState({});
  }

  render() {
    const reference = '2017-01-01';
    const sections = [
      {
        title: 'DAMP',
        rows: [
          [
            <Perfherder
              title='summary opt e10s'
              reference={reference}
              signatures={{
                'win7-32': '63c652b34bd8fcf3623be048bdd3104906f70f02',
                'win10-64': 'f687ee347bcbdc55828148af029908049de69b7f',
              }}
            />,
            <Perfherder
              title='summary PGO opt e10s'
              reference={reference}
              signatures={{
                'win7-32': '1f8aed46624975327d00a6b936cee2c09768ef5d',
                'win10-64': '13c388cdad11d118a5a625eade2131fa723cc71b',
              }}
            />,
          ],
        ],
      },
      {
        title: 'inspector.open',
        rows: [
          [
            <Perfherder
              title='complicated.inspector.open e10s'
              reference={reference}
              signatures={{
                'win7-32-pgo': '397892cd2f93cdcc4ab0d0c584676ccbd760b605',
                'win7-31-opt': 'd15b5a9ae62647bae61f716e3e9fcff5a36c829b',
                'win10-64-pgo': '70471460298efd01669294e266aa622523fb93e1',
                'win10-64-opt': '273365b480ae7add565868732d2518982467bd82',
              }}
            />,
            <Perfherder
              title='simple.inspector.open e10s'
              reference={reference}
              signatures={{
                'win7-32-pgo': 'ac1f6a879b267bb92914f3c9e7d4bb5f713ed858',
                'win7-31-opt': '3f3f14d75586dc2708c4e41dd6f7dc1a96fc7c66',
                'win10-64-pgo': '18357f31a9a38476a54eaf17f1b03cf3deacc0e5',
                'win10-64-opt': 'd90e63169b0e296070ff32f46392e6857f1afc4b',
              }}
            />,
          ],
          [
            <Perfherder
              title='complicated.inspector.reload e10s'
              reference={reference}
              signatures={{
                'win7-32-pgo': '46b4bd02cf21eb74cd1da274b33c08b35f5beb6a',
                'win7-31-opt': '356d4c1e50084e137dfc11b79f91155b02f3cada',
              }}
            />,
            <Perfherder
              title='simple.inspector.reload e10s'
              reference={reference}
              signatures={{
                'win7-32-pgo': 'd52e39dbcba3173a7e06816cb45f9d440a5a7232',
                'win7-31-opt': '2cf85d1cb9e22886cddc0d91483198e893d1a76d',
              }}
            />,
          ],
          [
            <Perfherder
              title='complicated.inspector.close e10s'
              reference={reference}
              signatures={{
                'win7-32-pgo': '1f8645474562b86c69ada65fb9d6636cd5c43459',
                'win7-31-opt': '9c564b2d1af49ad501660164814dc524328a5a5f',
              }}
            />,
            <Perfherder
              title='simple.inspector.close e10s'
              reference={reference}
              signatures={{
                'win7-32-pgo': '1b033f06f2521fa3f6929501ead3c938f44bc8a2',
                'win7-31-opt': '1ba25eba53bccdc26a5384ccc18ffdaf46457d21',
              }}
            />,
          ],
        ],
      },
      {
        title: 'console.open',
        rows: [
          [
            <Perfherder
              title='complicated.console.open e10s'
              reference={reference}
              signatures={{
                'win7-32-pgo': 'a4dbd2d7d21ce4311c73bb8864620a7154617676',
                'win7-31-opt': '0387b9e9be2033aedb2811277a29431cf678b7b9',
                'win10-64-pgo': '0307e41a1738b0a529697fb7cc6cf94a444a3585',
                'win10-64-opt': '43fedfb5eae2cd6f15afe74be8a49ab29a8afddc',
              }}
            />,
            <Perfherder
              title='simple.console.open e10s'
              reference={reference}
              signatures={{
                'win7-32-pgo': 'dc70b98133966f7ca277b3cc75a9c0b0422f6b2c',
                'win7-31-opt': '8ab2ee0da3b4645b04ea535d51256048ae519cdb',
                'win10-64-pgo': '80d1781a4d6c9103ac960c9ba254281b5ea4caad',
                'win10-64-opt': '7cebaa844224a366c73bf8afb979175bc068226f',
              }}
            />,
          ],
        ],
      },
      {
        title: 'debugger.open',
        rows: [
          [
            <Perfherder
              title='complicated.debugger.open e10s'
              reference={reference}
              signatures={{
                'win7-32-pgo': '8e0df6dec383b41a37e00a91b861e3cdf6bca4aa',
                'win7-31-opt': '2a680a94d9d4e71e4338fa8714945d408535796c',
              }}
            />,
            <Perfherder
              title='simple.debugger.open e10s'
              reference={reference}
              signatures={{
                'win7-32-pgo': '449940cfd3d979893287e1503171a14fbb5a63c0',
                'win7-31-opt': 'e869bb90a6bbfd7d941c0d5c819d16b8a238149e',
              }}
            />,
          ],
        ],
      },
    ];

    let rowIdx = 0;
    const $content = sections.reduce((reduced, { title, rows }) => {
      const add = [];
      for (const widgets of rows) {
        rowIdx += 1;
        add.push(
          <div className='row' key={`row-${rowIdx}`}>
            {widgets}
          </div>,
        );
      }
      if (title) {
        add.unshift(
          <h2>
            <span>
              {title}
            </span>
          </h2>,
        );
      }
      return reduced.concat(add);
    }, []);

    document.body.classList.remove('summary-fullscreen');

    const title = 'DevTools';
    const subtitle = 'Tracking performances';
    const $dashboard = (
      <div className={cx('summary')}>
        <div className='dashboard-title'>
          <h1>
            {title}
            <small>{subtitle}</small>
          </h1>
        </div>
        <div className='dashboard-main'>
          {$content}
        </div>
      </div>
    );

    return $dashboard;
  }
}

DevToolsIndex.propTypes = {
  location: PropTypes.object,
};
