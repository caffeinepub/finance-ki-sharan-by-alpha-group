/**
 * ArthSaathi Chat Utilities
 * Deterministic, content-sourced response helpers for the ArthSaathi finance education assistant.
 */

import type { ChatAskResponseSource } from '../backend';
import { ChatSourceType } from '../backend';

// Language preference detection
export function detectLanguagePreference(text: string): 'hinglish' | 'english' {
  const englishKeywords = ['english', 'in english', 'speak english', 'use english'];
  const lowerText = text.toLowerCase();
  
  if (englishKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'english';
  }
  
  return 'hinglish';
}

// Intent detection
export function detectRecommendationIntent(text: string): boolean {
  const recommendationKeywords = [
    'should i', 'recommend', 'advice', 'advise', 'suggest',
    'buy', 'sell', 'invest in', 'best', 'better', 'worst',
    'prediction', 'predict', 'forecast', 'will return', 'guaranteed',
    'portfolio', 'allocation', 'hold', 'kharidun', 'bechun',
    'invest karun', 'kya karun', 'kahan invest', 'best hai',
    'sahi hai', 'galat hai', 'achha hai', 'bura hai'
  ];
  
  const lowerText = text.toLowerCase();
  return recommendationKeywords.some(keyword => lowerText.includes(keyword));
}

export function detectCalculatorIntent(text: string): string | null {
  const calculatorKeywords = {
    'sip': ['sip', 'systematic investment', 'monthly investment'],
    'lumpsum': ['lump sum', 'lumpsum', 'one time investment', 'ek baar'],
    'stepup': ['step up', 'stepup', 'step-up', 'increase sip'],
    'swp': ['swp', 'systematic withdrawal', 'withdrawal plan'],
    'ssy': ['ssy', 'sukanya samriddhi', 'sukanya', 'girl child'],
    'nsc': ['nsc', 'national savings certificate'],
    'emi': ['emi', 'loan', 'home loan', 'car loan'],
    'ppf': ['ppf', 'public provident fund'],
    'fd': ['fd', 'fixed deposit'],
    'gst': ['gst', 'goods and services tax'],
    'xirr': ['xirr', 'return calculation']
  };
  
  const lowerText = text.toLowerCase();
  
  for (const [calc, keywords] of Object.entries(calculatorKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return calc;
    }
  }
  
  return null;
}

export function detectLegalTaxIntent(text: string): boolean {
  const legalTaxKeywords = [
    'legal', 'law', 'lawyer', 'court', 'case',
    'tax advice', 'tax planning', 'tax saving', 'itr',
    'income tax', 'capital gains tax', 'tds',
    'kanoon', 'vakil', 'tax bachao'
  ];
  
  const lowerText = text.toLowerCase();
  return legalTaxKeywords.some(keyword => lowerText.includes(keyword));
}

// Response builders
export function buildRefusalResponse(language: 'hinglish' | 'english'): string {
  if (language === 'english') {
    return "I cannot provide personal financial advice or recommendations about buying, selling, or investing in specific products. However, I can help you understand general concepts!\n\nFor example, I can explain:\n• What different investment options are\n• How they work\n• General risks and benefits\n• Key factors to consider\n\nPlease ask me about concepts you'd like to learn about.";
  }
  
  return "Main aapko personal financial advice ya kisi specific product ko buy/sell karne ki recommendation nahi de sakta. Lekin main aapko general concepts samjha sakta hoon!\n\nJaise ki:\n• Different investment options kya hain\n• Ye kaise kaam karte hain\n• General risks aur benefits\n• Kaunse factors consider karne chahiye\n\nKripya mujhse concepts ke baare mein puchiye jo aap seekhna chahte hain.";
}

export function buildLegalTaxRefusalResponse(language: 'hinglish' | 'english'): string {
  if (language === 'english') {
    return "I cannot provide legal or tax advice. For specific tax planning or legal matters, please consult with a qualified Chartered Accountant (CA) or legal professional.\n\nHowever, I can explain general concepts about:\n• How taxes work in India\n• Different types of taxes\n• Basic tax-saving instruments\n• General compliance requirements";
  }
  
  return "Main legal ya tax advice nahi de sakta. Specific tax planning ya legal matters ke liye, kripya qualified Chartered Accountant (CA) ya legal professional se consult karein.\n\nLekin main aapko general concepts samjha sakta hoon:\n• India mein taxes kaise kaam karte hain\n• Different types of taxes\n• Basic tax-saving instruments\n• General compliance requirements";
}

