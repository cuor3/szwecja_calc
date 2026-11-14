# Zwrot podatku ze Szwecji – kalkulator 2024 / 2025

Kalkulator szacujący wynik rocznego rozliczenia w Szwecji (Inkomstdeklaration 1) dla pracowników poniżej 66 lat, w szczególności pracowników z Polski. Interfejs po polsku i szwedzku.

**Co liczy:**

- grundavdrag, podatek gminny i państwowy, jobbskatteavdrag, skattereduktion för förvärvsinkomst, public service-avgift,
- odliczenia z ruty 2.1–2.4: dojazdy, podróże służbowe (traktamente), praca tymczasowa, podwójne zamieszkanie, podróże do domu, pozostałe koszty,
- expertskatt (25% zwolnienia),
- porównanie z SINK 25%,
- zestawienie kwot do wpisania w deklaracji.

## Uruchomienie

Projekt nie wymaga budowania. Wystarczy otworzyć `index.html` w przeglądarce.

**GitHub Pages:** Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.

## Testy

Wymagany Node.js 18 lub nowszy:

```bash
node --test
```

Testy sprawdzają wynik co do korony na zanonimizowanym przypadku z decyzji Skatteverket za 2025 r., w wariancie przed i po zmianie. Sprawdzają też wartości graniczne grundavdrag i progi odliczeń. GitHub Actions uruchamia je przy każdym pushu.

## Struktura

| Plik | Zawartość |
|---|---|
| `index.html` | interfejs, tłumaczenia PL/SV |
| `calc.js` | parametry podatkowe i logika obliczeń |
| `test/calc.test.js` | testy (`node:test`) |

## Parametry

| | 2024 | 2025 |
|---|---|---|
| Prisbasbelopp | 57 300 | 58 800 |
| Skiktgräns | 598 500 | 625 800 |
| Grundavdrag min–max | 16 800–44 200 | 17 300–45 300 |
| Public service – maks. | 1 219 | 1 249 |
| Traktamente – pełny / pół dnia / noc | 290 / 145 / 145 | 290 / 145 / 145 |
| Praca tymczasowa – posiłki w 1. miesiącu | 145 / dzień | 145 / dzień |
| Podwójne zamieszkanie – posiłki w 1. miesiącu | 87 / dzień | 87 / dzień |
| Próg ruty 2.1 / 2.4 | 11 000 / 5 000 | 11 000 / 5 000 |
| SINK | 25% | 25% |

Wszystkie parametry są w obiekcie `P` w pliku `calc.js`. Aby dodać kolejny rok, dopisz nowy klucz w `P` i przycisk w `#yearSeg` w pliku `index.html`. Od 2026 r. zmieniają się m.in. SINK (22,5%), traktamente (300 kr) i próg ruty 2.1 (15 000 kr).

## Ograniczenia

- Kalkulator nie uwzględnia dochodów kapitałowych, nieruchomości, ROT/RUT, osób w wieku 66+ ani sjöinkomst.
- Opłata pogrzebowa i kościelna dotyczą tylko osób zameldowanych w Szwecji (folkbokförda). Dla osób mieszkających w Polsce wpisz 0.
- Jeśli Skatteverket przenosi dochód opodatkowany SINK do zwykłego rozliczenia, do pobranej zaliczki trzeba doliczyć pobrany SINK.

**Uwaga:** wyniki są szacunkowe. Ostateczną kwotę podatku ustala Skatteverket.

## Źródła

- [Skatteverket – Belopp och procent](https://www.skatteverket.se/privat/skatter/beloppochprocent)
- [Skatteverket – Traktamente](https://www.skatteverket.se/privat/skatter/arbeteochinkomst/traktamente)
- [Skatteverket – Avdragslexikon](https://www.skatteverket.se/privat/skatter/arbeteochinkomst/avdragforprivatpersoner.4.5fc8c94513259a4ba1d800042751.html)
- [Skatteverket – SINK](https://www.skatteverket.se/sink)
- Inkomstskattelagen (1999:1229) – 63 kap. (grundavdrag), 67 kap. (skattereduktioner)

---

### Svenska

Kalkylator för slutlig skatt och skatteåterbäring för inkomståren 2024 och 2025. Den hanterar grundavdrag, jobbskatteavdrag, skattereduktion för förvärvsinkomst, traktamente, tillfälligt arbete, dubbel bosättning och hemresor, samt jämförelse med SINK. Resultatet är en uppskattning.
