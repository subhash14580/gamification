
import { INavData } from '@coreui/angular';

export const postLoginNavItems: INavData[] = [


    {
        name: 'Statistics',
        url: '/account',
        icon: 'icon-deezer',
        children: [
            {
                name: 'Summary',
                url: '/user/statistics',
                icon: 'icon-graph'
            },
            {
                name: 'Campaigns',
                url: '/user/campaigns',
                icon: 'icon-pencil'
            },
            {
                name: 'Payments',
                url: '/user/payments',
                icon: 'icon-chart'
            },
            {
                name: 'Revenue Adjustments',
                url: '/user/revenueadjustments',
                icon: 'icon-chart'
            },
            {
                name: 'Cancelled Payments',
                url: '/user/cancelledpayments',
                icon: 'icon-chart'
            },
            {
                name: 'Chargeback’s',
                url: '/user/chargebacks',
                icon: 'icon-chart'
            }
        ]
    },
    {
        name: 'Link codes',
        url: '/user/linkcodes',
        icon: 'icon-link'
    },
    {
        name: 'Referral codes',
        url: '/user/referralcodes',
        icon: 'icon-tag'
    },
    {
        name: 'Banners',
        url: '/user/banners',
        icon: 'icon-tag'
    },
    {
        name: 'Campaigns list',
        url: '/user/campaignslist',
        icon: 'icon-list'
    },
    {
        name: 'My Info',
        url: '/user/profile',
        icon: 'icon-user'
    }




];