import z from "zod/v3";

export const ACCOUNT_GROUPS = [
  { code: "1000", label: "Domestic Vendor - RM" },
  { code: "1100", label: "Domestic Vendor - Others" },
  { code: "1200", label: "Imports Vendor - RM" },
  { code: "1300", label: "Imports Vendor - Others" },
  { code: "1400", label: "Service Vendor - Domestic" },
  { code: "1500", label: "Service Vendor - Imports" },
  { code: "1600", label: "Capital Goods Vendor - Domestic" },
  { code: "1700", label: "Capital Goods Vendor - Imports" },
  { code: "1800", label: "Employee - Domestic" },
  { code: "1900", label: "Employee - Foreign" },
  { code: "2000", label: "Sales Commission Agent" },
  { code: "2100", label: "Loan Vendor" },
  { code: "2200", label: "Deposit Vendors" },
] as const;


export const RECON_ACCOUNTS = [
  {
    code: "16128541",
    label: "Sundry creditors-Dom-Raw Materials",
  },
  {
    code: "16128542",
    label: "Sundry creditors-Dom-Capital goods",
  },
  {
    code: "16128543",
    label: "Sundry creditors-Dom-Services",
  },
  {
    code: "16128544",
    label: "Sundry creditors-Dom-Others",
  },
  {
    code: "16128545",
    label: "Accounts Payable-Dom-Employee",
  },
  {
    code: "16168641",
    label: "Sundry creditors-Imp-Raw Materials",
  },
  {
    code: "16168642",
    label: "Sundry creditors-Imp-Capital Goods",
  },
  {
    code: "16168643",
    label: "Sundry creditors-Imp-Services",
  },
  {
    code: "16168644",
    label: "Sundry creditors-Imp-Others",
  },
  {
    code: "16168645",
    label: "Accounts Payable-Frgn-Employee",
  },
];

export const PLANT_DATA = [
  { code: "1000", label: "Plant A" },
  { code: "1010", label: "Plant B" },
  { code: "1100", label: "Plant C" },
  { code: "1200", label: "Plant D" },
  { code: "1300", label: "Plant E" },
  { code: "1400", label: "Plant F" },
  { code: "3100", label: "Plant G" },
  { code: "3800", label: "Plant H" },
  { code: "4100", label: "Plant I" },
  { code: "5100", label: "Plant J" },
] as const;


export const PURCHASING_ORG = [
  { code: "1000", label: "AD - Bhandup" },
  { code: "1001", label: "ND - Bhandup" },
  { code: "1010", label: "AD - Bhandup(V)" },
  { code: "1011", label: "ND - Bhandup(V)" },
  { code: "1100", label: "AD - Unit - I" },
  { code: "1101", label: "ND - Unit - I" },
  { code: "1200", label: "AD - Unit - II" },
  { code: "1201", label: "ND - Unit - II" },
  { code: "1300", label: "AD - Unit - III" },
  { code: "1301", label: "ND - Unit - III" },
  { code: "1400", label: "AD - Unit - IV" },
  { code: "1401", label: "ND - Unit - IV" },
  { code: "3100", label: "AD - Worli" },
  { code: "3101", label: "ND - Worli" },
  { code: "3800", label: "AD - Bhiwandi" },
  { code: "3801", label: "ND - Bhiwandi" },
  { code: "5100", label: "AD - Unit - I (V)" },
] as const;

export const RECIPIENT_TYPE_INVOICE =
[
  {type:"CO"},
  {type:"OT"}
]

export const RECIPIENT_TYPE_PAYMENT =
[
  {type:"CO"},
  {type:"OT"}
]

