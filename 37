import React from 'react';
import { BookOpen, BrainCircuit } from 'lucide-react';

export const PsoTheory: React.FC = () => {
  return (
    <section className="mt-12">
      <details className="card cursor-pointer p-6">
        <summary className="flex items-center gap-3 text-lg font-semibold text-white">
          <BrainCircuit className="text-brand-purple" />
          Optimalisasi K-Means dengan Particle Swarm Optimization (PSO)
        </summary>
        <div className="prose prose-invert mt-4 max-w-none text-slate-400">
          <p>
            Klastering K-Means standar memiliki kelemahan: hasilnya sangat bergantung pada posisi awal centroid yang dipilih secara acak. Inisialisasi yang buruk dapat menyebabkan algoritma terjebak pada solusi "cukup baik" (local optimum) dan bukan yang terbaik (global optimum). Di sinilah Particle Swarm Optimization (PSO) berperan.
          </p>
          <h4>Konsep Hybrid PSO-KMeans</h4>
          <p>
            PSO adalah algoritma optimasi yang terinspirasi dari perilaku sosial kawanan burung atau ikan. Dalam konteks ini, kita menggunakan PSO untuk mencari set posisi centroid awal terbaik untuk K-Means.
          </p>
          <ol>
            <li>
              <strong>Inisialisasi Swarm:</strong> Kita membuat "kawanan" (swarm) yang terdiri dari banyak "partikel". Setiap partikel adalah satu set lengkap dari K posisi centroid (sebuah solusi potensial).
            </li>
            <li>
              <strong>Evaluasi Fitness:</strong> Setiap partikel dievaluasi menggunakan "fungsi fitness". Tujuannya adalah untuk meminimalkan total jarak kuadrat dalam klaster (Within-Cluster Sum of Squares - WCSS). Semakin kecil nilai WCSS, semakin baik (fit) partikel tersebut.
            </li>
            <li>
              <strong>Pembaruan Partikel:</strong> Partikel "terbang" melalui ruang solusi. Setiap partikel memperbarui posisinya berdasarkan dua informasi kunci:
              <ul>
                <li><strong>Personal Best (pbest):</strong> Posisi terbaik yang pernah dicapai oleh partikel itu sendiri.</li>
                <li><strong>Global Best (gbest):</strong> Posisi terbaik yang pernah dicapai oleh seluruh partikel dalam swarm.</li>
              </ul>
            </li>
            <li>
              <strong>Iterasi PSO:</strong> Langkah 2 dan 3 diulangi beberapa kali. Seiring waktu, seluruh swarm akan konvergen menuju area di ruang solusi yang memiliki nilai fitness terbaik.
            </li>
            <li>
              <strong>Finalisasi dengan K-Means:</strong> Setelah iterasi PSO selesai, kita mengambil posisi centroid dari partikel terbaik (gbest). Posisi inilah yang kita gunakan sebagai titik awal yang "cerdas" untuk algoritma K-Means standar. K-Means kemudian berjalan seperti biasa untuk menyempurnakan posisi centroid tersebut.
            </li>
          </ol>
          <h4>Keuntungan</h4>
          <p>
            Dengan menggunakan PSO untuk menemukan titik awal yang lebih baik, kita secara signifikan meningkatkan peluang K-Means untuk menemukan hasil klastering yang lebih akurat dan stabil, serta menghindari hasil yang kurang optimal.
          </p>
        </div>
      </details>
    </section>
  );
};
