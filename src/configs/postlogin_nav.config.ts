
import { INavData } from '@coreui/angular';

export const postLoginNavItems: INavData[] = [


    {
        name: 'Game Zone',
        url: '/account',
        icon: 'icon-deezer',
        children: [
            {
                name: 'Treasure Hunt',
                url: '/user/gamezone',
                icon: 'icon-graph'
            },
            {
                name: 'Share',
                url: '/user/share',
                icon: 'icon-tag'
            },
            {
                name: 'Leaderboard',
                url: '/user/lboard',
                icon: 'icon-chart'
            }
        ]
    },
  

];