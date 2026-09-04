import { ConstituencyProfile, Village } from '../types';
import { SINDHANUR_VILLAGES } from './sindhanurVillages';

export interface PresetConstituency {
  profile: ConstituencyProfile;
  villages: Village[];
}

// 1. Sindhanur (AC-58)
export const SINDHANUR_PRESET: PresetConstituency = {
  profile: {
    id: 'ac_58_sindhanur',
    name: 'Sindhanur',
    acNumber: '58',
    district: 'Raichur',
    state: 'Karnataka',
    candidateName: 'Adv. Suresh K. Hegde',
    candidateTitle: 'ABHI Candidate & 58 - Sindhanur Assembly Convener',
    helpline: '1800-425-5800',
    description: 'Sindhanur Assembly Constituency covers 124 rural panchayats, camps, and urban wards across the Tungabhadra irrigation belt.',
    totalElectors: 242000,
    totalBooths: 254,
  },
  villages: SINDHANUR_VILLAGES,
};

// 2. Maski (AC-59)
const MASKI_VILLAGES_LIST = [
  { name: 'Maski Town', kannada: 'ಮಸ್ಕಿ ಪಟ್ಟಣ', gp: 'Maski TMC', pop: 28500, booths: 28, coord: 'Mallikarjun Maski', phone: '+91 94481 31001', lat: 15.961, lng: 76.662 },
  { name: 'Turvihal', kannada: 'ತುರುವಿಹಾಳ', gp: 'Turvihal GP', pop: 12400, booths: 14, coord: 'Hanumanthappa Turvihal', phone: '+91 94481 31002', lat: 15.892, lng: 76.783 },
  { name: 'Antaragange', kannada: 'ಅಂತರಗಂಗೆ', gp: 'Antaragange GP', pop: 6800, booths: 7, coord: 'Venkatesh Naik', phone: '+91 94481 31003', lat: 15.932, lng: 76.611 },
  { name: 'Medikinhal', kannada: 'ಮೇದಿಕಿನ್ಹಾಳ', gp: 'Medikinhal GP', pop: 5400, booths: 6, coord: 'Basanagouda Patil', phone: '+91 94481 31004', lat: 15.981, lng: 76.634 },
  { name: 'Chikkadinni', kannada: 'ಚಿಕ್ಕದಿನ್ನಿ', gp: 'Chikkadinni GP', pop: 4800, booths: 5, coord: 'Ramesh Chikkadinni', phone: '+91 94481 31005', lat: 16.012, lng: 76.671 },
  { name: 'Maraldinni', kannada: 'ಮರಲದಿನ್ನಿ', gp: 'Maraldinni GP', pop: 5900, booths: 6, coord: 'Sharanappa Maral', phone: '+91 94481 31006', lat: 15.945, lng: 76.711 },
  { name: 'Balaganur', kannada: 'ಬಳಗಾನೂರು', gp: 'Balaganur GP', pop: 9800, booths: 10, coord: 'Girish Balaganur', phone: '+91 94481 31007', lat: 16.034, lng: 76.612 },
  { name: 'Udbal', kannada: 'ಉದ್ಬಾಳ', gp: 'Udbal GP', pop: 4200, booths: 4, coord: 'Doddappa Udbal', phone: '+91 94481 31008', lat: 15.912, lng: 76.734 },
  { name: 'Jalihal', kannada: 'ಜಾಲಿಹಾಳ', gp: 'Jalihal GP', pop: 5100, booths: 5, coord: 'Veeresh Jalihal', phone: '+91 94481 31009', lat: 15.865, lng: 76.698 },
  { name: 'Halapur', kannada: 'ಹಾಲಾಪುರ', gp: 'Halapur GP', pop: 4600, booths: 5, coord: 'Kallappa Halapur', phone: '+91 94481 31010', lat: 15.992, lng: 76.745 },
  { name: 'Hirekadabur', kannada: 'ಹಿರೇಕಡಬೂರು', gp: 'Hirekadabur GP', pop: 6100, booths: 6, coord: 'Prakash Kadabur', phone: '+91 94481 31011', lat: 16.045, lng: 76.689 },
  { name: 'Talekhan', kannada: 'ತಾಳೇಖಾನ್', gp: 'Talekhan GP', pop: 4300, booths: 4, coord: 'Anand Talekhan', phone: '+91 94481 31012', lat: 15.923, lng: 76.592 },
  { name: 'Gudadoor', kannada: 'ಗುಡದೂರು', gp: 'Gudadoor GP', pop: 7200, booths: 8, coord: 'Sangamesh Gudadoor', phone: '+91 94481 31013', lat: 15.881, lng: 76.643 },
  { name: 'Ambagere', kannada: 'ಅಂಬಾಗೇರೆ', gp: 'Ambagere GP', pop: 3800, booths: 4, coord: 'Nagaraj Ambagere', phone: '+91 94481 31014', lat: 15.974, lng: 76.772 },
  { name: 'Halkavatgi', kannada: 'ಹಾಲ್ಕವಟಗಿ', gp: 'Halkavatgi GP', pop: 4900, booths: 5, coord: 'Yamanappa Kavatgi', phone: '+91 94481 31015', lat: 16.021, lng: 76.721 },
  { name: 'Kavital', kannada: 'ಕವಿತಾಳ', gp: 'Kavital GP', pop: 11200, booths: 12, coord: 'Basalingappa Patil', phone: '+91 94481 31016', lat: 16.062, lng: 76.782 },
];

