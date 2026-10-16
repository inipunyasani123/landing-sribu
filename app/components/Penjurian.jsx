'use client';

import { useState } from 'react';
import { KARYA, KONTES, rp } from '@/lib/sayembara';
import Karya from './Karya';

const MAKS = 3;
const no = (n) => String(n).padStart(2, '0');

export default function Penjurian() {
  const [finalis, setFinalis] = useState([]);
  const [pemenang, setPemenang] = useState(null);
  const [tahap, setTahap] = useState(1);

  const tandai = (n) => setFinalis((f) => (f.includes(n) ? f.filter((x) => x !== n) : f.length < MAKS ? [...f, n] : f));
  const ulang = () => { setFinalis([]); setPemenang(null); setTahap(1); };
  const juara = KARYA.find((k) => k.no === pemenang);

  const TAHAP = ['Tandai finalis', 'Tetapkan pemenang', 'Selesai'];

  return (
    <section id="juri" aria-labelledby="juri-h" className="scroll-mt-28 bg-cream-2 px-6 py-16 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
          <div>
            <p className="judge-label text-ember">Coba jadi juri · kontes contoh</p>
            <h2 id="juri-h" className="mt-4 font-[family-name:var(--font-shoulders)] text-5xl leading-[0.95] font-extrabold uppercase text-arena md:text-6xl">{KONTES.judul}</h2>
          </div>
          <div className="border-l-2 border-ember pl-5">
            <p className="leading-relaxed">{KONTES.brief}</p>
            <p className="mt-3 text-sm"><strong className="text-arena">Rasa:</strong> {KONTES.rasa.join(', ')} · <strong className="text-arena">Hadiah contoh:</strong> {rp(KONTES.hadiah)}</p>
          </div>
        </div>

        <ol aria-label="Tahap penjurian" className="mt-10 grid grid-cols-3 gap-1">
          {TAHAP.map((t, i) => (
            <li key={t} aria-current={tahap === i + 1 ? 'step' : undefined}>
              <span className={`block h-1.5 ${tahap > i ? 'bg-ember' : 'bg-arena/15'}`} />
              <span className={`judge-label mt-2 block ${tahap === i + 1 ? 'text-arena' : 'text-sepia'}`}>{i + 1}. {t}</span>
            </li>
          ))}
        </ol>

        <div role="status" className="mt-6 flex flex-col gap-4 border border-arena/15 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-kalam)] text-xl text-arena">
            {tahap === 1 && (finalis.length < MAKS ? `Pilih ${MAKS - finalis.length} karya lagi sebagai finalis.` : 'Tiga finalis terpilih. Lanjut ke penetapan pemenang.')}
            {tahap === 2 && 'Dari tiga finalis, karya mana yang menang?'}
            {tahap === 3 && juara && `Pemenang: No. ${no(juara.no)} oleh ${juara.oleh}. Hadiah dibayar, file akhir diserahkan.`}
          </p>
          <div className="flex shrink-0 gap-3">
            {tahap === 1 && <button type="button" disabled={finalis.length < MAKS} onClick={() => setTahap(2)} className="bg-ember px-5 py-3 text-sm font-semibold text-cream hover:bg-arena disabled:cursor-not-allowed disabled:bg-arena/25 disabled:text-arena/70">Lanjut</button>}
            {tahap > 1 && <button type="button" onClick={ulang} className="border border-arena/30 px-5 py-3 text-sm font-semibold text-arena hover:border-arena">Ulangi</button>}
          </div>
        </div>

        {/* Ponsel: dua kolom seperti lembar kontak, supaya sembilan karya tidak memanjang belasan layar. */}
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 lg:grid-cols-3">
          {KARYA.map((k) => {
            const fin = finalis.includes(k.no);
            const redup = tahap > 1 && !fin;
            return (
              <li key={k.no} className={`relative flex flex-col border bg-white p-2.5 transition-opacity sm:p-4 ${fin ? 'border-ember' : 'border-arena/15'} ${redup ? 'opacity-45' : ''}`}>
                <Karya gaya={k.gaya} uid={`juri-${k.no}`} label={`Karya nomor ${k.no} oleh ${k.oleh}`} />
                <div className="mt-2 flex flex-col sm:mt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                  <span className="entry-no font-[family-name:var(--font-shoulders)] text-2xl text-arena sm:text-3xl">No. {no(k.no)}</span>
                  <span className="truncate text-xs sm:text-sm">{k.oleh}</span>
                </div>
                <p className="mt-1 mb-3 flex-1 text-xs leading-relaxed sm:mb-4 sm:text-sm">{k.catatan}</p>
                {tahap === 1 && (
                  <button type="button" aria-pressed={fin} disabled={!fin && finalis.length >= MAKS} onClick={() => tandai(k.no)} className={`w-full border px-2 py-2.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm ${fin ? 'border-ember bg-ember text-cream' : 'border-arena/25 text-arena hover:border-arena'}`}>
                    {fin ? 'Finalis ✓' : 'Jadikan finalis'}<span className="sr-only"> — karya nomor {k.no}</span>
                  </button>
                )}
                {tahap === 2 && fin && (
                  <button type="button" onClick={() => { setPemenang(k.no); setTahap(3); }} className="w-full bg-arena px-2 py-2.5 text-xs font-semibold text-cream hover:bg-ember sm:px-4 sm:text-sm">
                    Tetapkan pemenang<span className="sr-only"> — karya nomor {k.no}</span>
                  </button>
                )}
                {tahap === 3 && fin && (
                  <span className={`stamp judge-label absolute top-2 right-2 bg-white px-2 py-1.5 sm:top-3 sm:right-3 sm:px-3 sm:py-2 ${pemenang === k.no ? 'text-ember' : 'text-laurel'}`}>{pemenang === k.no ? 'Pemenang' : 'Finalis'}</span>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-sm">Kontes, karya, dan nama desainer di atas fiktif — digambar untuk konsep halaman ini.</p>
      </div>
    </section>
  );
}
