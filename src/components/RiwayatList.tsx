// src/components/RiwayatList.tsx
import { StyleSheet, Text, View } from "react-native";
import { RiwayatItem } from "../types/cuaca";

interface RiwayatListProps {
  daftarRiwayat: RiwayatItem[];
}

const WARNA_TINGKAT: Record<RiwayatItem["tingkat"], string> = {
  BAIK: "green",
  SEDANG: "orange",
  TIDAK_SEHAT: "red",
  BERBAHAYA: "purple",
};

export default function RiwayatList({ daftarRiwayat }: RiwayatListProps) {
  return (
    <View style={styles.tabel}>
      {/* Header tabel */}
      <View style={[styles.baris, styles.headerBaris]}>
        <Text style={[styles.selNo, styles.headerTeks]}>No</Text>
        <Text style={[styles.selKota, styles.headerTeks]}>Kota</Text>
        <Text style={[styles.selSuhu, styles.headerTeks]}>Suhu</Text>
        <Text style={[styles.selAQI, styles.headerTeks]}>AQI</Text>
        <Text style={[styles.selWaktu, styles.headerTeks]}>Diperbarui</Text>
      </View>

      {/* Isi tabel */}
      {daftarRiwayat.length === 0 ? (
        <View style={styles.baris}>
          <Text style={styles.kosong}>Belum ada riwayat pencarian</Text>
        </View>
      ) : (
        daftarRiwayat.map((item, index) => (
          <View
            key={item.kota}
            style={[styles.baris, index % 2 === 1 && styles.barisGanjil]}
          >
            <Text style={styles.selNo}>{index + 1}</Text>
            <Text style={styles.selKota}>{item.kota}</Text>
            <Text style={styles.selSuhu}>{item.suhu}°C</Text>
            <Text
              style={[styles.selAQI, { color: WARNA_TINGKAT[item.tingkat] }]}
            >
              {item.indeksAQI} ({item.tingkat})
            </Text>
            <Text style={styles.selWaktu}>{item.diperbaruiPada}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabel: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    overflow: "hidden",
  },
  baris: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  headerBaris: {
    backgroundColor: "#F3F4F6",
  },
  barisGanjil: {
    backgroundColor: "#FAFAFA",
  },
  headerTeks: {
    fontWeight: "bold",
    color: "#374151",
    fontSize: 12,
  },
  selNo: {
    width: 24,
    fontSize: 12,
  },
  selKota: {
    flex: 1.2,
    fontSize: 12,
  },
  selSuhu: {
    flex: 0.8,
    fontSize: 12,
  },
  selAQI: {
    flex: 1.3,
    fontSize: 12,
  },
  selWaktu: {
    flex: 1.5,
    fontSize: 10,
  },
  kosong: {
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});
