export interface Upazila {
  id: string;
  nameEn: string;
  nameBn: string;
}

export interface District {
  id: string;
  name: string;
  nameBn: string;
  colorClass: string;
  population: string;
  area: string;
  upazilas: Upazila[];
}

export const districts: District[] = [
  {
    id: "rangpur",
    name: "Rangpur",
    nameBn: "রংপুর",
    colorClass: "bg-district-rangpur",
    population: "2.9M",
    area: "2,368 km²",
    upazilas: [
      { id: "mithapukur", nameEn: "Mithapukur", nameBn: "মিঠাপুকুর" },
      { id: "taraganj", nameEn: "Taraganj", nameBn: "তারাগঞ্জ" },
      { id: "badarganj", nameEn: "Badarganj", nameBn: "বদরগঞ্জ" },
      { id: "pirganj", nameEn: "Pirganj", nameBn: "পীরগঞ্জ" },
      { id: "pirgachha", nameEn: "Pirgachha", nameBn: "পীরগাছা" },
      { id: "gangachara", nameEn: "Gangachara", nameBn: "গংগাচড়া" },
      { id: "kaunia", nameEn: "Kaunia", nameBn: "কাউনিয়া" },
      { id: "rangpur-sadar", nameEn: "Rangpur Sadar", nameBn: "রংপুর সদর" },
    ],
  },

  {
    id: "dinajpur",
    name: "Dinajpur",
    nameBn: "দিনাজপুর",
    colorClass: "bg-district-dinajpur",
    population: "3.0M",
    area: "3,437 km²",
    upazilas: [
      { id: "kaharole", nameEn: "Kaharole", nameBn: "কাহারোল" },
      { id: "khansama", nameEn: "Khansama", nameBn: "খানসামা" },
      { id: "birganj", nameEn: "Birganj", nameBn: "বীরগঞ্জ" },
      { id: "chirirbandar", nameEn: "Chirirbandar", nameBn: "চিরিরবন্দর" },
      { id: "birampur", nameEn: "Birampur", nameBn: "বিরামপুর" },
      { id: "ghoraghat", nameEn: "Ghoraghat", nameBn: "ঘোড়াঘাট" },
      { id: "dinajpur-sadar", nameEn: "Dinajpur Sadar", nameBn: "দিনাজপুর সদর" },
      { id: "nawabganj", nameEn: "Nawabganj", nameBn: "নবাবগঞ্জ" },
      { id: "bochaganj", nameEn: "Bochaganj", nameBn: "বোচাগঞ্জ" },
      { id: "phulbari", nameEn: "Phulbari", nameBn: "ফুলবাড়ী" },
      { id: "birol", nameEn: "Birol", nameBn: "বিরল" },
      { id: "parbatipur", nameEn: "Parbatipur", nameBn: "পার্বতীপুর" },
      { id: "hakimpur", nameEn: "Hakimpur", nameBn: "হাকিমপুর" },
    ],
  },

  {
    id: "kurigram",
    name: "Kurigram",
    nameBn: "কুড়িগ্রাম",
    colorClass: "bg-district-kurigram",
    population: "2.1M",
    area: "2,296 km²",
    upazilas: [
      { id: "ulipur", nameEn: "Ulipur", nameBn: "উলিপুর" },
      { id: "phulbari", nameEn: "Phulbari", nameBn: "ফুলবাড়ী" },
      { id: "bhurungamari", nameEn: "Bhurungamari", nameBn: "ভুরুঙ্গামারী" },
      { id: "nageshwari", nameEn: "Nageshwari", nameBn: "নাগেশ্বরী" },
      { id: "rajarhat", nameEn: "Rajarhat", nameBn: "রাজারহাট" },
      { id: "rajibpur", nameEn: "Rajibpur", nameBn: "রাজিবপুর" },
      { id: "kurigram-sadar", nameEn: "Kurigram Sadar", nameBn: "কুড়িগ্রাম সদর" },
      { id: "roumari", nameEn: "Roumari", nameBn: "রৌমারী" },
      { id: "chilmari", nameEn: "Chilmari", nameBn: "চিলমারী" },
    ],
  },

  {
    id: "lalmonirhat",
    name: "Lalmonirhat",
    nameBn: "লালমনিরহাট",
    colorClass: "bg-district-lalmonirhat",
    population: "1.3M",
    area: "1,241 km²",
    upazilas: [
      { id: "patgram", nameEn: "Patgram", nameBn: "পাটগ্রাম" },
      { id: "hatibandha", nameEn: "Hatibandha", nameBn: "হাতীবান্ধা" },
      { id: "lalmonirhat-sadar", nameEn: "Lalmonirhat Sadar", nameBn: "লালমনিরহাট সদর" },
      { id: "aditmari", nameEn: "Aditmari", nameBn: "আদিতমারী" },
      { id: "kaliganj", nameEn: "Kaliganj", nameBn: "কালীগঞ্জ" },
    ],
  },

  {
    id: "nilphamari",
    name: "Nilphamari",
    nameBn: "নীলফামারী",
    colorClass: "bg-district-nilphamari",
    population: "1.8M",
    area: "1,546 km²",
    upazilas: [
      { id: "dimla", nameEn: "Dimla", nameBn: "ডিমলা" },
      { id: "jaldhaka", nameEn: "Jaldhaka", nameBn: "জলঢাকা" },
      { id: "saidpur", nameEn: "Saidpur", nameBn: "সৈয়দপুর" },
      { id: "kishoreganj", nameEn: "Kishoreganj", nameBn: "কিশোরগঞ্জ" },
      { id: "nilphamari-sadar", nameEn: "Nilphamari Sadar", nameBn: "নীলফামারী সদর" },
      { id: "domar", nameEn: "Domar", nameBn: "ডোমার" },
    ],
  },

  {
    id: "panchagarh",
    name: "Panchagarh",
    nameBn: "পঞ্চগড়",
    colorClass: "bg-district-panchagarh",
    population: "1.0M",
    area: "1,405 km²",
    upazilas: [
      { id: "panchagarh-sadar", nameEn: "Panchagarh Sadar", nameBn: "পঞ্চগড় সদর" },
      { id: "tetulia", nameEn: "Tetulia", nameBn: "তেতুলিয়া" },
      { id: "atwari", nameEn: "Atwari", nameBn: "আটোয়ারী" },
      { id: "debiganj", nameEn: "Debiganj", nameBn: "দেবীগঞ্জ" },
      { id: "boda", nameEn: "Boda", nameBn: "বোদা" },
    ],
  },

  {
    id: "thakurgaon",
    name: "Thakurgaon",
    nameBn: "ঠাকুরগাঁও",
    colorClass: "bg-district-thakurgaon",
    population: "1.4M",
    area: "1,809 km²",
    upazilas: [
      { id: "thakurgaon-sadar", nameEn: "Thakurgaon Sadar", nameBn: "ঠাকুরগাঁও সদর" },
      { id: "ranisankail", nameEn: "Ranisankail", nameBn: "রানীশংকৈল" },
      { id: "baliadangi", nameEn: "Baliadangi", nameBn: "বালিয়াডাঙ্গী" },
      { id: "haripur", nameEn: "Haripur", nameBn: "হরিপুর" },
      { id: "pirganj", nameEn: "Pirganj", nameBn: "পীরগঞ্জ" },
    ],
  },

  {
    id: "gaibandha",
    name: "Gaibandha",
    nameBn: "গাইবান্ধা",
    colorClass: "bg-district-gaibandha",
    population: "2.4M",
    area: "2,114 km²",
    upazilas: [
      { id: "gobindaganj", nameEn: "Gobindaganj", nameBn: "গোবিন্দগঞ্জ" },
      { id: "saghata", nameEn: "Saghata", nameBn: "সাঘাটা" },
      { id: "palashbari", nameEn: "Palashbari", nameBn: "পলাশবাড়ী" },
      { id: "gaibandha-sadar", nameEn: "Gaibandha Sadar", nameBn: "গাইবান্ধা সদর" },
      { id: "sadullapur", nameEn: "Sadullapur", nameBn: "সাদুল্যাপুর" },
      { id: "sundarganj", nameEn: "Sundarganj", nameBn: "সুন্দরগঞ্জ" },
      { id: "phulchhari", nameEn: "Phulchhari", nameBn: "ফুলছড়ি" },
    ],
  },
];


export const getDistrictById = (id: string): District | undefined => {
  return districts.find((d) => d.id === id);
};

export const getUpazilaById = (district: string, upazila: string): Upazila | undefined => {
  return districts.find((d) => d.id === district)?.upazilas.find((u) => u.id === upazila);
};