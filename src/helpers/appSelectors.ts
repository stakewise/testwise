const appSelectors = {
  header: {
    headerMenuButton: 'tid=header-menu-button',
    headerText: 'tid=header-text',
    headerTextHelp: 'tid=header-text-help',
    headerConnectWalletButton: 'tid="connect button"',
    headerNetworkNameButton: 'tid=header-network-name',
    headerChangeNetworkEthereum: 'tid=Ethereum',
    headerChangeNetworkGnosis: 'tid=Gnosis',
    headerChangeNetworkHarbour: 'tid="Harbour ETH"',
    headerSwiseBalance: 'tid=header-swise-balance',
    headerTokenBalance: 'tid=header-token-balance',
    headerAddress: 'tid=header-address',
    connectWalletDropdownMetaMaskItem: 'tid="connect link: MetaMask"',
    headerSettingsButton: 'tid=header-settings-button',
    settingsDropdownDisconectItem: 'tid="header settings menu link: Disconnect"',
  },
  tooltip: '[class*=Tooltip_visible]',
  closeModalButton: '[class^=Modal_closeButton]',
  widgets: {
    main: {
      root: 'tid=main-widget',
      stake: {
        tab: 'tid=main-staking-tab',
        input: 'tid=stake-amount-input',
        inputValidation: 'tid=stake-amount-input-validation',
        // TODO add tid to icon
        tooltipIcon: '[data-testid=stake-received-amount] + div',
        termsCheckbox: 'tid=stake-terms-checkbox',
        confirmButton: 'tid=stake-confirm-button',
        maxButton: 'tid=stake-amount-max-button',
      },
      reinvest: {
        tab: 'tid=main-reinvest-tab',
        input: 'tid=reinvest-amount-input',
        inputValidation: 'tid=reinvest-amount-input-validation',
        receiveAmount: 'tid=reinvest-you-receive-amount',
        // TODO add tid to icon
        tooltipIcon: '[data-testid=reinvest-you-receive-amount] + div',
        termsCheckbox: 'tid=reinvest-terms-checkbox',
        confirmButton: 'tid=reinvest-confirm-button',
        maxButton: 'tid=reinvest-amount-max-button',
      },
      withdraw: {
        tab: 'tid=main-withdraw-tab',
      },
    },
    apr: {
      value: 'tid=apr-value',
      help: 'tid=apr-value-help',
      helpTooltip: 'tid=tooltips > div:first-child',
      description: 'tid=apr-description',
    },
    rewards: {
      root: 'tid=rewards-widget',
      header: 'tid=rewards-header',
      amount: 'tid=rewards-amount',
      amountFiat: 'tid=rewards-amount-fiat',
      description: 'tid=rewards-description]',
    },
    staking: {
      root: 'tid=apr-widget',
      amount: 'tid=staking-amount',
    },
  },
  mainPage: {
    card: {
      loading: '[class*=CardWithIcon_loading]',
    },
  },
  metaMaskPage: {
    primaryButton: '[class*=btn-primary]',
    settings: {
      resetAccount: '[class*=btn-warning]',
      resetButton: '[class*=btn-danger-primary]',
    },
    confirm: {
      gasValue: 'xpath=//strong[text()="Max fee:"]/..//span[@class="currency-display-component__text"]',
      maxAmountValue: 'xpath=//strong[text()="Max amount:"]/..//span[@class="currency-display-component__text"]',
      confirmButton: 'tid=page-container-footer-next'
    },
    sign: {
      signButton: '[class*=btn-primary]',
      cancelButton: '[class*=btn-secondary]',
      scrollButton: 'tid=signature-request-scroll-buttony',
    },
    giveAccess: {
      confirmButton: 'tid=page-container-footer-next',
      rejectButton: 'tid=page-container-footer-cancel',
      shortAddressForApproval: '[class*=confirm-approve-content__address-display-content]',
    },
    unlock: {
      passwordInput: 'input[type="password"]',
      unlockButton: 'text=Unlock',
    },
    approveConnect: {
      selectAllAccountsCheckbox: 'div.choose-account-list__select-all > input',
      nextButton: 'text=Next',
      confirmButton: 'tid=page-container-footer-next',
    },
    changeNetwork: {
      approveButton: 'text=Approve',
      switchNetworkButton: 'text=Switch network',
    },
    changeAccount: {
      hardHat: 'text=HardHat',
      accountButton: 'div[class^=account-menu__icon]',
      networkDisplay: 'div[class^=network-display]',
    },
  },
  bottomLoader: '[class^=BottomLoader]',
  // TODO add notification tid and tests for closing
  notification: '[class^=Notification_notification]',
  notificationCloseButton: 'xpath=//div[contains(@class, "Notification_notification")]/../div//button',
}


export default appSelectors
