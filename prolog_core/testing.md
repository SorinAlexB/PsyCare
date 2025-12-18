# Neurological Diagnostic Expert System (Prolog)

Acest proiect implementează un **expert system neurologic** în Prolog, bazat pe simptome și factori de risc, capabil să:

* sugereze posibile diagnostice
* estimeze severitatea cazului
* recomande tratamente
* recomande investigații medicale

⚠️ Sistem educațional / demonstrativ. NU înlocuiește un medic.

---

## 1. Rulare proiect

### Cerințe

* **SWI-Prolog** (recomandat)

### Pași

```bash
swipl
```

```prolog
?- [neurology].
```

---

## 2. Rulare exemple predefinite

Rulează direct următoarele interogări:

```prolog
?- example_anxiety.
?- example_depression.
?- example_parkinsons.
?- example_alzheimers.
?- example_epilepsy.
```

Fiecare va afișa:

* simptomele analizate
* factorii de risc
* severitatea
* diagnosticele posibile
* tratamentele și investigațiile recomandate

---

## 3. Exemple suplimentare (variații de liste)

### 3.1 Caz ușor – severitate mică

```prolog
?- example_mild_anxiety.
```

Simptome puține → severitate *mild*.

---

### 3.2 Caz sever – multe simptome

```prolog
?- example_severe_depression.
```

Număr mare de simptome → severitate *severe*.

---

### 3.3 Simptome fără factori de risc

```prolog
?- example_no_risk_factor.
```

Nu se pune diagnostic deoarece lipsesc factorii necesari.

---

### 3.4 Simptome mixte – diagnostice multiple

```prolog
?- example_multiple_diagnoses.
```

Demonstrează că sistemul poate returna **mai multe diagnostice simultan**.

---

### 3.5 Suspiciune neurologică gravă

```prolog
?- example_brain_tumor_suspicion.
```

Activează investigații imagistice (MRI / CT).

---

### 3.6 Modificare minimă → boală diferită

```prolog
?- example_ms_variant.
```

O mică schimbare în listă produce un diagnostic diferit (MS).

---

## 4. Rulare caz personalizat

Poți apela direct predicatul principal:

```prolog
?- consultation(
     [persistent_sadness, loss_of_interest, chronic_fatigue],
     [chronic_stress]
   ).
```

---

## 5. Observații

* Diagnosticele sunt **rule-based**, nu probabilistice
* Ordinea și prezența simptomelor contează
* Sistemul poate fi extins cu:

  * scoruri
  * explicații ale deciziei
  * fuzzy logic / probabilități

---

Autor: proiect educațional Prolog – expert system neurologic
