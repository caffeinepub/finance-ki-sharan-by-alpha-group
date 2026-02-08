// Static glossary entries for C-terms batch (CEDEL through Custody risk)
// This data is version-controlled and used for bulk publishing to the backend

import type { GlossaryTerm } from '../backend';

export interface BulkImportEntry {
  term: string;
  definition: string;
  example?: string;
  usage?: string;
}

export const cTermsBatch: BulkImportEntry[] = [
  {
    term: "CEDEL",
    definition: "One of the two major organizations in the Eurobond market which clears or handles the physical exchange of, securities and stores securities. Based in Luxembourg, the company is owned by several shareholding banks and operates through a network of agents."
  },
  {
    term: "Calendar spread",
    definition: "The simultaneous sale and purchase of either calls or puts with the same strike price but different expiration months."
  },
  {
    term: "Call Money",
    definition: "The unpaid installment of the share capital of a company, which a shareholder is called upon to pay."
  },
  {
    term: "Call option",
    definition: "An agreement that gives an investor the right, but not the obligation, to buy an instrument at a known price by a specified date. For this privilege, the investor pays a premium, usually a fraction of the price of the underlying security."
  },
  {
    term: "Capital Asset Pricing Model (CAPM)",
    definition: "An economic theory that describes the relationship between risk and expected return and serves as a model for the pricing of risky securities. The CAPM asserts that the only risk that is priced by rational investors is systematic risk, because it cannot be eliminated by diversification. The CAPM says that the expected return of a security or a portfolio is equal to the rate on a risk-free security plus a risk premium."
  },
  {
    term: "Capital Gain Distribution",
    definition: "Profits distributed to unit holders / shareholders resulting from the sale of securities held in the fund's portfolio for more than one year."
  },
  {
    term: "Carry Over Margin",
    definition: "The margin fixed by the Stock Exchange and payable by the members for carrying over the transactions from one settlement period to another."
  },
  {
    term: "Cash List",
    definition: "List of non-specified securities, traded usually for hand delivery and also for special delivery and spot delivery."
  },
  {
    term: "Cash Market",
    definition: "A market for sale of security against immediate delivery, as opposed to the futures market."
  },
  {
    term: "Cash Settlement",
    definition: "The settlement provision on some options and futures contracts that do not require delivery of the underlying security. For options, the difference between the settlement price on the underlying asset and the option's exercise price is paid to the option holder at exercise. For futures contracts, the exchange establishes a settlement price on the final day of trading and all remaining open positions are marked to market at that price."
  },
  {
    term: "Cats and Dogs (U.S)",
    definition: "Stocks in companies that are small, new, poorly financed or in trouble."
  },
  {
    term: "CDSC (Contingent deferred sales charge)",
    definition: "A type of back end load sales charge, a contingent deferred sales charge is a fee charged when shares are redeemed within a specific period following their purchase. These charges are usually assessed on a sliding scale, with the fee reduced each year during which the shares are held."
  },
  {
    term: "Central Listing Authority",
    definition: "The authority set up to address the issue of multiple listing of the same security and to bring about uniformity in the due diligence exercise in scrutinising all listing applications on any stock exchanges. The functions include processing the application made by any body corporate, Mutual Fund or collective investment scheme for the letter of recommendation to get listed at the stock exchange, making recommendations as to listing conditions and any other functions as may be specified by SEBI Board from time to time."
  },
  {
    term: "Certificate of Deposit",
    definition: "A negotiable certificate issued by a bank, usually for a period of one month to a year, as evidence of an interest bearing time deposit. This may also be offered at a discount."
  },
  {
    term: "Chalu Upla",
    definition: "Adjustment of position between two brokers either to avoid margin or to cross the trading or exposure limit."
  },
  {
    term: "Chartist analysis",
    definition: "Using charts of financial asset price movements (often with the aid of additional descriptive statistics) to try to infer the likely course of future prices and thus construct forecasts and trading strategies."
  },
  {
    term: "Cheapest to Deliver Issue",
    definition: "The acceptable Treasury security with the highest implied repo rate. It is the rate that a seller of a futures contract can earn by buying an issue and then delivering it at the settlement date."
  },
  {
    term: "Chinese walls",
    definition: "Artificial barriers to the flow of information set up in large firms to prevent the movement of sensitive information between departments."
  },
  {
    term: "Churning",
    definition: "An unethical practice employed by some brokers to increase their commissions by excessively trading in a client's account. In the context of the stock market, churning refers to a period of heavy trading with few sustained price trends and little movement in stock market indices."
  },
  {
    term: "Circuit Breaker",
    definition: "A system to curb excessive speculation in the stock market, applied by the Stock Exchange authorities, when the index spurts or plunges by more than a specified per cent. Trading is then suspended for some time to let the market cool down."
  },
  {
    term: "Circular trading",
    definition: "A fraudulent trading scheme where sell or buy orders are entered by a person who knows that the same number of shares at the same time and for the same price either have been or will be entered. These trades do not represent a real change in the beneficial ownership of the security. These trades are entered with the intention of raising or depressing the prices of securities."
  },
  {
    term: "Clean Float",
    definition: "Where there is no official intervention – the price is permitted to vary in line with the market forces"
  },
  {
    term: "Clearing",
    definition: "Settlement or clearance of accounts, for a fixed period in a Stock Exchange."
  },
  {
    term: "Clearing House",
    definition: "A department of an exchange or a separate legal entity that provides a range of services related to the clearance and settlement of trades and the management of risks associated with the resulting contracts. A clearing house is often central counterparty to all trades, that is, the buyer to every seller and the seller to every buyer."
  },
  {
    term: "Clearing member",
    definition: "A member of a clearing corporation or clearing house of the derivatives exchange or derivatives segment of an exchange, who may clear and settle transactions in securities."
  },
  {
    term: "Close-out-netting",
    definition: "An arrangement to settle all contracted but not yet due obligations to and claims on a counterparty by one single payment, immediately upon the occurrence of one of the defined events of default."
  },
  {
    term: "Closing Out",
    definition: "Where a party to a contract does not make delivery against sale or payment against delivery of documents, the other party can close out the transaction against the defaulting party. The gain or loss arising from the closing out is borne by the defaulter."
  },
  {
    term: "Close-ended Fund",
    definition: "A type of investment company that has a fixed number of shares which are publicly traded. The price of a closed end share fluctuates based on investor supply and demand. Closed ended funds are not required to redeem shares and have managed portfolios."
  },
  {
    term: "Closing Price",
    definition: "The rate at which the last transaction in a security is struck before the close of the trading hours."
  },
  {
    term: "Coercive Tender Offer",
    definition: "A tender offer that exerts pressure on target shareholders to tender early. This pressure may come in the form of preferential compensation for early tendering shareholders. Changes in securities laws have limited the effectiveness of such tender offers."
  },
  {
    term: "Collar Agreement",
    definition: "Agreed upon adjustments in the number of shares offered in a stock-for-stock exchange to account for fluctuations in stock prices prior to the completion of the deal."
  },
  {
    term: "Collateralised Mortgage Obligation (CMO)",
    definition: "A generic term for a security backed by real estate mortgages. CMO payment obligations are covered by interest and /or principal payments from a pool of mortgages. In addition to its generic meaning, CMO usually suggest a non governmental issue."
  },
  {
    term: "Collective Investment Management Company",
    definition: "A company incorporated under the provisions of the Companies Act, 1956 and registered with SEBI under the SEBI (Collective Investment Schemes) Regulations, 1999, whose object is to organise, operate and manage a Collective Investment Scheme."
  },
  {
    term: "Collective investment scheme (CIS)",
    definition: "Any scheme or arrangement made or offered by any company under which the contributions, or payments made by the investors, are pooled and utilized with a view to receive profits, income, produce or property, and is managed on behalf of the investors is a Collective Investment Scheme. Investors do not have day to day control over the management and operation of such scheme or arrangement."
  },
  {
    term: "Commercial Paper",
    definition: "A short term promise to repay a fixed amount that is placed on the market either directly or through a specialized intermediary. It is usually issued by companies with a high credit standing in form of a promissory note redeemable at par to the holder on maturity and therefore does not require any guarantee."
  },
  {
    term: "Common stock",
    definition: "Units of ownership of a public corporation. Holders of common stock typically have voting rights and receive dividends, but there is no guarantee of dividend payment."
  },
  {
    term: "Competitive Bid",
    definition: "An offer made by a person other than the acquirer who has made the first public announcement."
  },
  {
    term: "Composite issues",
    definition: "An issue of securities by a listed company on a public-cum rights basis offered through a single offer document wherein the allotment for both public and rights component of the issue is proposed to be made simultaneously."
  },
  {
    term: "Compulsory delisting",
    definition: "Permanent removal of securities of a listed company from a stock exchange as a penalizing measure at the behest of the stock exchange for not making submissions / complying with various requirements set out in the Listing agreement within the time frames prescribed."
  },
  {
    term: "Confirmation process",
    definition: "The procedure for verifying trade details with a counterparty. This is generally done by exchanging via fax or mail a document (i.e. a confirmation) identifying the trade details and any governing legal documentation and verifying the accuracy of the information provided by the counterparty (i.e. matching)."
  },
  {
    term: "Constituent Subsidiary General Ledger (SGL) account",
    definition: "A constituent SGL account is an account held by an intermediary at Reserve Bank of India (RBI) on behalf of its constituents who have empowered the said intermediary to carry out various transactions on their behalf. In this account only constituent transactions can take place and under no circumstances the intermediary will use this account for proprietary transactions."
  },
  {
    term: "Continuous disclosure",
    definition: "Procedure where certain companies are required to make disclosures on a continuing basis of their business activities by filing documents."
  },
  {
    term: "Continuous net settlement",
    definition: "Automated book-entry accounting system that centralizes the settlement of compared security transactions and maintains an orderly flow of security and money balances."
  },
  {
    term: "Contract Month",
    definition: "The month in which futures contracts may be settled by making or accepting delivery."
  },
  {
    term: "Contract Note",
    definition: "A note issued by a broker to his constituent setting out the number of securities bought or sold in the market along with the rate, time and date of contract."
  },
  {
    term: "Control of management",
    definition: "The right to appoint directly or indirectly or by virtue of agreements or in any other manner majority of directors on the Board of the target company or to control management or policy decisions affecting the target company"
  },
  {
    term: "Controlling interest",
    definition: "Holding a sufficiently large number of shares in a company so as to be able to control its prices."
  },
  {
    term: "Convergence",
    definition: "Narrowing of the difference between the futures contract and the value of the underlying asset during the final days of the contract"
  },
  {
    term: "Conversion Price",
    definition: "The price at which a convertible instrument is converted into shares of the company."
  },
  {
    term: "Conversion Ratio",
    definition: "The number of shares which may be acquired upon the conversion of a convertible instrument. The ratio is calculated as instrument's principal amount divided by conversion price."
  },
  {
    term: "Convertible Bond",
    definition: "A bond giving the investor the option to convert the bond into equity at a fixed conversion price or as per a pre-determined pricing formula."
  },
  {
    term: "Corners",
    definition: "A corner occurs when a person buys up a substantial volume of a security knowing that other market participants will be forced to buy from him at a higher price. An example of this would be when the other market participants hold short positions in the security which must be settled. A similar practice is the \"abusive squeeze\" where a person takes advantage of a shortage in an asset by controlling the demand side and creating artificial prices."
  },
  {
    term: "Corporate Governance",
    definition: "The way in which companies run themselves, in particular the way in which they are accountable to those who have a vested interest in their performance, especially their shareholders."
  },
  {
    term: "Corporate raiders",
    definition: "A cash rich person who may either by himself or through the company he controls buys in very large numbers of equity shares of a target company with a view to taking over that company."
  },
  {
    term: "Corporate restructuring",
    definition: "Involves making radical changes in the composition of the businesses in the company's portfolio."
  },
  {
    term: "Correction",
    definition: "Temporary reversal of trend in share prices. This could be a reaction (a decrease following a consistent rise in prices) or a rally (an increase following a consistent fall in prices)."
  },
  {
    term: "Counter party risk",
    definition: "The risk that between the time a transaction has been arranged and the time of actual settlement, the counterparty to the transaction will fail to make the appropriate payment."
  },
  {
    term: "Coupon",
    definition: "The interest paid on a bond expressed as a percentage of the face value. If a bond carries a fixed coupon, the interest is paid on an annual or semi-annual basis. The term also describes the detachable certificate entitling the bearer to payment of the interest."
  },
  {
    term: "Coupon Rate",
    definition: "The interest rate stated on the face of coupon."
  },
  {
    term: "Cover",
    definition: "(1) To take out a forward foreign exchange contract.\n(2) To close out a short position by buying the currency or securities which have been sold.\n(3) To insure.\n(4) The purchase or sale of futures to offset a previously established short or long position."
  },
  {
    term: "Covered call option writing",
    definition: "A strategy in which one sells call options while simultaneously owning an equivalent position in the underlying security."
  },
  {
    term: "Covered put option writing",
    definition: "A strategy in which one sells puts and simultaneously is short of an equivalent position in the underlying security."
  },
  {
    term: "Covered warrant",
    definition: "A stock, basket, or index warrant issued by a party other than the issuer of the underlying stock(s) and secured by the warrant issuer's holding in the underlying securities or the warrant issuer's general credit standing."
  },
  {
    term: "Credit rating",
    definition: "Credit ratings measure a borrower's creditworthiness and provide an international framework for comparing the credit quality of issuers and rated debt securities. Rating agencies allocate three kinds of ratings: issuer credit ratings, long-term debt, and short-term debt. Issuer credit ratings are amongst the most widely watched. They measure the creditworthiness of the borrower including its capacity and willingness to meet financial needs. The top credit rating issued by the main agencies - Standard & Poor's, Moody's and Fitch IBCA - is AAA or Aaa. This is reserved for a few sovereign and corporate issuers. Ratings are divided into two broad groups - investment grade and speculative (junk) grade."
  },
  {
    term: "Credit rating agency",
    definition: "Credit rating agency means a body corporate which is engaged in, or proposes to be engaged in, the business of rating of securities offered by way of public or rights issue."
  },
  {
    term: "Credit Risk",
    definition: "The risk that a counterparty will not settle an obligation for full value, either when due or at any time thereafter. Credit risk includes pre-settlement risk (replacement cost risk) and settlement risk (Principal risk)."
  },
  {
    term: "Cross collateralization",
    definition: "Practice of using assets as back up or secondary collateral for debt other than the debt they are primarily pledged for. A network of cross collateralization may facilitate an increase in borrowing or a reduction in borrowing cost."
  },
  {
    term: "Cross hedging",
    definition: "Practice of altering the risk characteristic of a predetermined position in one cash good by taking out a position in a future or forward contract which is based on a good which differs significantly from that of the initial cash position."
  },
  {
    term: "Cross margining",
    definition: "An arrangement between and among custodial and clearing organizations to partially offset excess risk-adjusted margin deposited with one entity against margin requirements with another."
  },
  {
    term: "Cross-Rate (U.S)",
    definition: "The exchange rate between currencies A and C which is derived from the rate between A and B and the rate between B and C. Thus if $ 1 = DM 2.50 and $1=Yen 250, the cross rate between the DM and Yen is DM 1= Yen 100."
  },
  {
    term: "Cum",
    definition: "Means 'with' A cum price includes the right to any declared dividend (cd) or bonus (cb)."
  },
  {
    term: "Cumulative Convertible Preference Shares",
    definition: "A type of preference shares where the dividend payable on the same accumulates, if not paid. After a specified date, these shares will be converted into equity capital of the company."
  },
  {
    term: "Cumulative Preference Shares",
    definition: "A type of preference shares on which dividend accumulates if not paid. All arrears of preference dividend have to be paid out before paying dividend on equity shares."
  },
  {
    term: "Current Asset",
    definition: "Cash or an item of value expected to be converted into cash within one year or one operating cycle, whichever is longer."
  },
  {
    term: "Current Liability",
    definition: "Accounting term for money payable within the current accounting year, on account of trade creditors, taxation, dividends, etc. To these are often added provisions, i.e. any charges or liabilities (various government duties, disputed claims, etc.) which the company may have to settle within the accounting year."
  },
  {
    term: "Current Ratio",
    definition: "Current ratio measures a company's current assets relative to its current liabilities. This gives an indication of its abilities to meet short-term liabilities; the higher the ratio, the more liquid the company."
  },
  {
    term: "Current Yield",
    definition: "A measure of the return to a bondholder calculated as a ratio of the coupon to the market price. It is simply the annual coupon rate divided by the clean price of the bond."
  },
  {
    term: "Custodian",
    definition: "An organization, usually a bank or any other approved institutions, that hold the securities and other assets of mutual funds and other institutional investors."
  },
  {
    term: "Custody risk",
    definition: "The risk of loss of securities held in custody occasioned by the insolvency, negligence or fraudulent action of the custodian or of a sub-custodian."
  }
];
