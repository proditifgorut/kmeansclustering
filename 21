import React from 'react';
import { BookOpen } from 'lucide-react';

export const Theory: React.FC = () => {
  return (
    <section className="mt-12">
      <details className="card cursor-pointer p-6">
        <summary className="flex items-center gap-3 text-lg font-semibold text-white">
          <BookOpen className="text-brand-purple" />
          Bagaimana Cara Kerja Klastering K-Means?
        </summary>
        <div className="prose prose-invert mt-4 max-w-none text-slate-400">
          <p>
            K-Means adalah algoritma pembelajaran mesin tak terarah (unsupervised learning) yang digunakan untuk menemukan kelompok (klaster) dalam sebuah dataset. "K" mengacu pada jumlah klaster yang ingin Anda temukan. Algoritma ini bekerja secara berulang untuk menetapkan setiap titik data ke salah satu dari K kelompok berdasarkan fitur-fiturnya.
          </p>
          <ol>
            <li>
              <strong>Inisialisasi:</strong> Pertama, K "centroid" dipilih secara acak dari titik-titik data. Centroid ini adalah pusat awal dari klaster Anda.
            </li>
            <li>
              <strong>Langkah Penetapan (Assignment):</strong> Setiap titik data ditetapkan ke centroid terdekatnya, berdasarkan jarak garis lurus (Euclidean). Langkah ini mengelompokkan data ke dalam K klaster.
            </li>
            <li>
              <strong>Langkah Pembaruan (Update):</strong> Pusat dari setiap klaster dihitung ulang. Centroid baru adalah nilai rata-rata (mean) dari semua titik data yang termasuk dalam klaster tersebut.
            </li>
            <li>
              <strong>Ulangi:</strong> Langkah 2 dan 3 diulangi hingga centroid tidak lagi bergerak secara signifikan, atau jumlah iterasi maksimum tercapai. Ini berarti klaster telah stabil.
            </li>
          </ol>
          <p>
            Tujuannya adalah untuk meminimalkan "inersia," yaitu jumlah kuadrat jarak antara titik data dan centroid terdekatnya. Inersia yang lebih rendah umumnya berarti hasil klastering yang lebih baik.
          </p>
        </div>
      </details>
    </section>
  );
};
