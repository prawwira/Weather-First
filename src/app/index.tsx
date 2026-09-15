// app/index.tsx
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IndikatorAQI from "../components/IndikatorAQI";
import RiwayatList from "../components/RiwayatList";
import SearchBox from "../components/SearchBox";
import WeatherCard from "../components/WeatherCard";
import { ambilAQI, ambilCuaca, cariKoordinatKota } from "../services/cuacaApi";
import { RiwayatItem, TingkatAQI } from "../types/cuaca";

export default function HalamanUtama() {
  const [kotaAktif, setKotaAktif] = useState("Pekalongan");
  const [riwayat, setRiwayat] = useState<RiwayatItem[]>([]);

  const [suhu, setSuhu] = useState<number | null>(null);
  const [nilaiAQI, setNilaiAQI] = useState<number | null>(null);
  const [tingkatAQI, setTingkatAQI] = useState<TingkatAQI>("BAIK");
  const [loading, setLoading] = useState(false);
  const [errorPesan, setErrorPesan] = useState<string | null>(null);

  useEffect(() => {
    async function muatData() {
      setLoading(true);
      setErrorPesan(null);
      try {
        const lokasi = await cariKoordinatKota(kotaAktif);
        if (!lokasi) {
          setErrorPesan("Kota tidak ditemukan");
          setLoading(false);
          return;
        }

        const [suhuHasil, aqiHasil] = await Promise.all([
          ambilCuaca(lokasi.latitude, lokasi.longitude),
          ambilAQI(lokasi.latitude, lokasi.longitude),
        ]);

        setSuhu(suhuHasil);
        setNilaiAQI(aqiHasil.nilaiAQI);
        setTingkatAQI(aqiHasil.tingkat);

        const waktuSekarang = new Date().toLocaleString("id-ID");
        const itemBaru: RiwayatItem = {
          kota: kotaAktif,
          suhu: suhuHasil,
          indeksAQI: aqiHasil.nilaiAQI,
          tingkat: aqiHasil.tingkat,
          diperbaruiPada: waktuSekarang,
        };

        setRiwayat((sebelumnya) => {
          const sudahAda = sebelumnya.some((item) => item.kota === kotaAktif);
          if (sudahAda) {
            return sebelumnya.map((item) =>
              item.kota === kotaAktif ? itemBaru : item,
            );
          }
          return [...sebelumnya, itemBaru];
        });
      } catch (e) {
        setErrorPesan("Gagal mengambil data cuaca");
      } finally {
        setLoading(false);
      }
    }

    muatData();
  }, [kotaAktif]);

  function handleCari(kota: string) {
    setKotaAktif(kota);
  }
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 24, gap: 16 }}
      >
        <SearchBox onCari={handleCari} />

        {loading && <ActivityIndicator />}
        {errorPesan && <Text style={{ color: "red" }}>{errorPesan}</Text>}

        {!loading && !errorPesan && suhu !== null && (
          <>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Cuaca</Text>
            <WeatherCard kota={kotaAktif} suhu={suhu} tingkatAQI={tingkatAQI} />

            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Laporan Kualitas Udara
            </Text>
            <IndikatorAQI
              kota={kotaAktif}
              indeksAQI={nilaiAQI ?? 0}
              tingkat={tingkatAQI}
              diperbaruiPada={new Date().toLocaleString("id-ID")}
            />
          </>
        )}

        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Riwayat Pencarian
        </Text>
        <RiwayatList daftarRiwayat={riwayat} />
      </ScrollView>
    </SafeAreaView>
  );
}