export const PAYMENT_TERMS = [
  { code: "PFOC", label: "Free of Cost Value For Customs Purpose" },
  { code: "PH01", label: "35% Advance 35% CAD and remaining 30% in 30Days" },
  { code: "PH02", label: "35% Advance & bal before shipment" },
  { code: "PH03", label: "20% adv & bal within 3 days after customs clearanc" },
  { code: "PT00", label: "30% Advance By TT And 70% Against Copy Of BL" },
  { code: "PT01", label: "Payable immediately Due net" },
  { code: "PT02", label: "1 Day Credit" },
  { code: "PT03", label: "7 Days Credit" },
  { code: "PT04", label: "10 Days Credit" },
  { code: "PT05", label: "15 Days Credit" },
  { code: "PT06", label: "21 Days Credit" },
  { code: "PT07", label: "30 Days Credit" },
  { code: "PT08", label: "45 Days Credit" },
  { code: "PT09", label: "Within 60 Days Due net" },
  { code: "PT0F", label: "10% Ad 20% CAD 70% BL 90-20 Days" },
  { code: "PT10", label: "75 Days Credit" },
  { code: "PT11", label: "10% Advance Against PO" },
  { code: "PT12", label: "90 Days Credit" },
  { code: "PT13", label: "120 Days Credit" },
  { code: "PT14", label: "180 Days Credit" },
  { code: "PT15", label: "Part Payment against CAD and Balance in 90 Days" },
  { code: "PT16", label: "360 Days Credit" },
  { code: "PT17", label: "270 Days Credit" },
  { code: "PT18", label: "20% Advance Against PO" },
  { code: "PT19", label: "30% Advance Against PO" },
  { code: "PT1A", label: "Doc against Acceptance at 120 Days from BL Date" },
  { code: "PT1F", label: "50% advance & 50% Scanned BL Copy" },
  { code: "PT20", label: "40% Advance Against PO" },
  { code: "PT21", label: "50% Advance Against PO" },
  { code: "PT22", label: "Advance" },
  { code: "PT23", label: "Cash On Delivery ( COD)" },
  { code: "PT24", label: "100% Against Delivery" },
  { code: "PT25", label: "100% Against Proforma Invoice" },
  { code: "PT26", label: "20% Advance,balance agnst P/I before despatch" },
  { code: "PT27", label: "30% Advance,balance agnst P/I before despatch" },
  { code: "PT28", label: "50% Advance,balance agnst P/I before despatch" },
  { code: "PT29", label: "L/C 90 Days from despatch date" },
  { code: "PT30", label: "180 Days against L/C from date of delivery" },
  { code: "PT31", label: "15 Days after Delivery" },
  { code: "PT32", label: "50% Advance,bal within 10 days" },
  { code: "PT33", label: "7 Days after delivery" },
  { code: "PT34", label: "100% along with purchase order" },
  { code: "PT35", label: "25% advance & bal after 15 days from bill date" },
  { code: "PT36", label: "30% on information of mat recpt bal 30 days" },
  { code: "PT37", label: "40% Advance, Balance Against Performa Invoice" },
  { code: "PT38", label: "After Completion of Job" },
  { code: "PT39", label: "Immediately" },
  { code: "PT40", label: "L/C 120 Days from despatch date" },
  { code: "PT41", label: "50%Advance & 50%Balance Against copy of Doc" },
  { code: "PT42", label: "150 Days" },
  { code: "PT43", label: "50% Ad, 45% Before Deliver + tax 5% After Delivery" },
  { code: "PT44", label: "50% Advance 50% with tax Before Delivery" },
  { code: "PT45", label: "40 Days Credit" },
  { code: "PT46", label: "50% ADVANCE & BAL.40 DAY" },
  { code: "PT47", label: "20%T/T in Ad 75% LC 210 Dys BL 5% Aftr comm accept" },
  { code: "PT48", label: "50% Advance And 50% After Installation" },
  { code: "PT49", label: "50% Advance And 50% After Delivery Within 15 Days" },
  { code: "PT50", label: "Part Payment against CAD and Balance in 180 Days" },
  { code: "PT51", label: "20% Advance And 80% L/C At 240 Days" },
  { code: "PT52", label: "Paid By UPI" },
  { code: "PT53", label: "50% Adv, 30% On Delivery And 20% On Installation" },
  { code: "PT54", label: "60 Days From The Invoice Date" },
  { code: "PT55", label: "L/C 230 DAYS FROM B/L DATE" },
  { code: "PT56", label: "30% Ad 70%LC 90 days from BL Date" },
  { code: "PT57", label: "30% Adv by TT & 70% Bal by LC 180 Days" },
  { code: "PT58", label: "20%Adv by TT & 80% Bal by LC 180 Day from Dt of BL" },
  { code: "PT59", label: "100% by TT on Doc Again Accep 60 Days from B/L" },
  { code: "PT60", label: "L/C AT 60 Days from B/L Date" },
  { code: "PT61", label: "20% Adv by TT & 80% Bal by LC 90 Day from Dt of BL" },
  { code: "PT62", label: "50% Advance And 50% After Delivery Within 30 Days" },
  { code: "PT63", label: "100% irrevocable L/C 120 days from INV Date" },
  { code: "PT64", label: "30 Days From The Invoice Date" },
  { code: "PT70", label: "25%Adv-TT & L/C-Con-Irr-After-365-BOL-Date" },
  { code: "PT71", label: "Part Payment against Advance and Balance in 180 Da" },
  { code: "PT72", label: "Cash against Document" },
  { code: "PT73", label: "Par Pay in Adv and balance cash against document" },
  { code: "PT74", label: "Letter of Credit at Sight" },
  { code: "PT75", label: "L/C At 270 Days from B/L Date" },
  { code: "PT76", label: "LC at 180 days from B/L date" },
  { code: "PT77", label: "L/C at 90 days from B/L Date" },
  { code: "PT78", label: "L/C at 120 days from B/L Date" },
  { code: "PT79", label: "L/C at 30 days from B/L Date" },
  { code: "PT80", label: "150 days from the B/L date" },
  { code: "PT81", label: "90 days from B/L Date against acceptance of docume" },
  { code: "PT82", label: "L/C at 150 days from B/L Date" },
  { code: "PT83", label: "Party payment in advance and balance L/C at 30 day" },
  { code: "PT84", label: "Part paymnt in adv & balance agnst 90 day LC inv" },
  { code: "PT85", label: "50% against irrevocable L/C at 180 days from B/L d" },
  { code: "PT86", label: "L/C at 300  days from B/L date" },
  { code: "PT87", label: "L/C at 45 days from B/L date" },
  { code: "PT88", label: "50 Days Credit" },
  { code: "PT89", label: "180 days of B/L date against acceptance of documen" },
  { code: "PT90", label: "L/C 60 days" },
  { code: "PT91", label: "50% Advance Balance against Irrevocable LC" },
  { code: "PT92", label: "Letter of Credit L/C 210 days" },
  { code: "PT93", label: "50% conf Irriv L/C at site 50% L/C 180 Days" },
  { code: "PT94", label: "50% Ir L/c 50% 90 Days 50% 180 days from BL dt" },
  { code: "PT95", label: "60 days from B/L date" },
  { code: "PT96", label: "50% CAD & 50% 365 days from B/L Date" },
  { code: "PT97", label: "50% Advance & 50% against proof of Bill of Lading" },
  { code: "PT98", label: "Document against payment at sight" },
  { code: "PT99", label: "Free of Cost Sample" },
    { code: "PTA0", label: "80%ADVANCE & 20% AGAINST DELIVERY" },
  { code: "PTA1", label: "Part Pay CAD bal 270 days from BL Date" },
  { code: "PTA2", label: "70% LC at 90 Days bal 30% doc acc 120 BL dt." },
  { code: "PTA3", label: "70% CAD 30% 120 days after BL Date" },
  { code: "PTA4", label: "50% CAD & 50% 120 days from B/L Date" },
  { code: "PTA5", label: "70% LC at 120 days 30% 120 day from BL date" },
  { code: "PTA6", label: "70% LC at 90 days 30% 90 day from BL date" },
  { code: "PTA7", label: "25% Advance and bal 75% against Bill of Lading Cop" },
  { code: "PTA8", label: "Part pay 90 Day BL Date & Bal 120 day from BL Date" },
  { code: "PTA9", label: "Part Payment in ADV, balanc before arrival of ship" },
  { code: "PTB0", label: "30 Days from BL date against Document Acceptance" },
  { code: "PTB1", label: "70% LC at 90 Days BL dt 30% doc accpt 180 days BL" },
  { code: "PTB2", label: "Part Payment CAD Balance 180 day from BL Date" },
  { code: "PTB3", label: "Part Payment LC 90 days frm BL Bal 270Days from BL" },
  { code: "PTB4", label: "L/C at 150 days from Invoice Date" },
  { code: "PTB5", label: "45 Days from BL Date" },
  { code: "PTB6", label: "Part Payment CAD & Part Payment after 120 days" },
  { code: "PTB7", label: "30% Advance & 70% Before Loading" },
  { code: "PTB8", label: "50% Adv & Bal 90 days from BL" },
  { code: "PTB9", label: "L/C At 240 Days From B/L Date" },
  { code: "PTC0", label: "25% adv. with order & Bal. agst. Irr. LC at sight" },
  { code: "PTC1", label: "Bank Guarantee at 150 days from bl date" },
  { code: "PTC2", label: "Bank Guarantee at 180 days from bl date" },
  { code: "PTC3", label: "Bank Guarantee at 270 days from bl date" },
  { code: "PTC4", label: "90 days from Bank Guarantee" },
  { code: "PTC5", label: "Bank Guarantee At 240 Days From B/L Date" },
  { code: "PTC6", label: "Irr.&Confirmed LC at 270 days from BL Dt" },
  { code: "PTC7", label: "25% Advance & Bal. 75 % C.A.D." },
  { code: "PTC8", label: "50% Advance & Bal. Before Shipment" },
  { code: "PTC9", label: "25% Advance & Bal. By C.A.D. At Sight Through Bank" },
  { code: "PTD1", label: "30% Advance & Bal. 70% Against The Shipment" },
  { code: "PTD2", label: "C.A.D. At Sight through Bank" },
  { code: "PTD3", label: "100% Advance By T.T." },
  { code: "PTD4", label: "40% Advance & Bal. Against B/L Copy" },
  { code: "PTD5", label: "50% Advance & Bal. 50% Before Shipment" },
  { code: "PTD6", label: "30% Advance & Balance After Shipment" },
  { code: "PTD7", label: "50% Advance & 50% Bal. On D.P. Basis" },
  { code: "PTD8", label: "50% Advance & 50% Before Shipment" },
  { code: "PTD9", label: "180 Days From B/L Date" },
  { code: "PTE1", label: "30% Advance & 70% Balance Against B/L Copy" },
  { code: "PTE2", label: "Bank Guarantee at 90 days from BL date" },
  { code: "PTE3", label: "Part paymnt adv & balance agnst LC 90 days From BL" },
  { code: "PTE4", label: "60% Advance and balance 40% Cash against documents" },
  { code: "PTE5", label: "Advance 1000EUR at order and Bal CAD through Bank" },
  { code: "PTE6", label: "50% at order balance CAD Through Bank" },
  { code: "PTE7", label: "30% at Order and 70% CAD" },
  { code: "PTE8", label: "LC at 210 days from B/L date" },
  { code: "PTE9", label: "Documents Against Acceptance at 240 days from B/l" },
  { code: "PTF0", label: "7 Days From B/L Date" },
  { code: "PTF1", label: "10% at Order and balance 90% CAD" },
  { code: "PTF2", label: "100% @ 300 Days from BL Date" },
  { code: "PTF3", label: "LC at 195 days from BL Date" },
  { code: "PTF4", label: "Doc against Acceptance at 120 Days from Invoice Date" },
  { code: "PTF5", label: "30% advance & balance 70% On Board Seaway Bill" },
  { code: "PTF6", label: "Cash against documents at sight by TT before BL release" },
  { code: "PTF7", label: "20% advance and balance 80% before Delivery" },
  { code: "PTF8", label: "20% advance and balance 80% CAD Through Bank" },
  { code: "PTF9", label: "Bank Guarantee At 365 Days From B/L Date" },
  { code: "PTFA", label: "35% Advance and 65% CAD" },
  { code: "PTFB", label: "40% Advance & 60% Bank Guarantee at 365 Days From B/L dt" },
  { code: "PTFC", label: "2% ADV. & Balance CAD" },
  { code: "PTFD", label: "50% 120 days & 50% 150 days against B/L date" },
  { code: "PTFE", label: "10% Adv. & 90% LC at 90 days from the BL date" },
  { code: "PTFF", label: "15% Advance & 85% L/C 150 Days after B/L Date" },
  { code: "PTFG", label: "15% Adv. & 85% B/G at 365 Days from B/L Date" },
  { code: "PTFH", label: "15% Adv & 85% CAD" },
  { code: "PTFI", label: "15% Advance & 85% L/C @ 300 Days from B/L date" },
  { code: "PTFJ", label: "90 Days From B/L Date" },
  { code: "PTFK", label: "100% against SeaWay B/L" },
  { code: "PTFL", label: "150 days from Invoice Date" },
  { code: "PTFM", label: "50% in Advance & Balance 50% in C.A.D." },
  { code: "PTFN", label: "70% Advance & 30% Cash Against Documents" },
  { code: "PTFO", label: "L/C at 30 days from Invoice Date" },
  { code: "PTFP", label: "180 days from Invoice Date" },
  { code: "PTFQ", label: "25% Advance and Balance Against Delivery" },
  { code: "PTFR", label: "15% Advance & 85% Before Loading" },
  { code: "PTFS", label: "60% Advance Against PO" },
  { code: "PTFT", label: "50% Advance & 50% at 60 days from BL date" },
  { code: "PTFU", label: "40 Days PDC" },
  { code: "PTFV", label: "7 days in advance by PDC" },
  { code: "PTFW", label: "90% advance 10% after delivery" },
  { code: "PTFX", label: "75% advance balance after delivery" },
  { code: "PTFY", label: "10% adv along with PO & 90% before del of material" },
  { code: "PTFZ", label: "20% Advance & 80% L/C at Sight" },
  { code: "PTG0", label: "30% adv & 30% BL & 40% 90 day from BL dt" },
  { code: "PTG1", label: "30% advance by TT, 35% before loading & 35% against BL" },
  { code: "PTG2", label: "Advance Paid" },
  { code: "PTG3", label: "50% Advance & 50% After Completion of Work" },
  { code: "PTG4", label: "Paid By Credit Card" },
  { code: "PTG5", label: "55% advance and balance 180 Days from GR" },
  { code: "PTG6", label: "90 Days Credit From Date of Invoice" },
  { code: "PTG7", label: "30% Ad. Payment & 70% Balance By TT Or LC at Sight" },
  { code: "PTG8", label: "As Per Annexure" },
  { code: "PTGA", label: "20% in Adv. & Bal. upon shipment before BL release" },
  { code: "PTGB", label: "D/A 120 days from B/L date" },
  { code: "PTGC", label: "75% Against Delivery" },
  { code: "PTGD", label: "10% Advance bal L/C At 240 Days From Invoice Date" },
  { code: "PTGE", label: "L/C 90 Days from Invoice Date" },
  { code: "PTGF", label: "100% against non negotiable bill of lading" },
  { code: "PTGG", label: "50% Advance & Balance 30 days from BL date" },
  { code: "PTGH", label: "Part paymnt in adv & balance agnst 30 day BL date" },
  { code: "PTGI", label: "10% Advance bal L/C At 180 Days From Invoice Date" },
  { code: "PTGJ", label: "30% 30/60/90 against order & 10% advance" },
  { code: "PTGK", label: "50% CAD ags shipping doc & 50% COD within 7 day cont" },
  { code: "PTGL", label: "20% deposit & 50% agst doc & 30% 60 days B/L date" },
  { code: "PTGM", label: "20% deposit & Balance CAD" },
  { code: "PTGN", label: "50% Advance & Balance L/C at Sight" },
  { code: "PTGO", label: "30% advance 50% CAD and 20% after inspection" },
  { code: "PTGP", label: "90 days from INV Date against acceptance of docume" },
  { code: "PTGQ", label: "30% depst by TT & Balance upon shipment" },
  { code: "PTGR", label: "Doc against Acceptance at 15 Days from BL Date" },
  { code: "PTGS", label: "120 days from B/L Date" },
  { code: "PTGT", label: "135 days from B/L Date" },
  { code: "PTGU", label: "25% adv & 25% BL & 50% 90 day from BL dt" },
  { code: "PTGV", label: "30% advance & bal after 45 days after B/L date" },
  { code: "PTGW", label: "50% advance by TT & balance upon copy of BL" },
  { code: "PTGX", label: "30% Adv. & 70% CAD" },
  { code: "PTGY", label: "25% ADV, 65% LC & 10% AGNST CERT" },
  { code: "PTGZ", label: "Within 3 Days from Custom Clearance" },
  { code: "PTHA", label: "10% advance & 90% against shipment" },
  { code: "PTHB", label: "30% adv & bal within 3 days after customs clearance" },
  { code: "PTHC", label: "20% Adv 80% LC payable at 365Days from BL Date" },
  { code: "PTHD", label: "LC At 240 days from invoice date" },
  { code: "PTHE", label: "20% Advance 80% LC payable at 120 Days from BL Date" },
  { code: "PTHF", label: "30% Advance & Bal 70% Before Delivery" },
  { code: "PTHG", label: "100% payment before loading" },
  { code: "PTHH", label: "20% advance & balance before shipment" },
  { code: "PTHI", label: "25% Adv & Bal D/A 90 days from BL date through bank" },
  { code: "PTHJ", label: "Part Payment Adv & Bal 45 days after B/L date" },
  { code: "PTHK", label: "L/C at 30 days at Sight" },
  { code: "PTHL", label: "20% deposit balance after customs clearance" },
  { code: "PTHM", label: "40 Days Credit" },
  { code: "PTHN", label: "20% Adv & 80% Irrevocable L/C 150 Days after BL date" },
  { code: "PTHO", label: "20% ADV, 70% LC & 10% AGAINST CERT" },
  { code: "PTHP", label: "70% Adv & 30% Against B/L date" },
  { code: "PTHQ", label: "50% Advance & 50% After Delivery" },
  { code: "PTHR", label: "100% Payment After Completion of Delivery" },
  { code: "PTHS", label: "100% Irrevocable LC at sight" },
  { code: "PTHT", label: "LC at 30 days from L.R. Date" },
  { code: "PTHU", label: "25% Advance & 75% L/C 240 Days" },
  { code: "PTHV", label: "L/C at 45 days from LR date" },
  { code: "PTHW", label: "40% Advance, Balance 60% before delivery" },
  { code: "S001", label: "3 Days from custom clearance" },
  { code: "S003", label: "50% 120 days & 50% 150 days against B/L date" },
  { code: "S004", label: "50% 120 days & 50% 150 days against B/L date" },
  { code: "S005", label: "30% after 30 days order" },
  { code: "S006", label: "30% after 60 days against order" },
  { code: "S007", label: "30% after 90 days against order" },
  { code: "S008", label: "50% CAD against shipping documents" },
  { code: "S009", label: "50% COD within 7 day from date receiving container" },
  { code: "S010", label: "10% advance by wire transfer along with the order" },
  { code: "S011", label: "20% deposit along with order" },
  { code: "S012", label: "50% against shipping documents" },
  { code: "S013", label: "30% 60 days from BL date" },
  { code: "S014", label: "50% CAD and 50% at 90 days BL date" },
  { code: "S015", label: "10% adv. 40% CAD and 50% 30 days after clearance" },
  { code: "SU88", label: "90% Pymt. in 15 days & the balance in 90 days" },
] as const;



