% Facts

% General symptoms
symptom(excessive_nervousness).
symptom(persistent_worry).
symptom(heart_palpitations).
symptom(excessive_sweating).
symptom(tremors).
symptom(chronic_fatigue).
symptom(concentration_difficulties).
symptom(irritability).
symptom(muscle_tension).
symptom(sleep_disturbances).
symptom(persistent_sadness).
symptom(loss_of_interest).
symptom(appetite_changes).
symptom(suicidal_thoughts).
symptom(guilt_feelings).
symptom(pulsating_headache).
symptom(light_sensitivity).
symptom(nausea_vomiting).
symptom(seizures).
symptom(loss_of_consciousness).
symptom(muscle_rigidity).
symptom(resting_tremor).
symptom(slowness_of_movement).
symptom(postural_instability).
symptom(recent_memory_loss).
symptom(time_space_disorientation).
symptom(speech_difficulties).
symptom(personality_changes).
symptom(judgment_difficulties).
symptom(limb_numbness).
symptom(tingling_sensation).
symptom(muscle_weakness).
symptom(neuropathic_pain).
symptom(projectile_vomiting).
symptom(morning_headache).

% Neurological diseases
disease(generalized_anxiety_disorder).
disease(panic_disorder).
disease(major_depression).
disease(chronic_migraine).
disease(epilepsy).
disease(parkinsons_disease).
disease(alzheimers_disease).
disease(peripheral_neuropathy).
disease(brain_tumor).
disease(multiple_sclerosis).

% Risk factors
risk_factor(chronic_stress).
risk_factor(genetic_predisposition).
risk_factor(head_trauma).
risk_factor(advanced_age).
risk_factor(diabetes).
risk_factor(hypertension).
risk_factor(alcohol_consumption).
risk_factor(smoking).
risk_factor(sedentary_lifestyle).
risk_factor(obesity).

% Treatments
treatment(cognitive_behavioral_therapy).
treatment(antidepressant_medication).
treatment(anxiolytic_medication).
treatment(triptans).
treatment(anticonvulsants).
treatment(levodopa).
treatment(cholinesterase_inhibitors).
treatment(physiotherapy).
treatment(occupational_therapy).
treatment(lifestyle_modifications).

% Required investigations
investigation(psychiatric_evaluation).
investigation(cognitive_tests).
investigation(brain_mri).
investigation(brain_ct).
investigation(eeg).
investigation(blood_tests).
investigation(reflex_testing).
investigation(emg).


% Rules


