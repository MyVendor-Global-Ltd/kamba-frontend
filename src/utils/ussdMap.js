// utils/ussdMap.js — USSD fallback mapping for offline/resilient patterns
// "Offline? Dial *901#" banner when network fails, mapped per action

export const ussdMap = {
  // Core banking
  airtime: '*901#',           // Self airtime
  airtimeOther: '*901*1*',    // Airtime for others (append amount*phone#)
  sendMoney: '*901*2*',       // Transfer (append amount*account#)
  agent: '*901*3#',           // Agent locator / cash out
  bills: '*901*4#',           // Bill payments
  balance: '*901*00#',        // Check balance
  miniStatement: '*901*00#',  // Mini statement
  bvn: '*901*5#',             // BVN linkage
  cardless: '*901*6#',        // Cardless withdrawal
  savings: '*901*7#',         // Savings / SafeLock
  loans: '*901*8#',           // Quick loans
  help: '*901*9#',            // Help / Support

  // Network-specific (major Nigerian banks)
  // These are generic — real app would map per user's bank
  networks: {
    '901': 'Access Bank',
    '737': 'GTBank',
    '389': 'FirstBank',
    '966': 'Zenith Bank',
    '329': 'UBA',
    '894': 'Fidelity Bank',
    '322': 'Union Bank',
    '901': 'Access Bank',
    '919': 'Keystone Bank',
    '989': 'Polaris Bank',
    '770': 'FCMB',
    '345': 'Stanbic IBTC',
    '874': 'Wema Bank',
    '919': 'Keystone',
    '315': 'Heritage Bank',
    '945': 'Jaiz Bank',
    '786': 'Taj Bank',
  },
};

/**
 * Get USSD code for a specific action
 * @param {string} action - Action key from ussdMap
 * @param {object} params - Dynamic parameters (amount, phone, account, etc.)
 * @returns {string} Complete USSD string ready for dialing
 */
export const getUssdCode = (action, params = {}) => {
  const baseCode = ussdMap[action];
  if (!baseCode) return ussdMap.help;

  // Replace placeholders if provided
  let code = baseCode;
  if (params.amount) code = code.replace('*amount*', `*${params.amount}*`);
  if (params.phone) code = code.replace('*phone#', `*${params.phone}#`);
  if (params.account) code = code.replace('*account#', `*${params.account}#`);
  if (params.billerId) code = code.replace('*billerId*', `*${params.billerId}*`);

  return code;
};

/**
 * Generate WhatsApp share link for USSD code
 * "Send this USSD to a friend via WhatsApp"
 */
export const getUssdWhatsAppLink = (action, params = {}) => {
  const code = getUssdCode(action, params);
  const text = encodeURIComponent(`Use this USSD code: ${code}`);
  return `https://wa.me/?text=${text}`;
};

/**
 * Check if device can make phone calls (for USSD)
 */
export const canDialUssd = () => {
  // In React Native, use Linking.canOpenURL('tel:*901#')
  return true; // Placeholder — implement with Linking in components
};

export default { ussdMap, getUssdCode, getUssdWhatsAppLink, canDialUssd };