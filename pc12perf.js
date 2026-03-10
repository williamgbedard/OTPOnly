// ── PC-12 Climb Performance Table ─────────────────────────
// Columns: alt (ft), time (sec), fuel (lb), dist (nm), tas (kt), ff (lb/hr cruise)
const PC12 = [
  {alt:0,     time:0,    fuel:0,   dist:0,  tas:230, ff:635},
  {alt:500,   time:18,   fuel:4,   dist:1,  tas:231, ff:630},
  {alt:1000,  time:37,   fuel:7,   dist:2,  tas:233, ff:625},
  {alt:1500,  time:56,   fuel:11,  dist:3,  tas:234, ff:620},
  {alt:2000,  time:75,   fuel:15,  dist:4,  tas:235, ff:615},
  {alt:2500,  time:94,   fuel:18,  dist:5,  tas:237, ff:611},
  {alt:3000,  time:114,  fuel:22,  dist:6,  tas:238, ff:606},
  {alt:3500,  time:133,  fuel:25,  dist:7,  tas:239, ff:602},
  {alt:4000,  time:152,  fuel:32,  dist:8,  tas:240, ff:597},
  {alt:4500,  time:171,  fuel:32,  dist:9,  tas:241, ff:593},
  {alt:5000,  time:191,  fuel:36,  dist:10, tas:242, ff:589},
  {alt:5500,  time:210,  fuel:39,  dist:11, tas:242, ff:584},
  {alt:6000,  time:230,  fuel:43,  dist:12, tas:244, ff:580},
  {alt:6500,  time:246,  fuel:46,  dist:13, tas:246, ff:576},
  {alt:7000,  time:269,  fuel:50,  dist:14, tas:247, ff:572},
  {alt:7500,  time:289,  fuel:53,  dist:15, tas:248, ff:568},
  {alt:8000,  time:308,  fuel:56,  dist:16, tas:249, ff:564},
  {alt:8500,  time:328,  fuel:60,  dist:17, tas:251, ff:561},
  {alt:9000,  time:348,  fuel:63,  dist:18, tas:252, ff:557},
  {alt:9500,  time:368,  fuel:67,  dist:19, tas:253, ff:553},
  {alt:10000, time:388,  fuel:70,  dist:20, tas:254, ff:549},
  {alt:10500, time:408,  fuel:73,  dist:21, tas:256, ff:547},
  {alt:11000, time:428,  fuel:77,  dist:22, tas:257, ff:545},
  {alt:11500, time:449,  fuel:80,  dist:23, tas:258, ff:542},
  {alt:12000, time:469,  fuel:83,  dist:24, tas:259, ff:540},
  {alt:12500, time:489,  fuel:86,  dist:25, tas:261, ff:538},
  {alt:13000, time:511,  fuel:90,  dist:26, tas:260, ff:537},
  {alt:13500, time:532,  fuel:93,  dist:27, tas:261, ff:535},
  {alt:14000, time:553,  fuel:96,  dist:28, tas:262, ff:534},
  {alt:14500, time:574,  fuel:100, dist:29, tas:263, ff:531},
  {alt:15000, time:595,  fuel:103, dist:30, tas:265, ff:529},
  {alt:15500, time:618,  fuel:106, dist:32, tas:266, ff:527},
  {alt:16000, time:641,  fuel:110, dist:33, tas:267, ff:525},
  {alt:16500, time:664,  fuel:113, dist:34, tas:268, ff:522},
  {alt:17000, time:687,  fuel:116, dist:35, tas:270, ff:520},
  {alt:17500, time:710,  fuel:120, dist:36, tas:271, ff:518},
  {alt:18000, time:736,  fuel:123, dist:38, tas:272, ff:516},
  {alt:19000, time:788,  fuel:130, dist:40, tas:273, ff:504},
  {alt:20000, time:839,  fuel:137, dist:43, tas:273, ff:492},
  {alt:21000, time:897,  fuel:145, dist:46, tas:273, ff:476},
  {alt:22000, time:955,  fuel:152, dist:49, tas:272, ff:461},
  {alt:23000, time:1018, fuel:160, dist:53, tas:271, ff:446},
  {alt:24000, time:1085, fuel:168, dist:56, tas:270, ff:432},
  {alt:25000, time:1151, fuel:175, dist:60, tas:269, ff:418},
  {alt:26000, time:1230, fuel:184, dist:64, tas:267, ff:403},
  {alt:27000, time:1310, fuel:192, dist:68, tas:265, ff:390},
  {alt:28000, time:1398, fuel:201, dist:73, tas:264, ff:377},
  {alt:29000, time:1496, fuel:211, dist:78, tas:261, ff:363},
  {alt:30000, time:1595, fuel:220, dist:84, tas:259, ff:348},
];

// Interpolate PC12 table at any altitude (ft)
function pc12AtAlt(altFt) {
  if (altFt <= 0) return PC12[0];
  if (altFt >= 30000) return PC12[PC12.length - 1];
  const lo = PC12.filter(r => r.alt <= altFt).pop();
  const hi = PC12.find(r => r.alt > altFt);
  if (!lo || !hi) return PC12[0];
  const t = (altFt - lo.alt) / (hi.alt - lo.alt);
  return {
    alt: altFt,
    time: lo.time + t * (hi.time - lo.time),
    fuel: lo.fuel + t * (hi.fuel - lo.fuel),
    dist: lo.dist + t * (hi.dist - lo.dist),
    tas:  lo.tas  + t * (hi.tas  - lo.tas),
    ff:   lo.ff   + t * (hi.ff   - lo.ff),
  };
}