export function buildCalculatorExplanation(calculator: string, language: 'hinglish' | 'english'): string {
  const explanations: Record<string, { hinglish: string; english: string }> = {
    'sip': {
      hinglish: "**SIP Calculator** aapko yeh samajhne mein madad karta hai ki agar aap har mahine ek fixed amount invest karte hain, toh time ke saath aapka investment kaise badh sakta hai.\n\n**Inputs:**\n• Monthly Investment - Har mahine kitna invest karenge\n• Expected Return Rate - Annual return rate (percentage)\n• Time Period - Kitne saal tak invest karenge\n\nYeh calculator sirf estimation deta hai. Actual returns market conditions par depend karte hain.\n\nAap hamare SIP Calculator page par ja kar khud calculate kar sakte hain.",
      english: "**SIP Calculator** helps you understand how your investment can grow over time if you invest a fixed amount every month.\n\n**Inputs:**\n• Monthly Investment - Amount to invest each month\n• Expected Return Rate - Annual return rate (percentage)\n• Time Period - Investment duration in years\n\nThis calculator provides only an estimation. Actual returns depend on market conditions.\n\nYou can visit our SIP Calculator page to calculate yourself."
    },
    'lumpsum': {
      hinglish: "**Lump Sum Calculator** aapko yeh samajhne mein madad karta hai ki agar aap ek baar mein badi amount invest karte hain, toh time ke saath aapka investment kaise badh sakta hai.\n\n**Inputs:**\n• Investment Amount - Ek baar mein kitna invest karenge\n• Expected Return Rate - Annual return rate (percentage)\n• Time Period - Kitne saal tak invested rahega\n\nYeh sirf estimation hai, actual returns vary kar sakte hain.",
      english: "**Lump Sum Calculator** helps you understand how a one-time investment can grow over time.\n\n**Inputs:**\n• Investment Amount - One-time investment amount\n• Expected Return Rate - Annual return rate (percentage)\n• Time Period - Investment duration in years\n\nThis is only an estimation; actual returns may vary."
    },
    'emi': {
      hinglish: "**EMI Calculator** aapko yeh samajhne mein madad karta hai ki loan lene par har mahine kitna EMI dena hoga.\n\n**Inputs:**\n• Loan Amount - Kitna loan chahiye\n• Interest Rate - Annual interest rate (percentage)\n• Loan Tenure - Kitne saal mein repay karenge\n\nYeh calculator aapko monthly EMI, total interest, aur total repayment amount dikhata hai.",
      english: "**EMI Calculator** helps you understand your monthly loan repayment amount.\n\n**Inputs:**\n• Loan Amount - Amount of loan needed\n• Interest Rate - Annual interest rate (percentage)\n• Loan Tenure - Repayment period in years\n\nThis calculator shows monthly EMI, total interest, and total repayment amount."
    }
  };
  
  const explanation = explanations[calculator];
  if (!explanation) {
    return language === 'english' 
      ? "I can help you understand various financial calculators. Please visit our Calculators page to explore all available tools."
      : "Main aapko various financial calculators samjha sakta hoon. Kripya hamare Calculators page par jaiye sabhi tools dekhne ke liye.";
  }
  
  return language === 'english' ? explanation.english : explanation.hinglish;
}

export function buildNoContentResponse(language: 'hinglish' | 'english'): string {
  if (language === 'english') {
    return "I couldn't find relevant content in our educational resources to answer your question. Please try browsing our sections:\n\n• **Learning** - Step-by-step financial education\n• **Glossary** - Financial terms and definitions\n• **Articles** - In-depth educational content\n• **Calculators** - Financial planning tools\n\nRemember, I provide educational information only, not financial advice.";
  }
  
  return "Mujhe aapke question ka answer hamare educational resources mein nahi mila. Kripya hamare sections browse karein:\n\n• **Learning** - Step-by-step financial education\n• **Glossary** - Financial terms aur definitions\n• **Articles** - Detailed educational content\n• **Calculators** - Financial planning tools\n\nYaad rakhein, main sirf educational information deta hoon, financial advice nahi.";
}

export function buildSourceBasedResponse(
  sources: ChatAskResponseSource[],
  language: 'hinglish' | 'english'
): string {
  if (language === 'english') {
    let response = "Based on our educational resources:\n\n";
    
    sources.slice(0, 3).forEach((source, idx) => {
      response += `${idx + 1}. **${source.title}**\n${source.content.substring(0, 200)}${source.content.length > 200 ? '...' : ''}\n\n`;
    });
    
    if (sources.length > 3) {
      response += `_...and ${sources.length - 3} more related resources._\n\n`;
    }
    
    response += "See the sources below for more details.";
    return response;
  }
  
  // Hinglish
  let response = "Hamare educational resources ke basis par:\n\n";
  
  sources.slice(0, 3).forEach((source, idx) => {
    response += `${idx + 1}. **${source.title}**\n${source.content.substring(0, 200)}${source.content.length > 200 ? '...' : ''}\n\n`;
  });
  
  if (sources.length > 3) {
    response += `_...aur ${sources.length - 3} related resources._\n\n`;
  }
  
  response += "Zyada details ke liye neeche sources dekhein.";
  return response;
}

// Disclaimer line
export const EDUCATIONAL_DISCLAIMER_LINE = "This information is for educational and awareness purposes only.";
export const EDUCATIONAL_DISCLAIMER_LINE_HINGLISH = "Yeh jaankari sirf educational aur awareness purposes ke liye hai.";

export function shouldAppendDisclaimer(
  userMessage: string,
  hasRecommendationIntent: boolean,
  hasCalculatorIntent: boolean
): boolean {
  // Append disclaimer when:
  // 1. User asks for recommendations/advice
  // 2. Calculator-related queries (to avoid misinterpretation of outputs)
  // 3. Any guidance-seeking language
  return hasRecommendationIntent || hasCalculatorIntent;
}

export function getDisclaimerLine(language: 'hinglish' | 'english'): string {
  return language === 'english' 
    ? EDUCATIONAL_DISCLAIMER_LINE 
    : EDUCATIONAL_DISCLAIMER_LINE_HINGLISH;
}

// Full educational disclaimer for banner
export function getFullDisclaimer(language: 'hinglish' | 'english'): string {
  if (language === 'english') {
    return "This is an educational tool. The information provided is for learning purposes only and should not be considered as financial advice, investment recommendations, or predictions. Always consult with qualified financial professionals before making investment decisions.";
  }
  
  return "Yeh ek educational tool hai. Yahan di gayi jaankari sirf seekhne ke liye hai aur ise financial advice, investment recommendations, ya predictions nahi maana jaana chahiye. Investment decisions lene se pehle hamesha qualified financial professionals se consult karein.";
}
