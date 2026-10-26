// Errors / Empty / Help states — PIDGIN FIRST
  errors: {
    network: 'Network no dey. Check your connection.',
    offline: 'You dey offline. Dial *901# for banking.',
    server: 'Something go wrong. Try again.',
    unauthorized: 'Session don expire. Sign in again.',
    notFound: 'We no fit find am.',
    validation: 'Check your entries and try again.',
  },

  // Form validation — Pidgin + English
  validation: {
    required: 'This field dey required.',
    email: 'Enter valid email (e.g. you@example.com).',
    phone: 'Enter valid Nigerian phone number.',
    passwordMin: 'Password too short. Minimum 8 characters.',
    passwordMatch: 'Passwords no match.',
    usernameTaken: 'Username don dey taken. Try another.',
    usernameFormat: 'Username must be 3-20 characters. Letters, numbers, underscore only.',
    amountMin: 'Amount too small. Minimum ₦100.',
    amountMax: 'Amount too large. Maximum ₦1,000,000.',
    insufficientFunds: 'Money no reach. Add cash or try smaller amount.',
    dailyLimit: 'Daily limit reached. Try tomorrow or increase limit.',
    invalidOtp: 'Invalid code. Try again.',
    expiredOtp: 'Code don expire. Request new one.',
  },

  // Success / Confirmation
  success: {
    registered: 'Account created! Welcome to Kamba.',
    loggedIn: 'Welcome back!',
    transferSent: 'Money don go. Receipt sent.',
    airtimeBought: 'Airtime delivered. Check your phone.',
    billPaid: 'Bill paid successfully.',
    savingsStarted: 'Auto-save activated. Your money go grow.',
    referralSent: 'Invitation sent via WhatsApp!',
    linkCopied: 'Link copied to clipboard.',
    settingsSaved: 'Changes saved.',
    logout: 'You don log out. See you soon!',
  },

  // USSD Fallback banner
  ussd: {
    banner: 'Offline? Dial *901# for banking',
    actionSpecific: {
      airtime: 'Offline? Dial *901*1*Amount*Phone#',
      sendMoney: 'Offline? Dial *901*2*Amount*Account#',
      balance: 'Offline? Dial *901*00#',
      agent: 'Offline? Dial *901*3#',
    },
  },

  // Generic UI
  ui: {
    loading: 'Loading...',
    retry: 'Try again',
    continue: 'Continue',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    share: 'Share',
    copy: 'Copy',
    done: 'Done',
    next: 'Next',
    back: 'Back',
    skip: 'Skip',
    close: 'Close',
    okay: 'Okay',
    yes: 'Yes',
    no: 'No',
  },
};

export default pidginCopy;
// Transactions
  transactions: {
    tabs: { all: 'All', sent: 'Sent', received: 'Received', airtime: 'Airtime', bills: 'Bills' },
    pullToRefresh: 'Pull to refresh',
    loading: 'Loading transactions...',
    empty: {
      all: 'No transactions yet',
      sent: 'You never send money',
      received: 'No money don enter',
      airtime: 'No airtime purchases',
      bills: 'No bill payments',
    },
    swipeActions: {
      shareReceipt: 'Share receipt',
      viewDetails: 'View details',
    },
    filter: {
      title: 'Filter transactions',
      dateRange: 'Date range',
      amountRange: 'Amount range',
      category: 'Category',
      apply: 'Apply filters',
      clear: 'Clear all',
    },
    status: {
      success: 'Successful',
      failed: 'Failed',
      pending: 'Pending',
      reversed: 'Reversed',
    },
  },

  // Discover
  discover: {
    searchPlaceholder: 'Search merchants, categories...',
    categories: ['Food', 'Transport', 'Shopping', 'Utilities', 'More'],
    nearby: 'Nearby Merchants',
    within: 'Within 2km',
    featured: 'Featured',
    mapView: 'Map',
    listView: 'List',
  },

  // Activity / Notifications
  activity: {
    groups: { today: 'Today', yesterday: 'Yesterday', thisWeek: 'This Week', older: 'Older' },
    empty: 'All caught up. No new updates.',
    swipeActions: { markRead: 'Mark read', delete: 'Delete' },
    types: {
      transaction: 'Transaction alert',
      promo: 'Promo',
      system: 'System update',
    },
  },

  // Account / Profile
  account: {
    kycVerified: 'KYC: Verified',
    kycPending: 'KYC: Pending',
    balanceSummary: 'Total Balance',
    sections: {
      wallet: 'Wallet',
      savings: 'Savings',
      referrals: 'Referrals',
      security: 'Security',
      support: 'Support',
      legal: 'Legal',
    },
    wallet: {
      addCash: 'Add Cash',
      withdraw: 'Withdraw',
      limits: 'Transaction Limits',
    },
    savings: {
      autoSave: 'Auto-save',
      safeLock: 'SafeLock',
      interestEarned: 'Interest Earned',
    },
    referrals: {
      title: 'Share ₦500, get ₦500',
      whatsappShare: 'Share on WhatsApp',
      copyLink: 'Copy link',
      stats: { invited: 'Invited', earned: 'Earned' },
    },
    security: {
      pin: 'PIN',
      biometric: 'Biometric',
      devices: 'Login Devices',
      twoFA: '2FA',
    },
    support: {
      whatsapp: 'Chat on WhatsApp',
      email: 'Email us',
      faq: 'FAQ',
    },
    legal: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      licenses: 'Licenses',
    },
    logout: 'Log out',
  },
};
// utils/pidginCopy.js — Nigerian Pidgin microcopy for trust & clarity
// "Money no reach. Add cash or try smaller amount" not "Insufficient funds"

export const pidginCopy = {
  // Auth / Onboarding
  auth: {
    welcome: 'Welcome to Kamba. Where your money dey safe.',
    createAccount: 'Open your account in 2 minutes. No wahala.',
    emailHint: 'We go only send you important updates. No spam.',
    usernameHint: 'Your @handle for referrals. Make am unique.',
    passwordHint: 'Use 8+ characters. Mix letters, numbers, symbols.',
    referralHint: 'Get ₦500 when your friend joins. Them get ₦500 too.',
    termsPrefix: 'By continuing, you agree to our',
    termsLink: 'Terms',
    privacyLink: 'Privacy Policy',
    alreadyHaveAccount: 'Don get account? Sign in',
    noAccount: 'No get account? Create one',
    forgotPassword: 'Forgot password?',
    resetPassword: 'We go send reset link to your email.',
  },

  // Home / Balance
  home: {
    availableBalance: 'Available Balance',
    protected: 'Protected by NDIC',
    hideBalance: 'Hide balance',
    showBalance: 'Show balance',
    refresh: 'Refresh',
    trustBar: 'CBN Licensed • NDIC Insured • 50k+ Agents',
    primaryActions: {
      airtime: 'Airtime',
      sendMoney: 'Send Money',
      agent: 'Agent',
      bills: 'Bills',
    },
    recentActivity: 'Recent Activity',
    viewAll: 'View all',
    emptyState: {
      title: 'No transactions yet',
      subtitle: 'Buy airtime to start',
      cta: 'Buy Airtime',
    },
    savingsShortcut: {
      title: 'Grow your money',
      subtitle: 'Auto-save ₦500 daily',
      cta: 'Start saving',
    },
  },
};