export const MASKI_PRESET: PresetConstituency = {
  profile: {
    id: 'ac_59_maski',
    name: 'Maski',
    acNumber: '59',
    district: 'Raichur',
    state: 'Karnataka',
    candidateName: 'Ramesh Patil Maski',
    candidateTitle: 'ABHI Candidate & 59 - Maski Assembly Convener',
    helpline: '1800-425-5900',
    description: 'Maski Assembly Constituency (ST Reserved) comprising historical settlements, Tungabhadra canal reaches, and dryland agrarian panchayats.',
    totalElectors: 215000,
    totalBooths: 218,
  },
  villages: MASKI_VILLAGES_LIST.map((v, i) => ({
    id: `vil_maski_${String(i + 1).padStart(3, '0')}`,
    name: v.name,
    kannadaName: v.kannada,
    gramPanchayat: v.gp,
    taluk: 'Maski',
    district: 'Raichur',
    constituency: '59 - Maski',
    mandal: v.gp,
    wardsCount: Math.ceil(v.booths / 2),
    boothsCount: v.booths,
    population: v.pop,
    registeredMembers: Math.round(v.pop * 0.08),
    coordinatorId: `coord_maski_${i + 1}`,
    coordinatorName: v.coord,
    coordinatorPhone: v.phone,
    lat: v.lat,
    lng: v.lng,
    activeIssuesCount: (i % 4) + 1,
    resolvedIssuesCount: (i % 6) + 3,
    lastMeetingDate: '2025-05-10',
  })),
};

