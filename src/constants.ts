export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  hint: string;
}

export interface LevelData {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: "Aras 1: Mengenal Pasti Nombor",
    description: "Kenali nombor positif dan negatif dalam situasi harian.",
    questions: [
      {
        id: 1,
        text: "Suhu 5 darjah di bawah paras beku diwakili sebagai...",
        options: ["5", "-5", "0.5", "-0.5"],
        correctAnswer: 1,
        hint: "Di bawah paras beku bermaksud nilai negatif."
      },
      {
        id: 2,
        text: "Keuntungan RM200 diwakili sebagai...",
        options: ["-200", "20", "200", "-20"],
        correctAnswer: 2,
        hint: "Untung adalah penambahan nilai (positif)."
      },
      {
        id: 3,
        text: "Manakah antara berikut adalah nombor negatif?",
        options: ["10", "0", "-15", "5"],
        correctAnswer: 2,
        hint: "Cari simbol '-' di depan nombor."
      },
      {
        id: 4,
        text: "Kedalaman 10m di bawah aras laut ialah...",
        options: ["10", "-10", "100", "-100"],
        correctAnswer: 1,
        hint: "Bawah aras laut adalah negatif."
      },
      {
        id: 5,
        text: "Jika +50 mewakili bergerak ke kanan, -50 mewakili...",
        options: ["Bergerak ke atas", "Bergerak ke bawah", "Bergerak ke kiri", "Berhenti"],
        correctAnswer: 2,
        hint: "Lawan bagi kanan ialah kiri."
      },
      {
        id: 6,
        text: "Antara 0 dan -3, yang manakah lebih kecil?",
        options: ["0", "-3", "Sama", "Tiada"],
        correctAnswer: 1,
        hint: "Semakin ke kiri pada garis nombor, semakin kecil nilainya."
      },
      {
        id: 7,
        text: "Nombor yang manakah bukan positif dan bukan negatif?",
        options: ["1", "-1", "0", "10"],
        correctAnswer: 2,
        hint: "Titik tengah pada garis nombor."
      },
      {
        id: 8,
        text: "Kenaikan harga sebanyak 20 sen diwakili sebagai...",
        options: ["-20", "+20", "-0.2", "+0.2"],
        correctAnswer: 1,
        hint: "Naik bermaksud positif."
      },
      {
        id: 9,
        text: "Simbol bagi nombor negatif ialah...",
        options: ["+", "-", "x", "÷"],
        correctAnswer: 1,
        hint: "Tolak atau sengkang."
      },
      {
        id: 10,
        text: "Lawan bagi -12 ialah...",
        options: ["12", "0", "-12", "1"],
        correctAnswer: 0,
        hint: "Tukar tanda negatif kepada positif."
      }
    ]
  },
  {
    id: 2,
    title: "Aras 2: Membanding & Menyusun",
    description: "Susun nombor nisbah mengikut tertib.",
    questions: [
      {
        id: 1,
        text: "Susun mengikut tertib menaik: -2, 5, -8, 0",
        options: ["-8, -2, 0, 5", "5, 0, -2, -8", "0, -2, 5, -8", "-2, -8, 0, 5"],
        correctAnswer: 0,
        hint: "Mula dengan nombor negatif yang paling besar nilainya."
      },
      {
        id: 2,
        text: "Manakah lebih besar? -0.5 atau -0.1?",
        options: ["-0.5", "-0.1", "Sama", "Tiada"],
        correctAnswer: 1,
        hint: "-0.1 lebih dekat dengan sifar."
      },
      {
        id: 3,
        text: "Pilih susunan tertib menurun yang betul.",
        options: ["-1, -2, -3", "3, 2, 1", "1, 0, -1", "Semua di atas"],
        correctAnswer: 3,
        hint: "Menurun bermaksud dari besar ke kecil."
      },
      {
        id: 4,
        text: "Antara 1/2 dan 1/4, yang manakah lebih besar?",
        options: ["1/2", "1/4", "Sama", "Tiada"],
        correctAnswer: 0,
        hint: "0.5 berbanding 0.25."
      },
      {
        id: 5,
        text: "Isi tempat kosong: -7 [ ] -10",
        options: [">", "<", "=", "≠"],
        correctAnswer: 0,
        hint: "-7 lebih besar daripada -10."
      },
      {
        id: 6,
        text: "Susun mengikut tertib menaik: 0.2, -0.3, 0.1",
        options: ["-0.3, 0.1, 0.2", "0.1, 0.2, -0.3", "0.2, 0.1, -0.3", "-0.3, 0.2, 0.1"],
        correctAnswer: 0,
        hint: "Negatif sentiasa paling kecil."
      },
      {
        id: 7,
        text: "Manakah nilai yang paling dekat dengan 0?",
        options: ["-5", "4", "-1", "2"],
        correctAnswer: 2,
        hint: "Cari jarak terpendek ke sifar."
      },
      {
        id: 8,
        text: "Tertib menaik bagi -1/2, -1/4, -1/8 ialah...",
        options: ["-1/2, -1/4, -1/8", "-1/8, -1/4, -1/2", "-1/4, -1/2, -1/8", "Tiada"],
        correctAnswer: 0,
        hint: "-0.5, -0.25, -0.125."
      },
      {
        id: 9,
        text: "Pernyataan manakah benar?",
        options: ["-10 > -5", "0 < -2", "-3 > -4", "-1 = 1"],
        correctAnswer: 2,
        hint: "Semakin ke kanan, semakin besar."
      },
      {
        id: 10,
        text: "Susun menurun: 1.5, -2.0, 0.5",
        options: ["1.5, 0.5, -2.0", "-2.0, 0.5, 1.5", "0.5, 1.5, -2.0", "1.5, -2.0, 0.5"],
        correctAnswer: 0,
        hint: "Positif paling besar, negatif paling kecil."
      }
    ]
  },
  {
    id: 3,
    title: "Aras 3: Operasi Asas",
    description: "Selesaikan pengiraan melibatkan nombor nisbah.",
    questions: [
      {
        id: 1,
        text: "-5 + (-3) = ?",
        options: ["-8", "-2", "8", "2"],
        correctAnswer: 0,
        hint: "Hutang 5, hutang lagi 3."
      },
      {
        id: 2,
        text: "10 - (-4) = ?",
        options: ["6", "14", "-6", "-14"],
        correctAnswer: 1,
        hint: "Tolak negatif menjadi tambah."
      },
      {
        id: 3,
        text: "-2 x 5 = ?",
        options: ["10", "-10", "7", "-7"],
        correctAnswer: 1,
        hint: "Negatif darab positif jadi negatif."
      },
      {
        id: 4,
        text: "-12 ÷ (-3) = ?",
        options: ["-4", "4", "-15", "9"],
        correctAnswer: 1,
        hint: "Negatif bahagi negatif jadi positif."
      },
      {
        id: 5,
        text: "0.5 + (-0.2) = ?",
        options: ["0.7", "0.3", "-0.3", "-0.7"],
        correctAnswer: 1,
        hint: "Sama seperti 0.5 - 0.2."
      },
      {
        id: 6,
        text: "(-1/2) x (-1/2) = ?",
        options: ["-1/4", "1/4", "1", "-1"],
        correctAnswer: 1,
        hint: "Darab pengatas dan penyebut."
      },
      {
        id: 7,
        text: "-8 + 10 = ?",
        options: ["-18", "18", "2", "-2"],
        correctAnswer: 2,
        hint: "Hutang 8, bayar 10."
      },
      {
        id: 8,
        text: "(-3) x (-4) x (-1) = ?",
        options: ["12", "-12", "7", "-7"],
        correctAnswer: 1,
        hint: "Tiga tanda negatif menghasilkan negatif."
      },
      {
        id: 9,
        text: "15 ÷ (-5) + 2 = ?",
        options: ["-1", "5", "-5", "1"],
        correctAnswer: 0,
        hint: "Selesaikan bahagi dahulu."
      },
      {
        id: 10,
        text: "(-0.1) x 10 = ?",
        options: ["1", "-1", "0.1", "-0.1"],
        correctAnswer: 1,
        hint: "Gerakkan titik perpuluhan."
      }
    ]
  }
];
