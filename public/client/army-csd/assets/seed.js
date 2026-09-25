/*
  SUVIDHA SAINIK demonstrator — seeded data (Army PS-11, CS Dte).

  EVERYTHING HERE IS FICTIONAL. Names, card numbers, PANs, mobiles and
  URCs are synthetic. Entitlement ceilings, prices and volumes are
  ILLUSTRATIVE ONLY — they are not CSD policy values and must be replaced
  with CS Dte figures before any pilot.

  Deterministic: a fixed-seed PRNG means every reload shows the same data.
  Exposes window.CSD.data and window.CSD.DEMO_TODAY.
*/
(function () {
  'use strict';

  var CSD = window.CSD = window.CSD || {};
  CSD.DEMO_TODAY = '2026-09-25';

  // --- deterministic PRNG (mulberry32) ----------------------------------
  var seed = 0x5d11c5;
  function rnd() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  function ri(lo, hi) { return lo + Math.floor(rnd() * (hi - lo + 1)); }
  function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
  function pad(n, w) { var s = String(n); while (s.length < w) s = '0' + s; return s; }
  function addDays(iso, d) {
    var t = new Date(iso + 'T00:00:00Z'); t.setUTCDate(t.getUTCDate() + d);
    return t.toISOString().slice(0, 10);
  }
  function digits(n) { var s = ''; for (var i = 0; i < n; i++) s += ri(0, 9); return s; }

  var TODAY = CSD.DEMO_TODAY;

  // --- Area Depots --------------------------------------------------------
  // Positions are schematic (0-100 grid) for the DRISHTI heatmap, not geo-accurate.
  var depots = [
    { id: 'AD-DLI', name: 'Area Depot Delhi', region: 'North', x: 44, y: 30 },
    { id: 'AD-UDH', name: 'Area Depot Udhampur', region: 'North', x: 36, y: 14 },
    { id: 'AD-LEH', name: 'Area Depot Leh', region: 'North (High Alt)', x: 44, y: 8 },
    { id: 'AD-PNQ', name: 'Area Depot Pune', region: 'South-West', x: 34, y: 62 },
    { id: 'AD-LKO', name: 'Area Depot Lucknow', region: 'Central', x: 54, y: 36 },
    { id: 'AD-GUW', name: 'Area Depot Guwahati', region: 'East', x: 78, y: 36 }
  ];

  // --- URCs ---------------------------------------------------------------
  var urcSpecs = [
    ['AD-DLI', 'Delhi Cantt', 'Delhi Cantt', '110010', 1, 'online'],
    ['AD-DLI', 'Sadar Bazar Stn', 'Delhi Cantt', '110010', 1, 'online'],
    ['AD-DLI', 'Meerut Stn', 'Meerut Cantt', '250001', 1, 'online'],
    ['AD-DLI', 'Ambala Stn', 'Ambala Cantt', '133001', 2, 'online'],
    ['AD-UDH', 'Udhampur Stn', 'Udhampur', '182101', 1, 'online'],
    ['AD-UDH', 'Nagrota Stn', 'Nagrota', '181221', 2, 'intermittent'],
    ['AD-UDH', 'Rajouri Fwd', 'Rajouri', '185131', 3, 'offline-sync'],
    ['AD-UDH', 'Poonch Fwd', 'Poonch', '185101', 3, 'offline-sync'],
    ['AD-LEH', 'Leh Stn', 'Leh', '194101', 2, 'intermittent'],
    ['AD-LEH', 'Kargil Fwd', 'Kargil', '194103', 3, 'offline-sync'],
    ['AD-LEH', 'Nyoma Fwd', 'Nyoma', '194404', 3, 'offline-sync'],
    ['AD-PNQ', 'Pune Cantt', 'Pune', '411001', 1, 'online'],
    ['AD-PNQ', 'Khadki Stn', 'Khadki', '411003', 1, 'online'],
    ['AD-PNQ', 'Ahmednagar Stn', 'Ahmednagar', '414001', 2, 'online'],
    ['AD-PNQ', 'Deolali Stn', 'Deolali', '422401', 2, 'online'],
    ['AD-LKO', 'Lucknow Cantt', 'Lucknow', '226002', 1, 'online'],
    ['AD-LKO', 'Bareilly Stn', 'Bareilly', '243001', 2, 'online'],
    ['AD-LKO', 'Fatehgarh Stn', 'Fatehgarh', '209601', 2, 'intermittent'],
    ['AD-LKO', 'Ranikhet Stn', 'Ranikhet', '263645', 2, 'intermittent'],
    ['AD-GUW', 'Narangi Stn', 'Guwahati', '781171', 1, 'online'],
    ['AD-GUW', 'Tezpur Stn', 'Tezpur', '784001', 2, 'online'],
    ['AD-GUW', 'Rangia Stn', 'Rangia', '781354', 2, 'intermittent'],
    ['AD-GUW', 'Tawang Fwd', 'Tawang', '790104', 3, 'offline-sync'],
    ['AD-GUW', 'Dimapur Stn', 'Dimapur', '797112', 2, 'online']
  ];
  var MGR_FIRST = ['Balwant', 'Gurdev', 'Ramesh', 'Sukhwinder', 'Mahesh', 'Tashi', 'Anil', 'Jagdish', 'Harpal', 'Vinod', 'Prem', 'Dorje'];
  var MGR_LAST = ['Singh', 'Yadav', 'Thapa', 'Negi', 'Rawat', 'Kumar', 'Namgyal', 'Patil', 'Gurung', 'Bisht'];
  var MGR_RANK = ['Sub', 'Nb Sub', 'Sub Maj'];
  var OFFS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  var urcs = urcSpecs.map(function (s, i) {
    var depot = depots.filter(function (d) { return d.id === s[0]; })[0];
    var code = 'URC-' + pad(1040 + i * 7, 4);
    var mf = pick(MGR_FIRST), ml = pick(MGR_LAST);
    return {
      id: code,
      code: code,
      name: s[1] + ' URC',
      depotId: s[0],
      station: s[2],
      address: 'Canteen Block, ' + s[1] + ', ' + s[2],
      pin: s[3],
      email: 'urc' + (1040 + i * 7) + '@csd-demo.invalid',
      mobile: '98' + digits(2) + 'XXXX' + digits(2),
      weeklyOff: pick(OFFS),
      timings: s[5] === 'offline-sync' ? '0900–1300 hrs' : '0900–1330, 1500–1800 hrs',
      tier: s[4],
      connectivity: s[5],
      lastSync: s[5] === 'offline-sync' ? addDays(TODAY, -1) + 'T21:40:00' : TODAY + 'T' + pad(ri(9, 12), 2) + ':' + pad(ri(0, 59), 2) + ':00',
      // schematic position near parent depot
      x: depot.x + ri(-5, 5),
      y: depot.y + ri(-4, 4),
      serviceStatus: 'open',
      beneficiariesAttached: ri(900, 6200),
      manager: {
        rank: pick(MGR_RANK),
        name: mf + ' ' + ml,
        effectiveFrom: addDays(TODAY, -ri(60, 700)),
        mobile: '94' + digits(2) + 'XXXX' + digits(2),
        email: 'mgr.' + code.toLowerCase() + '@csd-demo.invalid'
      },
      // "My QD" — term as named in PS-11. Modelled here as the URC's current
      // quarterly demand indent; exact definition to be confirmed with CS Dte.
      qd: {
        quarter: 'Q3 FY26-27',
        indentValueLakh: ri(18, 140),
        status: pick(['Submitted', 'Approved', 'Partially supplied', 'Draft']),
        lastIndentDate: addDays(TODAY, -ri(5, 40))
      }
    };
  });
  urcs[6].serviceStatus = 'stock-critical';
  urcs[10].serviceStatus = 'sync-overdue';
  urcs[10].lastSync = addDays(TODAY, -3) + 'T19:10:00';
  urcs[17].serviceStatus = 'stock-critical';
  urcs[22].serviceStatus = 'closed-today';

  // Bronze / Steel cards held at URC level — categories exactly as listed in PS-11.
  urcs.forEach(function (u) {
    function card(prefix, cat) {
      return { category: cat, cardId: prefix + '-' + digits(6), number: digits(4) + ' ' + digits(4) + ' ' + digits(4), validity: addDays(TODAY, ri(-30, 900)) };
    }
    u.bronzeCards = [];
    var nb = ri(3, 6);
    for (var i = 0; i < nb; i++) u.bronzeCards.push(card('BRZ', i % 2 ? 'liquor' : 'grocery'));
    u.steelCards = [];
    var ns = ri(2, 4);
    for (var j = 0; j < ns; j++) u.steelCards.push(card('STL', 'grocery'));
  });

  // --- Beneficiaries --------------------------------------------------------
  var FIRST = ['Arjun', 'Vikram', 'Rohit', 'Sanjay', 'Deepak', 'Manoj', 'Karan', 'Rajesh', 'Suresh', 'Amit', 'Pradeep', 'Naveen', 'Harish', 'Kuldeep', 'Tenzin', 'Bhupinder', 'Ravi', 'Ashok', 'Mohan', 'Lalit'];
  var FIRST_F = ['Sunita', 'Kamla', 'Meena', 'Savitri', 'Parveen', 'Geeta'];
  var LAST = ['Sharma', 'Singh', 'Chauhan', 'Rathore', 'Thakur', 'Nair', 'Pillai', 'Joshi', 'Bhatt', 'Kaur', 'Dogra', 'Gill', 'Rana', 'Menon', 'Mishra'];
  var CATS = [
    { key: 'serving-officer', label: 'Serving Officer', ranks: ['Capt', 'Maj', 'Lt Col', 'Col'], pay: ['L-10B', 'L-11', 'L-12A', 'L-13'] },
    { key: 'serving-jco', label: 'Serving JCO', ranks: ['Nb Sub', 'Sub', 'Sub Maj'], pay: ['L-6', 'L-7', 'L-8'] },
    { key: 'serving-or', label: 'Serving OR', ranks: ['Sep', 'Nk', 'Hav'], pay: ['L-3', 'L-4', 'L-5'] },
    { key: 'esm', label: 'Ex-Serviceman', ranks: ['Hav (Retd)', 'Sub (Retd)', 'Col (Retd)', 'Nk (Retd)'], pay: ['L-5', 'L-8', 'L-13', 'L-4'] },
    { key: 'widow', label: 'War Widow', ranks: ['—'], pay: ['—'] }
  ];
  // Illustrative monthly ceilings (NOT policy values).
  function ceilings(catKey, pay) {
    var officer = catKey === 'serving-officer' || /L-1[0-3]/.test(pay);
    var jco = catKey === 'serving-jco' || /L-[678]/.test(pay);
    return {
      grocery: officer ? 15000 : jco ? 11000 : 8000,
      liquor: catKey === 'widow' ? 0 : officer ? 12 : jco ? 10 : 8,
      afd2: officer ? 200000 : jco ? 150000 : 100000
    };
  }

  var beneficiaries = [];
  for (var b = 0; b < 44; b++) {
    var cat = b < 10 ? CATS[0] : b < 20 ? CATS[1] : b < 30 ? CATS[2] : b < 40 ? CATS[3] : CATS[4];
    var female = cat.key === 'widow';
    var name = (female ? pick(FIRST_F) : pick(FIRST)) + ' ' + pick(LAST);
    var home = urcs[(b * 5 + 3) % urcs.length];
    var pay = cat.key === 'widow' ? '—' : pick(cat.pay);
    var doj = addDays('2000-01-01', ri(0, 7000));
    var serving = cat.key.indexOf('serving') === 0;
    var dor = serving ? addDays(TODAY, ri(200, 5000)) : addDays(TODAY, -ri(400, 6000));
    var ceil = ceilings(cat.key, pay);
    var gUsed = ri(0, ceil.grocery);
    var lUsed = ceil.liquor ? ri(0, ceil.liquor) : 0;
    var aUsed = ri(0, 1) ? ri(0, ceil.afd2) : 0;
    var cardValidity = addDays(TODAY, ri(-20, 1400));
    var id = 'BEN-' + pad(20410 + b * 13, 6);
    var lastPurchases = [];
    var nP = ri(2, 5);
    for (var p = 0; p < nP; p++) {
      lastPurchases.push({ date: addDays(TODAY, -ri(1, 60)), urcId: home.id, category: pick(['grocery', 'grocery', 'grocery', 'liquor']), amount: ri(400, 4800) });
    }
    lastPurchases.sort(function (a, c) { return a.date < c.date ? 1 : -1; });
    beneficiaries.push({
      id: id,
      name: name,
      category: cat.key,
      categoryLabel: cat.label,
      rank: pick(cat.ranks),
      payLevel: pay,
      doj: cat.key === 'widow' ? '—' : doj,
      dor: cat.key === 'widow' ? '—' : dor,
      email: name.toLowerCase().replace(/ /g, '.') + '@mail-demo.invalid',
      mobile: '9' + digits(3) + 'XXXX' + digits(2),
      pan: 'XXXXX' + digits(4) + String.fromCharCode(65 + ri(0, 25)),
      barcode: 'CSD' + digits(10),
      groceryCard: { id: 'GC-' + digits(8), chip: 'CHP-' + digits(10), validity: cardValidity },
      liquorCard: ceil.liquor ? { id: 'LC-' + digits(8), chip: 'CHP-' + digits(10), validity: cardValidity } : null,
      status: cardValidity < TODAY ? 'renewal-due' : 'active',
      homeUrcId: home.id,
      entitlement: {
        period: 'Sep 2026',
        grocery: { overall: ceil.grocery, balance: ceil.grocery - gUsed, unit: '₹' },
        liquor: { overall: ceil.liquor, balance: ceil.liquor - lUsed, unit: 'units' },
        afd2: { overall: ceil.afd2, balance: ceil.afd2 - aUsed, unit: '₹' },
        afd1: { eligible: cat.key !== 'widow', note: 'AFD-I items (vehicles / high-value) — eligibility per rank & service' }
      },
      lastPurchases: lastPurchases,
      registeredStation: home.station,
      consentGiven: b % 7 !== 0
    });
  }
  // The demo protagonist — first beneficiary, predictable.
  var demoUser = beneficiaries[3];
  demoUser.name = 'Rohit Chauhan';
  demoUser.rank = 'Maj';
  demoUser.email = 'rohit.chauhan@mail-demo.invalid';
  demoUser.consentGiven = false;
  demoUser.status = 'active';
  demoUser.homeUrcId = urcs[0].id;
  demoUser.registeredStation = urcs[0].station;
  demoUser.entitlement.liquor.balance = demoUser.entitlement.liquor.overall;
  demoUser.entitlement.grocery.balance = Math.round(demoUser.entitlement.grocery.overall * 0.62);
  demoUser.lastPurchases = [
    { date: addDays(TODAY, -6), urcId: urcs[0].id, category: 'grocery', amount: 3420 },
    { date: addDays(TODAY, -19), urcId: urcs[0].id, category: 'grocery', amount: 2280 },
    { date: addDays(TODAY, -33), urcId: urcs[0].id, category: 'liquor', amount: 1920 }
  ];
  demoUser.groceryCard.validity = '2028-03-31';
  if (demoUser.liquorCard) demoUser.liquorCard.validity = '2028-03-31';

  // Deceased-flag case (SPARSH/PCDA record says deceased; card never surrendered).
  beneficiaries[33].deceasedFlag = { source: 'SPARSH', recordedOn: addDays(TODAY, -142) };
  beneficiaries[33].status = 'deceased-flag';

  // --- SKUs & stock ---------------------------------------------------------
  var skuSpecs = [
    ['SKU-1001', 'Basmati Rice 5 kg', 'grocery', 520, false],
    ['SKU-1002', 'Refined Oil 1 L', 'grocery', 145, false],
    ['SKU-1003', 'Toor Dal 1 kg', 'grocery', 138, false],
    ['SKU-1004', 'Atta 10 kg', 'grocery', 395, false],
    ['SKU-1005', 'Detergent 2 kg', 'grocery', 260, false],
    ['SKU-1006', 'Toothpaste 150 g', 'grocery', 88, false],
    ['SKU-1007', 'Tea 500 g', 'grocery', 210, false],
    ['SKU-1008', 'Milk Powder 1 kg', 'grocery', 410, true],
    ['SKU-1009', 'Biscuits Family Pack', 'grocery', 95, true],
    ['SKU-1010', 'Pressure Cooker 5 L', 'grocery', 1450, false],
    ['SKU-1011', 'Woollen Socks (pair)', 'grocery', 180, false],
    ['SKU-1012', 'Thermal Innerwear', 'grocery', 690, false],
    ['SKU-2001', 'Whisky 750 ml', 'liquor', 640, false],
    ['SKU-2002', 'Rum 750 ml', 'liquor', 330, false],
    ['SKU-2003', 'Beer 650 ml', 'liquor', 95, false],
    ['SKU-3001', 'LED TV 43"', 'afd', 24500, false],
    ['SKU-3002', 'Refrigerator 260 L', 'afd', 21800, false]
  ];
  var skus = skuSpecs.map(function (s) { return { id: s[0], name: s[1], category: s[2], price: s[3], perishable: s[4] }; });

  // Weekly sales history (12 weeks) per depot per SKU — festival/winter seasonality baked in.
  var WEEKS = 12;
  var salesHistory = {};
  depots.forEach(function (d) {
    salesHistory[d.id] = {};
    skus.forEach(function (s) {
      var base = s.category === 'afd' ? ri(2, 9) : s.category === 'liquor' ? ri(300, 900) : ri(200, 1400);
      var arr = [];
      for (var w = 0; w < WEEKS; w++) {
        var season = 1;
        if ((s.id === 'SKU-1011' || s.id === 'SKU-1012') && (d.id === 'AD-LEH' || d.id === 'AD-UDH')) season = 1 + w * 0.09; // winter build-up
        if (s.id === 'SKU-1010' || s.id === 'SKU-3001') season = 1 + Math.max(0, w - 7) * 0.12; // festive run-up (Dussehra/Diwali)
        arr.push(Math.round(base * season * (0.88 + rnd() * 0.24)));
      }
      salesHistory[d.id][s.id] = arr;
    });
  });
  // Depot stock on hand (units) — some deliberate imbalances for redistribution.
  var depotStock = {};
  depots.forEach(function (d) {
    depotStock[d.id] = {};
    skus.forEach(function (s) {
      var h = salesHistory[d.id][s.id];
      var avg = h.slice(-4).reduce(function (a, c) { return a + c; }, 0) / 4;
      depotStock[d.id][s.id] = Math.round(avg * (2.8 + rnd() * 2.6));
    });
  });
  depotStock['AD-LEH']['SKU-1012'] = 140;   // thermal innerwear short at Leh before winter
  depotStock['AD-DLI']['SKU-1012'] = 5200;  // surplus in Delhi
  depotStock['AD-UDH']['SKU-1011'] = 90;
  depotStock['AD-LKO']['SKU-1011'] = 3100;
  depotStock['AD-PNQ']['SKU-1008'] = 3900;  // perishable overstock (expiry risk)
  depotStock['AD-GUW']['SKU-1008'] = 60;

  // --- Transactions & BADE flags -------------------------------------------
  var transactions = [];
  for (var t = 0; t < 90; t++) {
    var ben = beneficiaries[t % 40];
    var u = urcs.filter(function (x) { return x.id === ben.homeUrcId; })[0];
    var c = pick(['grocery', 'grocery', 'grocery', 'liquor']);
    if (c === 'liquor' && !ben.liquorCard) c = 'grocery';
    transactions.push({
      id: 'TXN-' + pad(880100 + t, 7),
      ts: addDays(TODAY, -ri(0, 6)) + 'T' + pad(ri(9, 17), 2) + ':' + pad(ri(0, 59), 2) + ':00',
      beneficiaryId: ben.id, urcId: u.id, category: c,
      amount: c === 'liquor' ? ri(600, 4200) : ri(300, 5200),
      factors: u.tier === 1 ? ['F1', 'F2'] : u.tier === 2 ? ['F1', 'F2'] : ['F1'],
      status: 'completed'
    });
  }
  transactions.sort(function (a, c) { return a.ts < c.ts ? 1 : -1; });

  // Pre-seeded BADE flags awaiting URC Manager confirmation — each with evidence.
  var flags = [
    { id: 'FLG-0101', type: 'simultaneous-use', severity: 'high', beneficiaryId: beneficiaries[12].id, urcId: urcs[0].id, ts: TODAY + 'T10:42:00',
      evidence: ['Same liquor card presented at ' + urcs[0].name + ' (10:42) and ' + urcs[15].name + ' (10:51) — 9 minutes apart, ~500 km apart', 'Physically impossible travel time → possible card clone or data compromise'], status: 'held' },
    { id: 'FLG-0102', type: 'deceased-record', severity: 'high', beneficiaryId: beneficiaries[33].id, urcId: urcs[(33 * 5 + 3) % urcs.length].id, ts: TODAY + 'T11:05:00',
      evidence: ['SPARSH record marks beneficiary deceased 142 days ago', 'Card not surrendered; 3 grocery purchases since that date'], status: 'held' },
    { id: 'FLG-0103', type: 'volume-spike', severity: 'medium', beneficiaryId: beneficiaries[21].id, urcId: urcs[(21 * 5 + 3) % urcs.length].id, ts: TODAY + 'T09:58:00',
      evidence: ['Liquor units this month: 8 of 8 in 4 visits', '12-month average: 2.1 units/month — 3.8× usual'], status: 'held' },
    { id: 'FLG-0104', type: 'geo-inconsistent', severity: 'medium', beneficiaryId: beneficiaries[36].id, urcId: urcs[19].id, ts: addDays(TODAY, -1) + 'T16:20:00',
      evidence: ['Registered station: ' + beneficiaries[36].registeredStation + '; purchase at ' + urcs[19].name, 'No purchase at this URC in prior 24 months; no posting/leave record linked'], status: 'held' },
    { id: 'FLG-0105', type: 'volume-spike', severity: 'low', beneficiaryId: beneficiaries[5].id, urcId: urcs[(5 * 5 + 3) % urcs.length].id, ts: addDays(TODAY, -1) + 'T12:14:00',
      evidence: ['Grocery spend ₹13,900 in 9 days vs 6-month average ₹6,200/month', 'Pattern coincides with festival week — may be legitimate'], status: 'held' },
    { id: 'FLG-0106', type: 'expired-card', severity: 'low', beneficiaryId: beneficiaries[27].id, urcId: urcs[(27 * 5 + 3) % urcs.length].id, ts: addDays(TODAY, -2) + 'T15:02:00',
      evidence: ['Card validity lapsed; renewal application not found on Renewal Portal'], status: 'held' }
  ];

  // --- Grievances (SAMADHAN) -----------------------------------------------
  var G = [
    ['app', 'My grocery balance shows zero but I have not purchased anything this month. Please check entitlement.', 3],
    ['ivr', 'Liquor card chip not reading at URC counter for last two visits, told to come again.', 12],
    ['sms', 'URC timings changed without notice, closed on Sunday also. Veterans travelling 40 km find it shut.', 17],
    ['app', 'Pressure cooker sold at higher price than printed MRP at the counter. Bill attached.', 0],
    ['app', 'Card renewal applied 3 months ago on renewal portal, still no card. Cannot buy anything.', 35],
    ['ivr', 'Mera husband ka dehant ho gaya, widow card ke liye kahan apply karna hai? Koi madad nahi kar raha.', 40],
    ['app', 'Rice packets received were damaged and had insects. Quality issue at URC.', 9],
    ['sms', 'Where is the nearest URC to Dehradun Clement Town? Need timings.', 29],
    ['app', 'URC staff rude and refused to give bill. This is harassment, want action.', 14],
    ['app', 'AFD II balance not updated after cancelled order of refrigerator. Money stuck.', 2],
    ['ivr', 'I am 78 years old veteran, cannot travel, no one answers phone at canteen. Please help urgently.', 31],
    ['app', 'Thermal innerwear out of stock at Leh for three weeks, winter starting. Troops need it.', 8],
    ['sms', 'Card validity date wrong in app, shows expired but my card says 2028.', 22],
    ['app', 'Suggestion: please allow online pre-order and pickup to reduce queue time.', 1],
    ['app', 'Liquor quota deducted twice for one purchase on 18 Sep.', 16],
    ['ivr', 'Milk powder near expiry date being sold at Pune URC.', 11],
    ['app', 'OTP not coming on registered mobile, number changed after retirement.', 24],
    ['app', 'Same issue again — insects in atta packet, third complaint this year from our URC.', 9],
    ['sms', 'Bhai canteen ka weekly off kya hai Rangia mein?', 21],
    ['app', 'Charged for 2 bottles, received 1. Billing error at counter.', 15]
  ];
  var RESOLVED_IDX = [2, 9, 13, 17];
  var grievances = G.map(function (g, i) {
    var ben = beneficiaries[(i * 7 + 2) % beneficiaries.length];
    var age = ri(0, 12);
    if (i === 4) age = 26;          // the long-pending renewal
    if (i === 7 || i === 18) age = 0; // info queries arriving today (auto-answer demo)
    return {
      id: 'GRV-' + pad(5301 + i, 5),
      channel: g[0],
      text: g[1],
      beneficiaryId: ben.id,
      urcId: urcs[g[2] % urcs.length].id,
      lodgedOn: addDays(TODAY, -age),
      stage: age > 9 ? pick(['resolved', 'under-investigation', 'acknowledged']) : age > 3 ? pick(['acknowledged', 'under-investigation']) : 'lodged',
      assignedTo: null,
      history: [{ ts: addDays(TODAY, -age) + 'T10:00:00', stage: 'lodged', by: 'System (' + g[0].toUpperCase() + ' intake)' }]
    };
  });
  RESOLVED_IDX.forEach(function (i) {
    var g = grievances[i];
    g.stage = 'resolved'; g.assignedTo = 'Maj A. Verma';
    g.history.push({ ts: addDays(TODAY, -1) + 'T15:30:00', stage: 'resolved', by: 'Maj A. Verma', remarks: 'Resolved per precedent; beneficiary informed by SMS.' });
  });

  // Resolved precedents (for precedent matching).
  var precedents = [
    { id: 'PRC-011', category: 'entitlement', summary: 'Grocery balance shown zero after month roll-over', resolution: 'Month-start ledger sync failed at URC; re-synced and balance restored. Beneficiary informed by SMS.', days: 2 },
    { id: 'PRC-014', category: 'card', summary: 'Card chip not reading at counter', resolution: 'Chip reader firmware at URC outdated; card verified OK via barcode fallback; reader replaced by Area Depot.', days: 6 },
    { id: 'PRC-019', category: 'pricing', summary: 'Item billed above printed MRP', resolution: 'POS price master not updated after CSD price revision; refund of difference; price master pushed to all URCs in depot.', days: 4 },
    { id: 'PRC-022', category: 'quality', summary: 'Infested grain packets', resolution: 'Batch quarantined at URC and Area Depot; vendor debited; quality flag raised on vendor score.', days: 7 },
    { id: 'PRC-027', category: 'card', summary: 'Card renewal pending beyond 60 days', resolution: 'Application stuck at document verification; escalated to CS Dte card cell; card dispatched in 9 days.', days: 12 },
    { id: 'PRC-031', category: 'urc-conduct', summary: 'Staff refused bill / misbehaviour', resolution: 'Station Commander informed; URC Manager counselled; CCTV reviewed; written apology and bill issued.', days: 9 },
    { id: 'PRC-033', category: 'billing', summary: 'Liquor quota deducted twice', resolution: 'Duplicate ledger entry reversed; POS retry logic fix logged with vendor of POS software.', days: 3 },
    { id: 'PRC-040', category: 'welfare', summary: 'Widow unable to obtain card', resolution: 'Routed to Zila Sainik Board + record office; assisted application at nearest URC; card issued in 21 days.', days: 21 },
    { id: 'PRC-044', category: 'information', summary: 'Nearest URC / timings query', resolution: 'Answered automatically from URC master.', days: 0 }
  ];

  // --- Vendors & consignments (DRISHTIKON) --------------------------------
  var vendorNames = ['Aravali Foods', 'Konkan Oils', 'Himgiri Woollens', 'Satluj Agro', 'Deccan Home Appliances', 'Brahmaputra Beverages', 'Shivalik Distillers', 'Narmada Personal Care', 'Vindhya Staples', 'Nilgiri Tea Co', 'Ganga Dairy', 'Thar Electronics'];
  var vendors = vendorNames.map(function (n, i) {
    return {
      id: 'VND-' + pad(301 + i, 3),
      name: n + ' (fictional)',
      params: {
        timeliness: ri(58, 98),
        quantityAccuracy: ri(80, 100),
        qualityRejection: ri(0, 9),   // % rejected — lower is better
        priceCompliance: ri(70, 100),
        documentation: ri(55, 100),
        sustainability: ri(30, 95)
      },
      consignmentsOpen: ri(1, 7)
    };
  });
  vendors[3].params.qualityRejection = 11; vendors[3].params.timeliness = 61;   // Satluj Agro — the problem vendor (insects complaints)
  vendors[10].params.qualityRejection = 7;

  var consignments = [];
  for (var cn = 0; cn < 22; cn++) {
    var v = vendors[cn % vendors.length];
    var d = depots[cn % depots.length];
    var st = pick(['dispatched', 'in-transit', 'in-transit', 'at-depot-gate', 'received', 'delayed']);
    consignments.push({
      id: 'CNS-' + pad(7701 + cn, 5), vendorId: v.id, depotId: d.id, skuId: skus[cn % 12].id,
      qty: ri(200, 4000), status: st, eta: addDays(TODAY, ri(-3, 6)),
      invoicePrice: null, contractPrice: null
    });
  }
  // Price benchmarks: CSD procurement vs GeM vs open-market MRP (illustrative).
  var priceBench = skus.filter(function (s) { return s.category !== 'liquor'; }).map(function (s) {
    var csd = s.price;
    var gem = Math.round(csd * (0.93 + rnd() * 0.16));
    var mrp = Math.round(csd * (1.12 + rnd() * 0.22));
    var prev = Math.round(csd * (0.92 + rnd() * 0.1));
    return { skuId: s.id, csd: csd, gem: gem, mrp: mrp, prevPeriod: prev };
  });
  priceBench[9].gem = Math.round(priceBench[9].csd * 0.84); // pressure cooker — GeM notably cheaper

  // --- Policies & FAQs (COMMON) -------------------------------------------
  var policies = [
    { group: 'Indl Related', title: 'Who is entitled to CSD facilities', body: 'Serving personnel, ex-servicemen, war widows and eligible dependents, per extant CS Dte policy. (Placeholder — CS Dte text to be inserted.)' },
    { group: 'Indl Related', title: 'Updating registered mobile after retirement', body: 'Change is made through the Renewal Portal with record-office verification. OTP-based services use the registered mobile only.' },
    { group: 'URC Related', title: 'URC timings and weekly off', body: 'Each URC publishes its timings and weekly off; changes must be notified in-app 7 days in advance. (Demonstrator rule.)' },
    { group: 'Card Related', title: 'Card renewal', body: 'Renew through the Renewal Portal before validity lapses. Expired cards are flagged at the counter, never silently refused.' },
    { group: 'Card Related', title: 'Lost or damaged card', body: 'Report in-app; the card is suspended immediately and a replacement request raised.' },
    { group: 'Misc', title: 'Data we hold about you', body: 'Only the fields you see under My Card. No biometric is ever stored by the canteen system. OTP logs purge after 30 days.' },
    { group: 'FAQs', title: 'Do I have to use the app?', body: 'No. Your physical card continues to work unchanged. The app is an addition, not a replacement.' },
    { group: 'FAQs', title: 'Why was my purchase held?', body: 'An unusual pattern was detected. It is not blocked — the URC Manager confirms it with you at the counter.' }
  ];

  CSD.data = {
    depots: depots,
    urcs: urcs,
    beneficiaries: beneficiaries,
    demoUserId: demoUser.id,
    demoUrcId: urcs[0].id,
    skus: skus,
    salesHistory: salesHistory,
    salesWeeks: WEEKS,
    depotStock: depotStock,
    transactions: transactions,
    flags: flags,
    grievances: grievances,
    precedents: precedents,
    vendors: vendors,
    consignments: consignments,
    priceBench: priceBench,
    policies: policies,
    redistributions: [],   // accepted/declined recommendations are recorded here
    posSessions: [],
    audit: []
  };
})();