/* ===============================
   TYPES
================================ */




// W/Tax Type & Code mapping
export const WHT_INV = [
  { id: 1, type: "A0", code: "0A", label: "194A-INV-Interest", label1: "194A-INV-Interest-10%" },
  { id: 2, type: "A0", code: "A0", label: "194A-INV-Interest", label1: "194A-INV-Interest-10%" },
  { id: 3, type: "A1", code: "A1", label: "194A-INV-Interest", label1: "194A-INV-Interest-0%" },

  { id: 4, type: "C0", code: "0C", label: "194C-INV-Contractors", label1: "194C-INV-Contractors-20%" },
  { id: 5, type: "C0", code: "C0", label: "194C-INV-Contractors", label1: "194C-INV-Contractors-2%" },
  { id: 6, type: "C0", code: "C1", label: "194C-INV-Contractors", label1: "194C-INV-Contractors-1%" },
  { id: 7, type: "C0", code: "C3", label: "194C-INV-Contractors", label1: "194C-INV-Contractors-5%" },
  { id: 8, type: "C1", code: "C1", label: "194C-INV-Contractors", label1: "194C-INV-Contractors-0%" },
  { id: 9, type: "C2", code: "C2", label: "194C-INV-Contractors", label1: "194C-INV-Contractors-5%" },

  { id: 10, type: "D0", code: "0D", label: "194D-INV-Insurance Comm", label1: "194D-INV-Insurance Comm-20%" },
  { id: 11, type: "D0", code: "D0", label: "194D-INV-Insurance Comm", label1: "194D-INV-Insurance Comm-10%" },
  { id: 12, type: "D1", code: "D1", label: "194D-INV-Insurance Comm", label1: "194D-INV-Insurance Comm-0%" },

  { id: 13, type: "G1", code: "G1", label: "ST on GTA-Inv-Input", label1: "ST on GTA-Inv-Input" },
  { id: 14, type: "G2", code: "G2", label: "ECS on GTA-Inv-Input", label1: "ECS on GTA-Inv-Input" },
  { id: 15, type: "G3", code: "G3", label: "SEC on GTA-Inv-Input", label1: "SEC on GTA-Inv-Input" },
  { id: 16, type: "GI", code: "GI", label: "SB CESS on GTA-Inv-Input", label1: "SB CESS on GTA-Inv-Input" },
  { id: 17, type: "GJ", code: "GJ", label: "KK CESS on GTA-Inv-Input", label1: "KK CESS on GTA-Inv-Input" },

  { id: 18, type: "H0", code: "0H", label: "194H-INV-Comm Brokerage", label1: "194H-INV-Comm Brokerage-20%" },
  { id: 19, type: "H0", code: "H0", label: "194H-INV-Comm Brokerage", label1: "194H-INV-Comm Brokerage-10%" },
  { id: 20, type: "H0", code: "HA", label: "194H-INV-Comm Brokerage", label1: "194H-INV-Comm Brokerage-5%" },
  { id: 21, type: "H0", code: "HC", label: "194H-INV-Comm Brokerage", label1: "194H-INV-Comm Brokerage-2%" },
  { id: 22, type: "H1", code: "H1", label: "194H-INV-Comm Brokerage", label1: "194H-INV-Comm Brokerage-0%" },

  { id: 23, type: "I0", code: "0I", label: "194IA-INV:rent on Plant and Machinry", label1: "194IA-INV:rent on Plant and Machinry 20%" },
  { id: 24, type: "I0", code: "I0", label: "194IB-INV:rent on land &buliding", label1: "194IB-INV:rent on land &buliding 10%" },
  { id: 25, type: "I0", code: "I1", label: "194IA-INV:rent on Plant and Machinry", label1: "194IA-INV:rent on Plant and Machinry 2%" },
  { id: 26, type: "I1", code: "I2", label: "194I-INV-Rent", label1: "194I-INV-Rent-0%" },
  { id: 27, type: "I2", code: "I2", label: "194IA-INV:rent on Plant and Machinry ", label1: "194IA-INV:rent on Plant and Machinry 5%" },
  { id: 28, type: "I3", code: "I3", label: "194IB-INV:rent on land &buliding", label1: "194IB-INV:rent on land &buliding 20%" },
  { id: 29, type: "I5", code: "5I", label: "194IA-INV:rent on Plant and Machinry", label1: "194IA-INV:rent on Plant and Machinry 20%" },
  { id: 30, type: "I6", code: "I6", label: "194A-INV-Immovable Property", label1: "194A-INV-Immovable Property-1%" },

  { id: 31, type: "J0", code: "0J", label: "194JA-INV-Fees for Technical Service", label1: "194JA-INV-Fees for Technical Service-20%" },
  { id: 32, type: "J0", code: "2J", label: "194JA-INV-Fees for Technical Services", label1: "194JA-INV-Fees for Technical Services-2%" },
  { id: 33, type: "J0", code: "J0", label: "194JB-INV-Fee for prof. Service", label1: "194JB-INV-Fee for prof. service-10%" },
  { id: 34, type: "J1", code: "J1", label: "194J-INV-Fees for Prof/Tech Ser", label1: "194J-INV-Fees for Prof/Tech Ser-0%" },
  { id: 35, type: "J2", code: "J2", label: "194JA-INV-Fees for Technical Services", label1: "194JA-INV-Fees for Technical Services-5%" },
  { id: 36, type: "J3", code: "J3", label: "194JB-INV-Fee for prof. Service", label1: "194JB-INV-Fee for prof. service-20%" },

  { id: 37, type: "Q1", code: "Q1", label: "194Q: TDS on Purchase of Goods", label1: "194Q: TDS on Purchase of Goods- 0.1% INV" },
  { id: 38, type: "Q3", code: "Q3", label: "194Q:TDS on Pur of Goods", label1: "194Q:TDS on Pur of Goods- 0.1% INV-NOPAN" },
  { id: 39, type: "Q5", code: "Q5", label: "194Q: TDS on Purchase of Goods", label1: "194Q: TDS on Purchase of Goods- 5% INV" },
  { id: 40, type: "Q7", code: "Q7", label: "194Q:TDS on Pur of Goods", label1: "194Q:TDS on Pur of Goods- 20% INV-NOPAN" },

  { id: 41, type: "T1", code: "T1", label: "ST on GTA-Inv-Output", label1: "ST on GTA-Inv-Output" },
  { id: 42, type: "T2", code: "T2", label: "ECS on GTA-Inv-Output", label1: "ECS on GTA-Inv-Output" },
  { id: 43, type: "T3", code: "T3", label: "SEC on GTA-Inv-Output", label1: "SEC on GTA-Inv-Output" },
  { id: 44, type: "TI", code: "TI", label: "SB CESS on GTA-Inv-Output", label1: "SB CESS on GTA-Inv-Output" },
  { id: 45, type: "TJ", code: "TJ", label: "KK CESS on GTA-Inv-Output", label1: "KK CESS on GTA-Inv-Output" },

  { id: 46, type: "W0", code: "W0", label: "TDS WCT-INV", label1: "TDS WCT-INV-4%" },
  { id: 47, type: "W0", code: "W1", label: "TDS WCT-INV", label1: "TDS WCT-INV-2%" },
];




