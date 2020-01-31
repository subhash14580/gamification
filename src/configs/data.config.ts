export const dataConf = {
    "playersListColGroups": [
        {
            referrerLogin: "referrer"
        },
        {
            playerId: "Short ID",
            nickName: "Username (Nickname)",
            email: "E-mail",
            fullName: "Full Name"

        },
        {
            balance: "Balance (Bonus)",
            Deposits: "deposits",
            withdrawals: "Withdrawals",
            transferTo: "Transfers to",
            transferFrom: "Transfers From",
            showKeyInUI: true
        },
        {
            bet: "GamesBets",
            payout: "Buy-InPayouts",
            proceeds: "Proceeds",
            showKeyInUI: true
        },
        {
            Address: "address", City: "city"
            , State: "state", Country: "country"
            , Phone: "phone"
            , Language: "lang"
        },
        {
            "Signup Date Last Visit": "signupDate"
        }

    ],
    "playersRevenueColGroups": [

        { referrerLogin: "Referrer" },
        {
            loginName: "Username",
            email: "E-mail",
            fullName: "Full Name"
        },

        { balance: "Balance" },

        { Revenue: "revenue" },
        { lastVisit: "Last Visit" }
    ],
    "agentsListColGroups": [

        { referrerLogin: "Referrer" },
        {
            loginName: "Username",
            email: "E-mail",
            fullName: "Full Name"
        },

        { balance: "Balance" },

        { Revenue: "revenue" },
        { lastVisit: "Last Visit" }

    ],
    "refTreeColGroups": [
        { loginName: "Username" },
        {
            fullName: "Full Name"
        },
        {
            referredPlayers: "Referred Players"
        },
        {
            referredAgents: "Referred Agents"
        }
    ],
    agentsRevenueColGroups: [
        { referrerLogin: "Referrer" },
        {
            loginName: "Username",
            email: "E-mail",
            fullName: "Full Name"
        },

        { balance: "Balance" },

        { Revenue: "revenue" },
        { lastVisit: "Last Visit" }
    ]
    ,
    "agentsRevenueGroupByOps": [
        { text: "Game Sessions", value: "SESSIONS" },
        { text: "Players", value: "SUBUSERS" }

    ],
    "supportmail": "Support@ikkaa.in",
    transactheaders: [["initiator", "operationDate", "operationType", "cashAmount", "bonusAmount", "tournamentMoneyAmount", "ticketAmount"],
    ["wallet", "cash", "bonus"]],
    statisticsDataKeys: [
        { key: "uniqueHits", text: "Unique Hits", val: "", isRouteEnabled: false },
        { key: "referredPlayers", text: "Referred Players", val: "", isRouteEnabled: false },
        { key: "referredWebmasters", text: "Referred Affiliates", val: "", isRouteEnabled: false },
        { key: "revenueFromPlayers", text: "Revenue From Players", val: "", isRouteEnabled: true, path: "/user/campaigns" },
        { key: "chargeBacks", text: "Chargeback’s", val: "", isRouteEnabled: true, path: '/user/chargebacks' },
        { key: "revenueFromWebmaster", text: "Revenue from Affiliates", val: "",isRouteEnabled: false  },
        { key: "revenueAdjustments", text: "Revenue Adjustments", val: "" ,isRouteEnabled: false },
        { key: "cancelledAmount", text: "Cancelled Payments", val: "", isRouteEnabled: true, path: '/user/cancelledpayments' },
        { key: "totalRevenue", text: "Total Revenue", val: "",isRouteEnabled: false  },
    ]

}