% Rule 1: Generalized anxiety disorder
diagnose(generalized_anxiety_disorder, Symptoms, Factors) :-
    member(persistent_worry, Symptoms),
    member(excessive_nervousness, Symptoms),
    member(concentration_difficulties, Symptoms),
    once((member(muscle_tension, Symptoms) ; member(sleep_disturbances, Symptoms)),
    length(Symptoms, N),
    N >= 4,
    once((member(chronic_stress, Factors) ; member(genetic_predisposition, Factors))).

% Rule 2: Panic disorder
diagnose(panic_disorder, Symptoms, _) :-
    member(heart_palpitations, Symptoms),
    member(excessive_sweating, Symptoms),
    member(tremors, Symptoms),
    member(excessive_nervousness, Symptoms),
    length(Symptoms, N),
    N >= 4.

% Rule 3: Major depression
diagnose(major_depression, Symptoms, Factors) :-
    member(persistent_sadness, Symptoms),
    member(loss_of_interest, Symptoms),
    once((member(appetite_changes, Symptoms) ; member(sleep_disturbances, Symptoms))),
    (member(chronic_fatigue, Symptoms) ; member(concentration_difficulties, Symptoms)),
    length(Symptoms, N),
    N >= 5,
    once((member(chronic_stress, Factors) ; member(genetic_predisposition, Factors))).

% Rule 4: Chronic migraine
diagnose(chronic_migraine, Symptoms, _) :-
    member(pulsating_headache, Symptoms),
    once((member(light_sensitivity, Symptoms) ; member(nausea_vomiting, Symptoms))),
    length(Symptoms, N),
    N >= 2.

% Rule 5: Epilepsy
diagnose(epilepsy, Symptoms, Factors) :-
    member(seizures, Symptoms),
    once((member(loss_of_consciousness, Symptoms) ; member(tremors, Symptoms))),
    (member(head_trauma, Factors) ; member(genetic_predisposition, Factors)).

% Rule 6: Parkinson disease
diagnose(parkinsons_disease, Symptoms, Factors) :-
    member(resting_tremor, Symptoms),
    member(muscle_rigidity, Symptoms),
    member(slowness_of_movement, Symptoms),
    member(advanced_age, Factors).

% Rule 7: Alzheimer disease
diagnose(alzheimers_disease, Symptoms, Factors) :-
    member(recent_memory_loss, Symptoms),
    member(time_space_disorientation, Symptoms),
    once((member(speech_difficulties, Symptoms) ; member(judgment_difficulties, Symptoms))),
    member(advanced_age, Factors),
    length(Symptoms, N),
    N >= 3.

% Rule 8: Peripheral neuropathy
diagnose(peripheral_neuropathy, Symptoms, Factors) :-
    member(limb_numbness, Symptoms),
    member(tingling_sensation, Symptoms),
    once((member(neuropathic_pain, Symptoms) ; member(muscle_weakness, Symptoms))),
    (member(diabetes, Factors) ; member(alcohol_consumption, Factors)).

% Rule 9: Brain tumor (suspicion)
diagnose(brain_tumor, Symptoms, _) :-
    member(morning_headache, Symptoms),
    member(projectile_vomiting, Symptoms),
    once((member(seizures, Symptoms) ; member(personality_changes, Symptoms))),
    length(Symptoms, N),
    N >= 3.

% Rule 10: Multiple sclerosis
diagnose(multiple_sclerosis, Symptoms, _) :-
    member(muscle_weakness, Symptoms),
    member(limb_numbness, Symptoms),
    once((member(speech_difficulties, Symptoms) ; member(tremors, Symptoms))),
    !,
    length(Symptoms, N),
    N >= 3.

% Rule 11: Psychotherapy recommendation for anxiety
recommend_treatment(generalized_anxiety_disorder, cognitive_behavioral_therapy).
recommend_treatment(generalized_anxiety_disorder, anxiolytic_medication).
recommend_treatment(generalized_anxiety_disorder, lifestyle_modifications).

% Rule 12: Treatment recommendation for depression
recommend_treatment(major_depression, cognitive_behavioral_therapy).
recommend_treatment(major_depression, antidepressant_medication).
recommend_treatment(major_depression, lifestyle_modifications).

% Rule 13: Treatment recommendation for migraine
recommend_treatment(chronic_migraine, triptans).
recommend_treatment(chronic_migraine, lifestyle_modifications).

% Rule 14: Treatment recommendation for epilepsy
recommend_treatment(epilepsy, anticonvulsants).

% Rule 15: Treatment recommendation for Parkinson
recommend_treatment(parkinsons_disease, levodopa).
recommend_treatment(parkinsons_disease, physiotherapy).
recommend_treatment(parkinsons_disease, occupational_therapy).

% Rule 16: Treatment recommendation for Alzheimer
recommend_treatment(alzheimers_disease, cholinesterase_inhibitors).
recommend_treatment(alzheimers_disease, occupational_therapy).

% Rule 17: Investigations for anxiety/depression
recommend_investigation(generalized_anxiety_disorder, psychiatric_evaluation).
recommend_investigation(panic_disorder, psychiatric_evaluation).
recommend_investigation(major_depression, psychiatric_evaluation).
recommend_investigation(major_depression, blood_tests).

% Rule 18: Investigations for structural brain diseases
recommend_investigation(brain_tumor, brain_mri).
recommend_investigation(brain_tumor, brain_ct).
recommend_investigation(alzheimers_disease, brain_mri).
recommend_investigation(alzheimers_disease, cognitive_tests).

% Rule 19: Investigations for epilepsy
recommend_investigation(epilepsy, eeg).
recommend_investigation(epilepsy, brain_mri).

% Rule 20: Investigations for neuropathy
recommend_investigation(peripheral_neuropathy, emg).
recommend_investigation(peripheral_neuropathy, blood_tests).

% List processing

% Processing 1: Calculate severity based on number of symptoms
calculate_severity(Symptoms, Severity) :-
    length(Symptoms, NumSymptoms),
    (NumSymptoms >= 7 -> Severity = severe ;
     NumSymptoms >= 4 -> Severity = moderate ;
     Severity = mild).

% Processing 2: Extract all recommended treatments for a disease
all_treatments(Disease, TreatmentList) :-
    findall(Treatment, recommend_treatment(Disease, Treatment), TreatmentList).

% Processing 3: Extract all required investigations
all_investigations(Disease, InvestigationList) :-
    findall(Investigation, recommend_investigation(Disease, Investigation), InvestigationList).

% Processing 4: Filter common symptoms between two lists
common_symptoms(List1, List2, Common) :-
    intersection(List1, List2, Common).

% Processing 5: Count how many diseases can be diagnosed with given symptoms
number_of_possible_diagnoses(Symptoms, Factors, Number) :-
    findall(Disease, diagnose(Disease, Symptoms, Factors), DiseaseList),
    length(DiseaseList, Number).

% Processing 6: Find all possible diseases
all_possible_diagnoses(Symptoms, Factors, Diseases) :-
    findall(Disease, diagnose(Disease, Symptoms, Factors), Diseases).

% Complete consultation for a patient
consultation(Symptoms, Factors) :-
    write('- - - NEUROLOGICAL DIAGNOSTIC EXPERT SYSTEM - - -'), nl, nl,
    write('Symptoms analyzed: '), write(Symptoms), nl,
    write('Risk factors: '), write(Factors), nl, nl,
    
    % Calculate severity
    calculate_severity(Symptoms, Severity),
    write('Symptom severity: '), write(Severity), nl, nl,
    
    % Find all possible diagnoses
    findall(Disease, diagnose(Disease, Symptoms, Factors), Diagnoses),
    
    (Diagnoses = [] ->
        write('No clear neurological diseases identified.'), nl,
        write('Recommendation: Consult a physician for additional investigations.'), nl
    ;
        write('Possible diagnoses:'), nl,
        display_diagnoses(Diagnoses)
    ).

% Display each diagnosis with treatments and investigations
display_diagnoses([]).
display_diagnoses([Disease|Rest]) :-
    nl,
    write('>> '), write(Disease), nl,
    
    % Treatments
    all_treatments(Disease, Treatments),
    write('   Recommended treatments: '), nl,
    display_list(Treatments),

    all_investigations(Disease, Investigations),
    write('   Required investigations: '), nl,
    display_list(Investigations),
    
    display_diagnoses(Rest).

% Helper for displaying lists
display_list([]).
display_list([Element|Rest]) :-
    write('   - '), write(Element), nl,
    display_list(Rest).

% Examples:

% Example 1: Patient with anxiety
example_anxiety :-
    Symptoms = [excessive_nervousness, persistent_worry, 
                heart_palpitations, concentration_difficulties, 
                muscle_tension, sleep_disturbances],
    Factors = [chronic_stress, sedentary_lifestyle],
    consultation(Symptoms, Factors).

% Example 2: Patient with depression
example_depression :-
    Symptoms = [persistent_sadness, loss_of_interest, 
                chronic_fatigue, sleep_disturbances, 
                appetite_changes, concentration_difficulties],
    Factors = [chronic_stress, genetic_predisposition],
    consultation(Symptoms, Factors).

% Example 3: Patient with Parkinson
example_parkinsons :-
    Symptoms = [resting_tremor, muscle_rigidity, 
                slowness_of_movement, postural_instability],
    Factors = [advanced_age],
    consultation(Symptoms, Factors).

% Example 4: Patient with Alzheimer
example_alzheimers :-
    Symptoms = [recent_memory_loss, time_space_disorientation,
                speech_difficulties, personality_changes],
    Factors = [advanced_age, genetic_predisposition],
    consultation(Symptoms, Factors).

% Example 5: Patient with epilepsy
example_epilepsy :-
    Symptoms = [seizures, loss_of_consciousness, tremors],
    Factors = [head_trauma],
    consultation(Symptoms, Factors).