export const WHT_PAY = [
  { id: 1, type: "A5", code: "5A", label: "194A-PAY-Interest", label1: "194A-PAY-Interest-20%" },
  { id: 2, type: "A5", code: "A5", label: "194A-PAY-Interest", label1: "194A-PAY-Interest-10%" },
  { id: 3, type: "A6", code: "A6", label: "194A-PAY-Interest", label1: "194A-PAY-Interest-0%" },

  { id: 4, type: "C5", code: "5C", label: "194C-PAY-Contractors", label1: "194C-PAY-Contractors-20%" },
  { id: 5, type: "C5", code: "C5", label: "194C-PAY-Contractors", label1: "194C-PAY-Contractors-2%" },
  { id: 6, type: "C5", code: "C6", label: "194C-PAY-Contractors", label1: "194C-PAY-Contractors-1%" },
  { id: 7, type: "C5", code: "C9", label: "194C-PAY-Contractors", label1: "194C-PAY-Contractors-5%" },
  { id: 8, type: "C6", code: "C7", label: "194C-PAY-Contractors", label1: "194C-PAY-Contractors-0%" },
  { id: 9, type: "C8", code: "C8", label: "194C-PAY-Contractors", label1: "194C-PAY-Contractors-5%" },

  { id: 10, type: "D5", code: "5D", label: "194D-PAY-Insurance Comm", label1: "194D-PAY-Insurance Comm-20%" },
  { id: 11, type: "D5", code: "D5", label: "194D-PAY-Insurance Comm", label1: "194D-PAY-Insurance Comm-10%" },
  { id: 12, type: "D6", code: "D6", label: "194D-PAY-Insurance Comm", label1: "194D-PAY-Insurance Comm-0%" },

  { id: 13, type: "G4", code: "G4", label: "ST on GTA-PAY-Input", label1: "ST on GTA-PAY-Input" },
  { id: 14, type: "G5", code: "G5", label: "ECS on GTA-PAY-Input", label1: "ECS on GTA-PAY-Input" },
  { id: 15, type: "G6", code: "G6", label: "SEC on GTA-PAY-Input", label1: "SEC on GTA-PAY-Input" },
  { id: 16, type: "G7", code: "G7", label: "ST on GTA-Adv-Input", label1: "ST on GTA-Adv-Input" },
  { id: 17, type: "G8", code: "G8", label: "ECS on GTA-Adv-Input", label1: "ECS on GTA-Adv-Input" },
  { id: 18, type: "G9", code: "G9", label: "SEC on GTA-Adv-Input", label1: "SEC on GTA-Adv-Input" },
  { id: 19, type: "GP", code: "GP", label: "SB CESS on GTA-PAY-Input", label1: "SB CESS on GTA-PAY-Input" },
  { id: 20, type: "GQ", code: "GQ", label: "KK CESS on GTA-PAY-Input", label1: "KK CESS on GTA-PAY-Input" },

  { id: 21, type: "H5", code: "5H", label: "194H-PAY-Comm Brokerage", label1: "194H-PAY-Comm Brokerage-20%" },
  { id: 22, type: "H5", code: "H5", label: "194H-PAY-Comm Brokerage", label1: "194H-PAY-Comm Brokerage-10%" },
  { id: 23, type: "H5", code: "HB", label: "194H-PAY-Comm Brokerage", label1: "194H-PAY-Comm Brokerage-5%" },
  { id: 24, type: "H5", code: "HD", label: "194H-PAY-Comm Brokerage", label1: "194H-PAY-Comm Brokerage-2%" },
  { id: 25, type: "H6", code: "H6", label: "194H-PAY-Comm Brokerage", label1: "194H-PAY-Comm Brokerage-0%" },

  { id: 26, type: "I5", code: "I5", label: "194IB-PAY:rent on land &buliding", label1: "194IB-PAY:rent on land &buliding 10%" },
  { id: 27, type: "I5", code: "I6", label: "194IA-PAY:rent on Plant and Machinry", label1: "194IA-PAY:rent on Plant and Machinry 2%" },
  { id: 28, type: "I6", code: "I7", label: "194I-PAY-Rent", label1: "194I-PAY-Rent-0%" },
  { id: 29, type: "I7", code: "I7", label: "194A-PAY-Immovable Property", label1: "194A-PAY-Immovable Property-1%" },
  { id: 30, type: "I8", code: "I8", label: "194IA-PAY:rent on Plant and Machinry", label1: "194IA-PAY:rent on Plant and Machinry 5%" },
  { id: 31, type: "I9", code: "I9", label: "194IB-PAY:rent on land &buliding", label1: "194IB-PAY:rent on land &buliding 20%" },

  { id: 32, type: "J5", code: "2J", label: "194JA-PAY-Fees for Technical Services", label1: "194JA-PAY-Fees for Technical Services-2%" },
  { id: 33, type: "J5", code: "5J", label: "194JA-PAY-Fees for Technical Service", label1: "194JA-PAY-Fees for Technical Service-20%" },
  { id: 34, type: "J5", code: "J5", label: "194JB-PAY-Fee for prof. Service", label1: "194JB-PAY-Fee for prof. service -10%" },
  { id: 35, type: "J6", code: "J6", label: "194J-PAY-Fees for Prof/Tech Ser", label1: "194J-PAY-Fees for Prof/Tech Ser-0%" },
  { id: 36, type: "J7", code: "J7", label: "194JA-PAY-Fees for Technical Services", label1: "194JA-PAY-Fees for Technical Services-5%" },
  { id: 37, type: "J9", code: "J9", label: "194JB-PAY-Fee for prof. Service", label1: "194JB-PAY-Fee for prof. service -20%" },

  { id: 38, type: "Q2", code: "Q2", label: "194Q: TDS on Purchase of Goods", label1: "194Q: TDS on Purchase of Goods- 0.1% PAY" },
  { id: 39, type: "Q4", code: "Q4", label: "194Q:TDS on Pur of Goods", label1: "194Q:TDS on Pur of Goods- 0.1% PAY NOPAN" },
  { id: 40, type: "Q6", code: "Q6", label: "194Q: TDS on Purchase of Goods", label1: "194Q: TDS on Purchase of Goods- 5% PAY" },
  { id: 41, type: "Q8", code: "Q8", label: "194Q:TDS on Pur of Goods", label1: "194Q:TDS on Pur of Goods- 20% PAY NOPAN" },

  { id: 42, type: "T4", code: "T4", label: "ST on GTA-PAY-Output", label1: "ST on GTA-PAY-Output" },
  { id: 43, type: "T5", code: "T5", label: "ECS on GTA-PAY-Output", label1: "ECS on GTA-PAY-Output" },
  { id: 44, type: "T6", code: "T6", label: "SEC on GTA-PAY-Output", label1: "SEC on GTA-PAY-Output" },
  { id: 45, type: "T7", code: "T7", label: "ST on GTA-Adv-Output", label1: "ST on GTA-Adv-Output" },
  { id: 46, type: "T8", code: "T8", label: "ECS on GTA-Adv-Output", label1: "ECS on GTA-Adv-Output" },
  { id: 47, type: "T9", code: "T9", label: "SEC on GTA-Adv-Output", label1: "SEC on GTA-Adv-Output" },
  { id: 48, type: "TP", code: "TP", label: "SB CESS on GTA-PAY-Output", label1: "SB CESS on GTA-PAY-Output" },
  { id: 49, type: "TQ", code: "TQ", label: "KK CESS on GTA-PAY-Output", label1: "KK CESS on GTA-PAY-Output" },

  { id: 50, type: "W5", code: "W5", label: "WCT TDS-PAY", label1: "WCT TDS-PAY-4%" },
  { id: 51, type: "W5", code: "W6", label: "WCT TDS-PAY", label1: "WCT TDS-PAY-2%" },
];





 
export const ACCOUNT_GROUP_ENUM = z.enum(
  ACCOUNT_GROUPS.map(a => a.code) as [string, ...string[]]
);
export const RECON_ACCOUNT_ENUM = z.enum(
  RECON_ACCOUNTS.map(a => a.code) as [string, ...string[]]
);
export const PLANT_ENUM = z.enum(
  RECON_ACCOUNTS.map(a => a.code) as [string, ...string[]]
);

export const PURCHASINGORG_ENUM = z.enum(
  RECON_ACCOUNTS.map(a => a.code) as [string, ...string[]]
);

export const RECIPIENTINVOICEENUM = z.enum(
  RECIPIENT_TYPE_INVOICE.map(a => a.type) as [string, ...string[]]
);

export const RECIPIENTPAYMENTENUM = z.enum(
  RECIPIENT_TYPE_PAYMENT.map(a => a.type) as [string, ...string[]]
);

export const PAYMENT_TERMS_ENUM = z.enum(
  PAYMENT_TERMS.map(pt => pt.code) as [string, ...string[]]
);

export const WHT_INV_TYPE_ENUM = z.enum(
  [...new Set(WHT_INV.map(w => w.type))] as [string, ...string[]]
);


export const WHT_INV_CODE_ENUM = z.enum(
  [...new Set(WHT_INV.map(w => w.type))] as [string, ...string[]]
);


export const WHT_PAY_TYPE_ENUM = z.enum(
  [...new Set(WHT_INV.map(w => w.type))] as [string, ...string[]]
);


export const WHT_PAY_CODE_ENUM = z.enum(
  [...new Set(WHT_INV.map(w => w.type))] as [string, ...string[]]
);