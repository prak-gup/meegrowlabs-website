/*
  SUVIDHA SAINIK engine (demonstrator).

  DOCTRINE
    1. THE CARD STAYS — verification is layered on the card event, never a new card.
    2. VERIFY THE PERSON, NOT JUST THE CARD — factor requirements depend on URC tier
       and transaction value/category.
    3. FLAG, DON'T BLOCK — anomalies HOLD a sale for the URC Manager; nothing is
       refused by the machine alone.
    4. THE AI ADVISES, A NAMED HUMAN DECIDES — every advisory carries plain-language
       evidence with the numbers used; every state change requires a named person
       and appends a frozen audit entry.

  All "AI" here is transparent rule/statistics logic so a reviewer can see exactly
  why each output was produced. In a pilot, trained models replace the internals;
  the explainability contract (evidence[] on every output) stays.

  Depends on seed.js (window.CSD.data). Exposes window.CSD.engine.
*/
(function () {
  'use strict';

  var CSD = window.CSD = window.CSD || {};
  var data = CSD.data;
  var TODAY = CSD.DEMO_TODAY;

  // Demo OTP — displayed on screen in the demonstrator. Production = NIC SMS gateway.
  var DEMO_OTP = '246810';
  var LIQUOR_BIOMETRIC_THRESHOLD = 5000; // ₹ — from concept paper §5.4 (Tier 1)

  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function nowIso() {
    var t = new Date();
    return TODAY + 'T' + pad2(t.getHours()) + ':' + pad2(t.getMinutes()) + ':' + pad2(t.getSeconds());
  }
  function daysBetween(a, b) {
    return Math.round((new Date(b + 'T00:00:00Z') - new Date(a.slice(0, 10) + 'T00:00:00Z')) / 86400000);
  }
  function requireName(name, what) {
    if (!name || !String(name).trim()) throw new Error((what || 'This action') + ' requires a named officer.');
    return String(name).trim();
  }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  // ---------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------
  function audit(actor, role, action, target, remarks, extra) {
    var entry = { ts: nowIso(), actor: actor, role: role, action: action, target: target, remarks: remarks || '' };
    if (extra) for (var k in extra) entry[k] = extra[k];
    entry = Object.freeze(entry);
    data.audit.unshift(entry);
    return entry;
  }

  // ---------------------------------------------------------------------
  // Lookups
  // ---------------------------------------------------------------------
  function beneficiary(id) { return byId(data.beneficiaries, id); }
  function urc(id) { return byId(data.urcs, id); }
  function depot(id) { return byId(data.depots, id); }
  function sku(id) { return byId(data.skus, id); }
  function vendor(id) { return byId(data.vendors, id); }
  function beneficiaryByBarcode(code) {
    for (var i = 0; i < data.beneficiaries.length; i++) if (data.beneficiaries[i].barcode === code) return data.beneficiaries[i];
    return null;
  }
  function nearestUrc(beneficiaryId) {
    var b = beneficiary(beneficiaryId);
    return b ? urc(b.homeUrcId) : null;
  }

  // ---------------------------------------------------------------------
  // LOGIN — PS-11 AIM PLUS: SSO + cardless access
  // ---------------------------------------------------------------------
  // method: 'card' (barcode + OTP), 'cardless' (registered mobile + OTP), 'sso' (demo SSO assertion)
  function startLogin(method, identifier) {
    var b = null;
    if (method === 'card') b = beneficiaryByBarcode(identifier);
    else if (method === 'cardless' || method === 'sso') b = beneficiary(identifier) || beneficiary(data.demoUserId);
    if (!b) throw new Error('No beneficiary record matches that identifier.');
    return {
      beneficiaryId: b.id,
      method: method,
      otpSentTo: b.mobile,
      demoOtp: DEMO_OTP,
      needsConsent: !b.consentGiven,
      evidence: method === 'sso'
        ? ['SSO assertion accepted from the (simulated) Army identity provider', 'Step-up OTP still required for entitlement and payment screens']
        : ['OTP sent to registered mobile ' + b.mobile + ' (from SPARSH/AFD record, not typed by user)']
    };
  }
  function completeLogin(login, otp) {
    if (String(otp) !== DEMO_OTP) {
      audit('beneficiary', 'Beneficiary', 'LOGIN_FAILED', login.beneficiaryId, 'Wrong OTP via ' + login.method);
      throw new Error('OTP does not match.');
    }
    audit(beneficiary(login.beneficiaryId).name, 'Beneficiary', 'LOGIN', login.beneficiaryId, 'Method: ' + login.method);
    return beneficiary(login.beneficiaryId);
  }
  function recordConsent(beneficiaryId) {
    var b = beneficiary(beneficiaryId);
    b.consentGiven = true;
    return audit(b.name, 'Beneficiary', 'DPDP_CONSENT', beneficiaryId, 'Consent to process data shown under My Card');
  }

  // ---------------------------------------------------------------------
  // PRAMANIK — point-of-sale verification (Pillar II)
  // ---------------------------------------------------------------------
  // Factor policy per URC tier (concept paper §5.4):
  //   Tier 1: F1 + F2; F3 (biometric yes/no) for liquor > ₹5,000
  //   Tier 2: F1 + F2
  //   Tier 3: F1 only + offline anomaly flag; F2 queued until sync
  function requiredFactors(urcObj, category, amount) {
    var req = ['F1'];
    var why = ['F1 card scan is always required — the card stays'];
    if (urcObj.tier === 3) {
      why.push('Tier 3 URC (' + urcObj.connectivity + '): OTP deferred to end-of-day sync; offline anomaly check applies');
      return { factors: req, evidence: why, deferred: ['F2'] };
    }
    req.push('F2');
    why.push('Tier ' + urcObj.tier + ' URC: registered-mobile OTP proves the person, not just the card');
    if (urcObj.tier === 1 && category === 'liquor' && amount > LIQUOR_BIOMETRIC_THRESHOLD) {
      req.push('F3');
      why.push('Liquor purchase ' + inr(amount) + ' exceeds ' + inr(LIQUOR_BIOMETRIC_THRESHOLD) + ' at a Tier 1 URC: Aadhaar yes/no check (no biometric stored)');
    }
    return { factors: req, evidence: why, deferred: [] };
  }

  var sessionSeq = 1;
  function posStart(urcId, barcode, category, amount) {
    var u = urc(urcId);
    var b = beneficiaryByBarcode(barcode);
    if (!u) throw new Error('Unknown URC.');
    if (!b) throw new Error('Card not found in CSD card database.');
    var req = requiredFactors(u, category, Number(amount));
    var s = {
      id: 'POS-' + TODAY.replace(/-/g, '') + '-' + (100 + sessionSeq++),
      urcId: urcId, beneficiaryId: b.id, category: category, amount: Number(amount),
      required: req.factors, deferred: req.deferred, policyEvidence: req.evidence,
      passed: { F1: true }, flags: [], status: 'verifying', createdAt: nowIso()
    };
    s.entitlementCheck = entitlementCheck(b, category, s.amount);
    data.posSessions.unshift(s);
    audit(u.manager.rank + ' ' + u.manager.name, 'URC Manager', 'CARD_SCAN_F1', s.id, b.id + ' at ' + u.code);
    return s;
  }
  function entitlementCheck(b, category, amount) {
    var e = b.entitlement[category === 'liquor' ? 'liquor' : category === 'afd' ? 'afd2' : 'grocery'];
    if (category === 'liquor') {
      var units = Math.max(1, Math.round(amount / 650));
      return { ok: units <= e.balance, evidence: 'Liquor balance ' + e.balance + ' of ' + e.overall + ' units; this bill ≈ ' + units + ' unit(s)' };
    }
    return { ok: amount <= e.balance, evidence: 'Balance ' + inr(e.balance) + ' of ' + inr(e.overall) + '; bill ' + inr(amount) };
  }
  function posVerifyOtp(sessionId, otp) {
    var s = byId(data.posSessions, sessionId);
    if (String(otp) !== DEMO_OTP) { audit('system', 'PRAMANIK', 'F2_FAILED', sessionId, 'OTP mismatch'); throw new Error('OTP does not match.'); }
    s.passed.F2 = true;
    audit('system', 'PRAMANIK', 'F2_PASSED', sessionId, 'OTP on registered mobile');
    return s;
  }
  function posVerifyBiometric(sessionId, simulatedResult) {
    var s = byId(data.posSessions, sessionId);
    var ok = simulatedResult !== false;
    s.passed.F3 = ok;
    audit('system', 'PRAMANIK', ok ? 'F3_YES' : 'F3_NO', sessionId, 'UIDAI yes/no response only — no biometric stored');
    if (!ok) throw new Error('Aadhaar check returned NO. Sale cannot proceed on F3.');
    return s;
  }
  function factorsSatisfied(s) {
    return s.required.every(function (f) { return s.passed[f] === true; });
  }

  // BADE — behavioural anomaly check at the moment of sale. Returns flags with evidence.
  function badeCheck(sessionId) {
    var s = byId(data.posSessions, sessionId);
    var b = beneficiary(s.beneficiaryId);
    var u = urc(s.urcId);
    var flags = [];
    if (b.deceasedFlag) {
      flags.push({ type: 'deceased-record', severity: 'high', evidence: ['Beneficiary marked deceased in ' + b.deceasedFlag.source + ' on ' + b.deceasedFlag.recordedOn, 'Card has not been surrendered'] });
    }
    if (b.homeUrcId !== u.id && b.registeredStation !== u.station) {
      flags.push({ type: 'geo-inconsistent', severity: 'medium', evidence: ['Registered station ' + b.registeredStation + '; purchase at ' + u.station, 'No posting / leave movement linked (demo: not integrated)'] });
    }
    if (b.status === 'renewal-due') {
      flags.push({ type: 'expired-card', severity: 'low', evidence: ['Card validity lapsed ' + b.groceryCard.validity] });
    }
    if (!s.entitlementCheck.ok) {
      flags.push({ type: 'over-entitlement', severity: 'medium', evidence: [s.entitlementCheck.evidence] });
    }
    var recent = b.lastPurchases.filter(function (p) { return daysBetween(p.date, TODAY) <= 10; });
    if (recent.length >= 3) {
      flags.push({ type: 'volume-spike', severity: 'low', evidence: [recent.length + ' purchases in the last 10 days (typical: 1–2)'] });
    }
    s.flags = flags;
    s.status = flags.length ? 'held' : 'ready';
    audit('system', 'BADE', flags.length ? 'SALE_HELD' : 'SALE_CLEAR', sessionId, flags.length ? flags.map(function (f) { return f.type; }).join(', ') : 'No anomaly');
    return s;
  }

  // Manager decision on a held sale — never automatic.
  function managerDecide(sessionId, managerName, decision, remarks) {
    var s = byId(data.posSessions, sessionId);
    requireName(managerName, 'Releasing a held sale');
    if (!remarks || !String(remarks).trim()) throw new Error('Remarks are mandatory for a held-sale decision.');
    if (decision !== 'release' && decision !== 'decline') throw new Error('Decision must be release or decline.');
    s.status = decision === 'release' ? 'ready' : 'declined';
    s.managerDecision = { by: managerName, decision: decision, remarks: remarks };
    return audit(managerName, 'URC Manager', decision === 'release' ? 'HELD_SALE_RELEASED' : 'HELD_SALE_DECLINED', sessionId, remarks);
  }

  function posComplete(sessionId) {
    var s = byId(data.posSessions, sessionId);
    if (!factorsSatisfied(s)) throw new Error('Required factors not complete: ' + s.required.filter(function (f) { return !s.passed[f]; }).join(', '));
    if (s.status === 'verifying') throw new Error('Run the anomaly check before completing the sale.');
    if (s.status === 'held') throw new Error('Sale is HELD — URC Manager decision required.');
    if (s.status === 'declined') throw new Error('Sale was declined by the URC Manager.');
    var b = beneficiary(s.beneficiaryId);
    var key = s.category === 'liquor' ? 'liquor' : s.category === 'afd' ? 'afd2' : 'grocery';
    var dec = s.category === 'liquor' ? Math.max(1, Math.round(s.amount / 650)) : s.amount;
    b.entitlement[key].balance = Math.max(0, b.entitlement[key].balance - dec);
    b.lastPurchases.unshift({ date: TODAY, urcId: s.urcId, category: s.category, amount: s.amount });
    s.status = 'completed';
    var txn = { id: 'TXN-' + (880900 + data.transactions.length), ts: nowIso(), beneficiaryId: b.id, urcId: s.urcId, category: s.category, amount: s.amount, factors: Object.keys(s.passed).filter(function (k) { return s.passed[k]; }), status: 'completed' };
    data.transactions.unshift(txn);
    audit('system', 'POS', 'SALE_COMPLETED', s.id, inr(s.amount) + ' ' + s.category + '; factors ' + txn.factors.join('+') + (s.deferred.length ? '; deferred ' + s.deferred.join(',') + ' until sync' : ''));
    return txn;
  }

  // Review of pre-seeded BADE flags (URC Manager / DRISHTI fraud monitor)
  function reviewFlag(flagId, officerName, disposition, remarks) {
    var f = byId(data.flags, flagId);
    requireName(officerName, 'Reviewing a flag');
    if (!remarks || !String(remarks).trim()) throw new Error('Remarks are mandatory.');
    f.status = disposition; // 'released' | 'card-suspended' | 'referred'
    f.reviewedBy = officerName;
    f.remarks = remarks;
    return audit(officerName, 'Reviewing Officer', 'FLAG_' + disposition.toUpperCase().replace(/-/g, '_'), flagId, remarks);
  }

  // ---------------------------------------------------------------------
  // SAMADHAN — grievance intelligence (Pillar III)
  // ---------------------------------------------------------------------
  var CATEGORY_RULES = [
    { key: 'billing', label: 'Billing error', terms: ['charged', 'deducted twice', 'billing', 'bill ', 'received 1'], route: 'URC Manager', sla: 3 },
    { key: 'entitlement', label: 'Entitlement / balance', terms: ['balance', 'entitlement', 'quota', 'afd ii', 'afd', 'kota'], route: 'Area Depot — Accounts', sla: 5 },
    { key: 'card', label: 'Card / renewal / OTP', terms: ['card', 'chip', 'renewal', 'validity', 'otp', 'expired'], route: 'CS Dte — Card Cell', sla: 7 },
    { key: 'pricing', label: 'Pricing / MRP', terms: ['mrp', 'price', 'overcharg', 'higher price'], route: 'Area Depot — Pricing', sla: 5 },
    { key: 'quality', label: 'Product quality', terms: ['insect', 'damaged', 'expiry', 'quality', 'infest', 'keede', 'kharab', 'sada'], route: 'Area Depot — Quality + Vendor', sla: 7 },
    { key: 'stock', label: 'Stock availability', terms: ['out of stock', 'not available', 'stockout', 'no stock'], route: 'Area Depot — Supply', sla: 5 },
    { key: 'urc-conduct', label: 'URC conduct / timings', terms: ['rude', 'harass', 'refused', 'timings changed', 'closed', 'staff', 'no one answers'], route: 'Station Commander + URC Manager', sla: 7 },
    { key: 'information', label: 'Information query', terms: ['nearest urc', 'where is', 'timings', 'weekly off', 'kya hai', 'kahan'], route: 'Auto-answer (Tier-1)', sla: 1 },
    { key: 'welfare', label: 'Welfare / widow support', terms: ['widow', 'dehant', 'husband', 'passed away'], route: 'CS Dte — Welfare Cell + ZSB', sla: 5 },
    { key: 'suggestion', label: 'Suggestion', terms: ['suggestion', 'please allow', 'would be good'], route: 'CS Dte — Policy (no SLA)', sla: null }
  ];
  var DISTRESS_TERMS = ['urgent', 'years old', 'cannot travel', 'no one answers', 'koi madad nahi', 'harassment', 'dehant', 'widow', 'troops need', 'third complaint', 'doosri baar', 'teesri baar', 'jaldi'];

  function classifyGrievance(text) {
    var t = ' ' + String(text).toLowerCase() + ' ';
    var scored = CATEGORY_RULES.map(function (r) {
      var hits = r.terms.filter(function (term) { return t.indexOf(term) !== -1; });
      return { rule: r, hits: hits };
    }).filter(function (x) { return x.hits.length; })
      .sort(function (a, b) { return b.hits.length - a.hits.length; });
    var top = scored[0];
    var distress = DISTRESS_TERMS.filter(function (d) { return t.indexOf(d) !== -1; });
    if (!top) {
      return { category: 'unclassified', label: 'Unclassified — human triage', confidence: 'low', matchedTerms: [], route: 'CS Dte — Grievance Cell (manual)', slaDays: 7, autoResolvable: false,
        distress: { flag: distress.length > 0, terms: distress }, evidence: ['No category terms matched; routed to a human for triage'] };
    }
    var conf = top.hits.length >= 2 ? 'high' : scored[1] && scored[1].hits.length === top.hits.length ? 'low' : 'medium';
    var ev = ['Matched terms: "' + top.hits.join('", "') + '" → ' + top.rule.label];
    if (scored[1]) ev.push('Also considered: ' + scored[1].rule.label + ' (' + scored[1].hits.length + ' term)');
    if (distress.length) ev.push('Distress language: "' + distress.join('", "') + '" → escalate to senior nodal officer');
    return {
      category: top.rule.key, label: top.rule.label, confidence: conf, matchedTerms: top.hits,
      route: distress.length ? top.rule.route + ' ⟶ ESCALATED (senior nodal officer)' : top.rule.route,
      slaDays: distress.length && top.rule.sla ? Math.min(top.rule.sla, 3) : top.rule.sla,
      autoResolvable: top.rule.key === 'information' || (top.rule.key === 'entitlement' && /balance/.test(t) && !/stuck|deducted/.test(t)),
      distress: { flag: distress.length > 0, terms: distress },
      evidence: ev
    };
  }
  function precedentsFor(grievanceId, n) {
    var g = byId(data.grievances, grievanceId);
    var c = classifyGrievance(g.text);
    var words = String(g.text).toLowerCase().split(/[^a-z]+/).filter(function (w) { return w.length > 3; });
    return data.precedents.map(function (p) {
      var overlap = words.filter(function (w) { return (p.summary + ' ' + p.resolution).toLowerCase().indexOf(w) !== -1; });
      var score = (p.category === c.category ? 3 : 0) + overlap.length;
      return { precedent: p, score: score, why: (p.category === c.category ? 'Same category (' + c.label + ')' : 'Different category') + (overlap.length ? '; shared terms: ' + overlap.slice(0, 4).join(', ') : '') };
    }).filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return b.score - a.score; }).slice(0, n || 3);
  }
  function autoAnswer(grievanceId) {
    var g = byId(data.grievances, grievanceId);
    var c = classifyGrievance(g.text);
    if (!c.autoResolvable) return null;
    var b = beneficiary(g.beneficiaryId);
    if (c.category === 'information') {
      var u = urc(g.urcId);
      return u.name + ' (' + u.code + '): ' + u.timings + ', weekly off ' + u.weeklyOff + ', ' + u.address + ' ' + u.pin + '. Ph ' + u.mobile + '.';
    }
    return 'Your ' + b.entitlement.period + ' grocery balance is ' + inr(b.entitlement.grocery.balance) + ' of ' + inr(b.entitlement.grocery.overall) + '. If this looks wrong, reply WRONG and it goes to Area Depot Accounts.';
  }
  var GSTAGES = ['lodged', 'acknowledged', 'under-investigation', 'resolved'];
  function advanceGrievance(grievanceId, newStage, officerName, remarks) {
    var g = byId(data.grievances, grievanceId);
    requireName(officerName, 'Updating a grievance');
    if (GSTAGES.indexOf(newStage) === -1) throw new Error('Unknown stage.');
    if (newStage === 'resolved' && (!remarks || !String(remarks).trim())) throw new Error('Resolution remarks are mandatory.');
    g.stage = newStage;
    g.assignedTo = g.assignedTo || officerName;
    g.history.push({ ts: nowIso(), stage: newStage, by: officerName, remarks: remarks || '' });
    var note = 'SMS to ' + beneficiary(g.beneficiaryId).mobile + ': Your complaint ' + g.id + ' is now ' + newStage.replace(/-/g, ' ') + '.';
    var e = audit(officerName, 'Nodal Officer', 'GRIEVANCE_' + newStage.toUpperCase().replace(/-/g, '_'), grievanceId, remarks, { notification: note });
    return { audit: e, notification: note };
  }
  function lodgeGrievance(beneficiaryId, channel, text, urcId) {
    if (!text || String(text).trim().length < 8) throw new Error('Please describe the issue.');
    var g = {
      id: 'GRV-' + (5301 + data.grievances.length), channel: channel, text: text, beneficiaryId: beneficiaryId,
      urcId: urcId || beneficiary(beneficiaryId).homeUrcId, lodgedOn: TODAY, stage: 'lodged', assignedTo: null,
      history: [{ ts: nowIso(), stage: 'lodged', by: 'System (' + channel.toUpperCase() + ' intake)' }]
    };
    data.grievances.unshift(g);
    var c = classifyGrievance(text);
    audit(beneficiary(beneficiaryId).name, 'Beneficiary', 'GRIEVANCE_LODGED', g.id, c.label + ' → ' + c.route);
    return { grievance: g, classification: c };
  }
  function slaStatus(g) {
    var c = classifyGrievance(g.text);
    if (g.stage === 'resolved' || c.slaDays == null) return { state: g.stage === 'resolved' ? 'closed' : 'no-sla', daysOpen: daysBetween(g.lodgedOn, TODAY), slaDays: c.slaDays };
    var open = daysBetween(g.lodgedOn, TODAY);
    return { state: open > c.slaDays ? 'breached' : open >= c.slaDays - 1 ? 'due' : 'within', daysOpen: open, slaDays: c.slaDays };
  }

  // ---------------------------------------------------------------------
  // MLDFE — demand forecasting & redistribution (Pillar I)
  // ---------------------------------------------------------------------
  function forecast(depotId, skuId, horizonWeeks) {
    var h = data.salesHistory[depotId][skuId];
    var n = h.length, H = horizonWeeks || 4;
    var last4 = h.slice(-4), prev4 = h.slice(-8, -4);
    var avgLast = last4.reduce(function (a, c) { return a + c; }, 0) / 4;
    var avgPrev = prev4.reduce(function (a, c) { return a + c; }, 0) / 4;
    var trend = avgPrev ? (avgLast - avgPrev) / avgPrev : 0;
    var weekly = [];
    for (var i = 1; i <= H; i++) weekly.push(Math.round(avgLast * (1 + trend * i / 4)));
    var demand = weekly.reduce(function (a, c) { return a + c; }, 0);
    var stock = data.depotStock[depotId][skuId];
    var cover = avgLast ? stock / avgLast : 99;
    var s = sku(skuId);
    var evidence = [
      'Last 4 weeks avg ' + Math.round(avgLast) + '/wk vs prior 4 weeks ' + Math.round(avgPrev) + '/wk (' + (trend >= 0 ? '+' : '') + Math.round(trend * 100) + '%)',
      'Projected ' + H + '-week demand ' + demand + ' units; stock on hand ' + stock + ' (' + cover.toFixed(1) + ' weeks cover)'
    ];
    if (/Socks|Thermal/.test(s.name) && (depotId === 'AD-LEH' || depotId === 'AD-UDH')) evidence.push('Seasonal factor: winter build-up at high-altitude / northern stations');
    if (/Cooker|TV/.test(s.name)) evidence.push('Seasonal factor: festive run-up (Dussehra–Diwali)');
    if (s.perishable) evidence.push('Perishable: 7-day window applies; overstock carries expiry risk');
    return { depotId: depotId, skuId: skuId, history: h, weekly: weekly, demand: demand, stock: stock, coverWeeks: cover, trend: trend,
      risk: cover < 2 ? 'stockout' : (s.perishable && cover > 6) || cover > 10 ? 'overstock' : 'ok', evidence: evidence };
  }
  function redistributionSuggestions() {
    var out = [];
    data.skus.forEach(function (s) {
      var fs = data.depots.map(function (d) { return forecast(d.id, s.id); });
      var short = fs.filter(function (f) { return f.risk === 'stockout'; });
      var surplus = fs.filter(function (f) { return f.coverWeeks > 6; }).sort(function (a, b) { return b.coverWeeks - a.coverWeeks; });
      var spareLeft = {};
      surplus.forEach(function (f) { spareLeft[f.depotId] = Math.round(f.stock - f.demand * 1.5); });
      short.forEach(function (sh) {
        var src = surplus.filter(function (f) { return spareLeft[f.depotId] > 0; })[0];
        if (!src) return;
        var need = Math.max(0, sh.demand - sh.stock);
        var spare = spareLeft[src.depotId];
        var qty = Math.min(need, spare);
        if (qty <= 0) return;
        spareLeft[src.depotId] -= qty;
        var id = 'RDS-' + s.id.slice(4) + '-' + sh.depotId.slice(3);
        var prior = byId(data.redistributions, id);
        out.push({ id: id, skuId: s.id, from: src.depotId, to: sh.depotId, qty: qty, status: prior ? prior.status : 'proposed',
          evidence: [
            depot(sh.depotId).name + ': ' + sh.coverWeeks.toFixed(1) + ' weeks cover against projected demand ' + sh.demand,
            depot(src.depotId).name + ': ' + src.coverWeeks.toFixed(1) + ' weeks cover — ' + spare + ' units spare after 1.5× safety stock',
            'Moving ' + qty + ' units closes the gap without new procurement'
          ].concat(sh.evidence.slice(2)) });
      });
    });
    return out;
  }
  function decideRedistribution(id, officerName, decision, remarks) {
    requireName(officerName, 'Approving a redistribution');
    var rec = byId(data.redistributions, id);
    if (!rec) { rec = { id: id }; data.redistributions.push(rec); }
    rec.status = decision; rec.by = officerName; rec.remarks = remarks || '';
    return audit(officerName, 'Depot Commandant', 'REDISTRIBUTION_' + decision.toUpperCase(), id, remarks);
  }

  // ---------------------------------------------------------------------
  // DRISHTIKON — vendor compliance & price benchmarking (Pillar IV)
  // ---------------------------------------------------------------------
  var VENDOR_WEIGHTS = { timeliness: 0.25, quantityAccuracy: 0.2, qualityRejection: 0.25, priceCompliance: 0.15, documentation: 0.1, sustainability: 0.05 };
  function vendorScore(vendorId) {
    var v = vendor(vendorId), p = v.params;
    var parts = {
      timeliness: p.timeliness, quantityAccuracy: p.quantityAccuracy,
      qualityRejection: Math.max(0, 100 - p.qualityRejection * 8), // 0% → 100, 12.5% → 0
      priceCompliance: p.priceCompliance, documentation: p.documentation, sustainability: p.sustainability
    };
    var score = 0;
    Object.keys(VENDOR_WEIGHTS).forEach(function (k) { score += parts[k] * VENDOR_WEIGHTS[k]; });
    score = Math.round(score);
    var worst = Object.keys(parts).sort(function (a, b) { return parts[a] - parts[b]; }).slice(0, 2);
    var LABEL = { timeliness: 'Delivery timeliness', quantityAccuracy: 'Quantity accuracy', qualityRejection: 'Quality (rejection rate)', priceCompliance: 'Price compliance', documentation: 'Documentation', sustainability: 'Sustainability cert.' };
    var ev = worst.map(function (k) {
      return LABEL[k] + ': ' + (k === 'qualityRejection' ? p.qualityRejection + '% consignments rejected' : p[k] + '/100') + ' (weight ' + Math.round(VENDOR_WEIGHTS[k] * 100) + '%)';
    });
    var linked = data.grievances.filter(function (g) { return classifyGrievance(g.text).category === 'quality'; }).length;
    if (p.qualityRejection >= 10) ev.push('Correlates with ' + linked + ' open quality grievances in SAMADHAN (insect/damage terms)');
    return { vendorId: vendorId, score: score, band: score >= 80 ? 'green' : score >= 65 ? 'amber' : 'red', parts: parts, weights: VENDOR_WEIGHTS, labels: LABEL, evidence: ev,
      inspectionPriority: p.qualityRejection >= 7 ? 'high' : p.qualityRejection >= 4 ? 'medium' : 'low' };
  }
  function priceFlags() {
    return data.priceBench.map(function (pb) {
      var s = sku(pb.skuId);
      var vsGem = (pb.csd - pb.gem) / pb.gem;
      var vsPrev = (pb.csd - pb.prevPeriod) / pb.prevPeriod;
      var ev = [];
      if (vsGem > 0.1) ev.push('CSD procurement ' + inr(pb.csd) + ' is ' + Math.round(vsGem * 100) + '% above GeM ' + inr(pb.gem));
      if (vsPrev > 0.07) ev.push('Up ' + Math.round(vsPrev * 100) + '% on previous period ' + inr(pb.prevPeriod));
      return { skuId: pb.skuId, name: s.name, csd: pb.csd, gem: pb.gem, mrp: pb.mrp, prev: pb.prevPeriod, flagged: ev.length > 0, evidence: ev };
    });
  }

  // ---------------------------------------------------------------------
  // DRISHTI — command snapshot & weekly AI brief (Pillar V)
  // ---------------------------------------------------------------------
  function commandSnapshot() {
    var openG = data.grievances.filter(function (g) { return g.stage !== 'resolved'; });
    var breached = openG.filter(function (g) { return slaStatus(g).state === 'breached'; });
    var heldFlags = data.flags.filter(function (f) { return f.status === 'held'; });
    var urcIssues = data.urcs.filter(function (u) { return u.serviceStatus !== 'open'; });
    var util = { grocery: [0, 0], liquor: [0, 0], afd2: [0, 0] };
    data.beneficiaries.forEach(function (b) {
      ['grocery', 'liquor', 'afd2'].forEach(function (k) { util[k][0] += b.entitlement[k].overall - b.entitlement[k].balance; util[k][1] += b.entitlement[k].overall; });
    });
    var reds = redistributionSuggestions();
    return {
      urcs: data.urcs.length, urcIssues: urcIssues.length, depots: data.depots.length,
      beneficiariesSample: data.beneficiaries.length,
      openGrievances: openG.length, slaBreached: breached.length,
      heldFlags: heldFlags.length, highFlags: heldFlags.filter(function (f) { return f.severity === 'high'; }).length,
      utilisation: { grocery: util.grocery[0] / util.grocery[1], liquor: util.liquor[0] / util.liquor[1], afd2: util.afd2[0] / util.afd2[1] },
      stockoutRisks: reds.length, vendorsRed: data.vendors.filter(function (v) { return vendorScore(v.id).band === 'red'; }).length,
      priceFlags: priceFlags().filter(function (p) { return p.flagged; }).length
    };
  }
  function weeklyBrief() {
    var snap = commandSnapshot();
    var reds = redistributionSuggestions();
    var worstVendor = data.vendors.map(function (v) { return vendorScore(v.id); }).sort(function (a, b) { return a.score - b.score; })[0];
    var pf = priceFlags().filter(function (p) { return p.flagged; });
    var syncOverdue = data.urcs.filter(function (u) { return u.serviceStatus === 'sync-overdue'; });
    var items = [];
    items.push({ rank: 1, title: 'Possible card clone / deceased-record misuse', severity: 'high',
      evidence: [snap.highFlags + ' high-severity PRAMANIK/BADE holds awaiting review', 'Includes simultaneous use at two URCs 500 km apart and purchases on a SPARSH-deceased record'],
      recommendation: 'Suspend the two cards pending verification; ask Record Office to reconcile deceased records with card database.' });
    if (reds[0]) items.push({ rank: 2, title: 'Winter stock gap at northern / high-altitude depots', severity: 'high',
      evidence: reds.slice(0, 2).map(function (r) { return sku(r.skuId).name + ': ' + depot(r.to).name + ' short; ' + depot(r.from).name + ' surplus ' + r.qty + ' movable'; }),
      recommendation: 'Approve inter-depot redistribution before road closures; no fresh procurement needed.' });
    items.push({ rank: 3, title: 'Vendor quality risk: ' + vendor(worstVendor.vendorId).name, severity: 'medium',
      evidence: worstVendor.evidence, recommendation: 'Prioritise physical inspection of this vendor\'s open consignments; review in procurement committee.' });
    items.push({ rank: 4, title: 'Grievance SLA slippage', severity: 'medium',
      evidence: [snap.openGrievances + ' open grievances; ' + snap.slaBreached + ' past SLA', 'Card/renewal category is the largest breached group'],
      recommendation: 'Add a temporary second handler at CS Dte Card Cell for 2 weeks.' });
    items.push({ rank: 5, title: 'Price anomalies vs GeM', severity: 'low',
      evidence: pf.slice(0, 2).map(function (p) { return p.name + ': ' + p.evidence[0]; }).concat(syncOverdue.length ? [syncOverdue.length + ' remote URC(s) past sync window — their data is up to 3 days old'] : []),
      recommendation: 'Refer flagged SKUs to next price negotiation; confirm GeM comparables are like-for-like.' });
    return { weekOf: TODAY, generatedBy: 'DRISHTI AI Insights (demonstrator rules)', advisory: 'ADVISORY — every item cites its evidence; the Command decides.', items: items };
  }
  function acknowledgeBriefItem(rank, officerName, action) {
    requireName(officerName, 'Acknowledging a brief item');
    return audit(officerName, 'Command', 'BRIEF_ITEM_' + (action || 'ACKNOWLEDGED').toUpperCase(), 'Brief ' + TODAY + ' #' + rank, '');
  }

  CSD.engine = {
    DEMO_OTP: DEMO_OTP,
    LIQUOR_BIOMETRIC_THRESHOLD: LIQUOR_BIOMETRIC_THRESHOLD,
    audit: audit,
    beneficiary: beneficiary, urc: urc, depot: depot, sku: sku, vendor: vendor,
    beneficiaryByBarcode: beneficiaryByBarcode, nearestUrc: nearestUrc,
    startLogin: startLogin, completeLogin: completeLogin, recordConsent: recordConsent,
    requiredFactors: requiredFactors, posStart: posStart, posVerifyOtp: posVerifyOtp, posVerifyBiometric: posVerifyBiometric,
    factorsSatisfied: factorsSatisfied, badeCheck: badeCheck, managerDecide: managerDecide, posComplete: posComplete, reviewFlag: reviewFlag,
    classifyGrievance: classifyGrievance, precedentsFor: precedentsFor, autoAnswer: autoAnswer, advanceGrievance: advanceGrievance,
    lodgeGrievance: lodgeGrievance, slaStatus: slaStatus, GRIEVANCE_STAGES: GSTAGES,
    forecast: forecast, redistributionSuggestions: redistributionSuggestions, decideRedistribution: decideRedistribution,
    vendorScore: vendorScore, priceFlags: priceFlags,
    commandSnapshot: commandSnapshot, weeklyBrief: weeklyBrief, acknowledgeBriefItem: acknowledgeBriefItem,
    inr: inr
  };
})();
