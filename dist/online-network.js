(function(root){
'use strict';
// Conservative LAN eligibility: readable RFC1918 IPv4 endpoints in one /24.
// Public IPs, hidden/mDNS addresses, IPv6 and ambiguous routes stay on the server.
function privateIPv4(address){if(typeof address!=='string'||!/^\d{1,3}(\.\d{1,3}){3}$/.test(address))return null;const p=address.split('.').map(Number);if(p.some(n=>n>255)||!p.some(Boolean))return null;if(!(p[0]===10||p[0]===172&&p[1]>=16&&p[1]<=31||p[0]===192&&p[1]===168))return null;return p;}
function eligible(e){if(!e||e.localType!=='host'||e.remoteType!=='host')return false;const a=privateIPv4(e.localAddress),b=privateIPv4(e.remoteAddress);return !!a&&!!b&&a.slice(0,3).join('.')===b.slice(0,3).join('.');}
function reciprocal(a,b){return eligible(a)&&eligible(b)&&a.localAddress===b.remoteAddress&&a.remoteAddress===b.localAddress;}
function fromStats(stats){let pair;for(const s of stats.values())if(s.type==='transport'&&s.selectedCandidatePairId){pair=stats.get(s.selectedCandidatePairId);break;}if(!pair)for(const s of stats.values())if(s.type==='candidate-pair'&&s.selected===true){pair=s;break;}if(!pair||pair.state!=='succeeded')return null;const a=stats.get(pair.localCandidateId),b=stats.get(pair.remoteCandidateId);const e={localAddress:a?.address||a?.ip,remoteAddress:b?.address||b?.ip,localType:a?.candidateType,remoteType:b?.candidateType};return eligible(e)?e:null;}
const api={eligible,reciprocal,fromStats};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.OnlineNetwork=api;
})(typeof window==='undefined'?globalThis:window);