// 3. Manvi (AC-55)
const MANVI_VILLAGES_LIST = [
  { name: 'Manvi Town', kannada: 'ಮಾನ್ವಿ ಪಟ್ಟಣ', gp: 'Manvi TMC', pop: 34000, booths: 32, coord: 'Mahadevappa Manvi', phone: '+91 94481 41001', lat: 15.992, lng: 77.051 },
  { name: 'Potnal', kannada: 'ಪೋತ್ನಾಳ', gp: 'Potnal GP', pop: 11500, booths: 12, coord: 'Chandrashekar Potnal', phone: '+91 94481 41002', lat: 15.942, lng: 76.921 },
  { name: 'Sirwar', kannada: 'ಸಿರವಾರ', gp: 'Sirwar TP', pop: 18900, booths: 18, coord: 'Amaresh Gowda Sirwar', phone: '+91 94481 41003', lat: 16.032, lng: 77.132 },
  { name: 'Kurdi', kannada: 'ಕುರ್ಡಿ', gp: 'Kurdi GP', pop: 6700, booths: 7, coord: 'Prabhuraj Kurdi', phone: '+91 94481 41004', lat: 15.961, lng: 77.012 },
  { name: 'Kallur', kannada: 'ಕಲ್ಲೂರು', gp: 'Kallur GP', pop: 8300, booths: 9, coord: 'Rudrappa Kallur', phone: '+91 94481 41005', lat: 16.051, lng: 77.081 },
  { name: 'Hirekotnekal', kannada: 'ಹಿರೇಕೊಟ್ನೇಕಲ್', gp: 'Hirekotnekal GP', pop: 5900, booths: 6, coord: 'Somashekar Kotne', phone: '+91 94481 41006', lat: 15.921, lng: 77.089 },
  { name: 'Bagalwad', kannada: 'ಬಾಗಲವಾಡ', gp: 'Bagalwad GP', pop: 7400, booths: 8, coord: 'Gopal Reddy', phone: '+91 94481 41007', lat: 16.074, lng: 77.014 },
  { name: 'Harvi', kannada: 'ಹಾರ್ವಿ', gp: 'Harvi GP', pop: 4900, booths: 5, coord: 'Bheemanna Harvi', phone: '+91 94481 41008', lat: 15.981, lng: 77.121 },
  { name: 'Byagwat', kannada: 'ಬ್ಯಾಗವಾಟ', gp: 'Byagwat GP', pop: 5800, booths: 6, coord: 'Devendra Byagwat', phone: '+91 94481 41009', lat: 16.012, lng: 76.974 },
  { name: 'Madlapur', kannada: 'ಮಡ್ಲಾಪುರ', gp: 'Madlapur GP', pop: 4100, booths: 4, coord: 'Sharad Madlapur', phone: '+91 94481 41010', lat: 15.895, lng: 77.042 },
  { name: 'Neeramanvi', kannada: 'ನೀರಮಾನ್ವಿ', gp: 'Neeramanvi GP', pop: 6300, booths: 7, coord: 'Govindappa Naik', phone: '+91 94481 41011', lat: 16.022, lng: 77.041 },
  { name: 'Hokrani', kannada: 'ಹೊಕ್ರಾಣಿ', gp: 'Hokrani GP', pop: 4700, booths: 5, coord: 'Manjunath Hokrani', phone: '+91 94481 41012', lat: 15.934, lng: 77.145 },
];

export const MANVI_PRESET: PresetConstituency = {
  profile: {
    id: 'ac_55_manvi',
    name: 'Manvi',
    acNumber: '55',
    district: 'Raichur',
    state: 'Karnataka',
    candidateName: 'Dr. Sharana Gowda',
    candidateTitle: 'ABHI Candidate & 55 - Manvi Assembly Convener',
    helpline: '1800-425-5500',
    description: 'Manvi Assembly Constituency (ST Reserved) encompassing agrarian canal panchayats, Sirwar clusters, and Tungabhadra river plains.',
    totalElectors: 238000,
    totalBooths: 246,
  },
  villages: MANVI_VILLAGES_LIST.map((v, i) => ({
    id: `vil_manvi_${String(i + 1).padStart(3, '0')}`,
    name: v.name,
    kannadaName: v.kannada,
    gramPanchayat: v.gp,
    taluk: 'Manvi',
    district: 'Raichur',
    constituency: '55 - Manvi',
    mandal: v.gp,
    wardsCount: Math.ceil(v.booths / 2),
    boothsCount: v.booths,
    population: v.pop,
    registeredMembers: Math.round(v.pop * 0.08),
    coordinatorId: `coord_manvi_${i + 1}`,
    coordinatorName: v.coord,
    coordinatorPhone: v.phone,
    lat: v.lat,
    lng: v.lng,
    activeIssuesCount: (i % 3) + 1,
    resolvedIssuesCount: (i % 5) + 2,
    lastMeetingDate: '2025-05-12',
  })),
};

