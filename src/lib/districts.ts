export interface District {
  id: string;
  name: string;
  nameBn: string;
  colorClass: string;
  population: string;
  area: string;
}

export const districts: District[] = [
  {
    id: "rangpur",
    name: "Rangpur",
    nameBn: "রংপুর",
    colorClass: "bg-district-rangpur",
    population: "2.9M",
    area: "2,368 km²",
  },
  {
    id: "dinajpur",
    name: "Dinajpur",
    nameBn: "দিনাজপুর",
    colorClass: "bg-district-dinajpur",
    population: "3.0M",
    area: "3,437 km²",
  },
  {
    id: "kurigram",
    name: "Kurigram",
    nameBn: "কুড়িগ্রাম",
    colorClass: "bg-district-kurigram",
    population: "2.1M",
    area: "2,296 km²",
  },
  {
    id: "lalmonirhat",
    name: "Lalmonirhat",
    nameBn: "লালমনিরহাট",
    colorClass: "bg-district-lalmonirhat",
    population: "1.3M",
    area: "1,241 km²",
  },
  {
    id: "nilphamari",
    name: "Nilphamari",
    nameBn: "নীলফামারী",
    colorClass: "bg-district-nilphamari",
    population: "1.8M",
    area: "1,546 km²",
  },
  {
    id: "panchagarh",
    name: "Panchagarh",
    nameBn: "পঞ্চগড়",
    colorClass: "bg-district-panchagarh",
    population: "1.0M",
    area: "1,405 km²",
  },
  {
    id: "thakurgaon",
    name: "Thakurgaon",
    nameBn: "ঠাকুরগাঁও",
    colorClass: "bg-district-thakurgaon",
    population: "1.4M",
    area: "1,809 km²",
  },
  {
    id: "gaibandha",
    name: "Gaibandha",
    nameBn: "গাইবান্ধা",
    colorClass: "bg-district-gaibandha",
    population: "2.4M",
    area: "2,114 km²",
  },
];

export const getDistrictById = (id: string): District | undefined => {
  return districts.find((d) => d.id === id);
};
