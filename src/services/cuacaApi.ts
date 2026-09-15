// src/services/cuacaApi.ts
export interface HasilGeocoding {
  nama: string;
  latitude: number;
  longitude: number;
}

export async function cariKoordinatKota(
  kota: string,
): Promise<HasilGeocoding | null> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(kota)}&count=1&language=id`,
  );
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    return null;
  }

  const hasil = data.results[0];
  return {
    nama: hasil.name,
    latitude: hasil.latitude,
    longitude: hasil.longitude,
  };
}

export async function ambilCuaca(latitude: number, longitude: number) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`,
  );
  const data = await res.json();
  return data.current.temperature_2m as number;
}

export async function ambilAQI(latitude: number, longitude: number) {
  const res = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`,
  );
  const data = await res.json();
  const nilaiAQI = data.current.us_aqi as number;

  let tingkat: "BAIK" | "SEDANG" | "TIDAK_SEHAT" | "BERBAHAYA";
  if (nilaiAQI <= 50) tingkat = "BAIK";
  else if (nilaiAQI <= 100) tingkat = "SEDANG";
  else if (nilaiAQI <= 200) tingkat = "TIDAK_SEHAT";
  else tingkat = "BERBAHAYA";

  return { nilaiAQI, tingkat };
}