// 4. Raichur Rural (AC-54)
const RAICHUR_RURAL_VILLAGES_LIST = [
  { name: 'Yeragera', kannada: 'ಯರಗೇರಾ', gp: 'Yeragera GP', pop: 9400, booths: 10, coord: 'Tayappa Yeragera', phone: '+91 94481 51001', lat: 16.142, lng: 77.261 },
  { name: 'Chandrabanda', kannada: 'ಚಂದ್ರಬಂಡಾ', gp: 'Chandrabanda GP', pop: 8100, booths: 8, coord: 'Narsimha Bandi', phone: '+91 94481 51002', lat: 16.082, lng: 77.341 },
  { name: 'Gillesugur', kannada: 'ಗಿಲ್ಲಿಶುಗೂರು', gp: 'Gillesugur GP', pop: 6700, booths: 7, coord: 'Kareppa Sugur', phone: '+91 94481 51003', lat: 16.195, lng: 77.312 },
  { name: 'Devasugur', kannada: 'ದೇವಸುಗೂರು', gp: 'Devasugur GP', pop: 11200, booths: 12, coord: 'Sugureshwara Swamy', phone: '+91 94481 51004', lat: 16.275, lng: 77.391 },
  { name: 'Yapaladinni', kannada: 'ಯಾಪಲದಿನ್ನಿ', gp: 'Yapaladinni GP', pop: 7200, booths: 7, coord: 'Shivaraj Dinni', phone: '+91 94481 51005', lat: 16.115, lng: 77.295 },
  { name: 'Shaktinagar', kannada: 'ಶಕ್ತಿನಗರ', gp: 'Shaktinagar TP', pop: 16800, booths: 16, coord: 'Prakash RTPS', phone: '+91 94481 51006', lat: 16.321, lng: 77.354 },
  { name: 'Marnoor', kannada: 'ಮಾರ್ನೂರು', gp: 'Marnoor GP', pop: 4800, booths: 5, coord: 'Basavaraj Marnoor', phone: '+91 94481 51007', lat: 16.162, lng: 77.214 },
  { name: 'Gunjalli', kannada: 'ಗುಂಜಳ್ಳಿ', gp: 'Gunjalli GP', pop: 5600, booths: 6, coord: 'Venkat Rao Gunjalli', phone: '+91 94481 51008', lat: 16.221, lng: 77.284 },
  { name: 'Kalasankoppa', kannada: 'ಕಳಸನಕೊಪ್ಪ', gp: 'Kalasankoppa GP', pop: 4200, booths: 4, coord: 'Mallappa Koppa', phone: '+91 94481 51009', lat: 16.178, lng: 77.332 },
  { name: 'Chicksugur', kannada: 'ಚಿಕ್ಕಸುಗೂರು', gp: 'Chicksugur GP', pop: 6900, booths: 7, coord: 'Amareppa Sugur', phone: '+91 94481 51010', lat: 16.241, lng: 77.321 },
];

export const RAICHUR_RURAL_PRESET: PresetConstituency = {
  profile: {
    id: 'ac_54_raichur_rural',
    name: 'Raichur Rural',
    acNumber: '54',
    district: 'Raichur',
    state: 'Karnataka',
    candidateName: 'Smt. Nagaveni Patil',
    candidateTitle: 'ABHI Candidate & 54 - Raichur Rural Convener',
    helpline: '1800-425-5400',
    description: 'Raichur Rural Assembly Constituency (ST Reserved) stretching across Krishna river basin, thermal power belt, and border gram panchayats.',
    totalElectors: 228000,
    totalBooths: 232,
  },
  villages: RAICHUR_RURAL_VILLAGES_LIST.map((v, i) => ({
    id: `vil_rr_${String(i + 1).padStart(3, '0')}`,
    name: v.name,
    kannadaName: v.kannada,
    gramPanchayat: v.gp,
    taluk: 'Raichur',
    district: 'Raichur',
    constituency: '54 - Raichur Rural',
    mandal: v.gp,
    wardsCount: Math.ceil(v.booths / 2),
    boothsCount: v.booths,
    population: v.pop,
    registeredMembers: Math.round(v.pop * 0.08),
    coordinatorId: `coord_rr_${i + 1}`,
    coordinatorName: v.coord,
    coordinatorPhone: v.phone,
    lat: v.lat,
    lng: v.lng,
    activeIssuesCount: (i % 3) + 1,
    resolvedIssuesCount: (i % 4) + 2,
    lastMeetingDate: '2025-05-14',
  })),
};

export const ALL_PRESET_CONSTITUENCIES: Record<string, PresetConstituency> = {
  ac_58_sindhanur: SINDHANUR_PRESET,
  ac_59_maski: MASKI_PRESET,
  ac_55_manvi: MANVI_PRESET,
  ac_54_raichur_rural: RAICHUR_RURAL_PRESET,
};
