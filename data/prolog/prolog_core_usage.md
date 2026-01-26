# USAGE INSTRUCTIONS:
 
1. Load the file in Prolog: ?- [filename].
2. Run predefined examples:
    ?- example_anxiety.
    ?- example_depression.
    ?- example_parkinsons.

3. Custom consultation:
    ?- consultation([symptom1, symptom2, ...], [factor1, factor2, ...]).

4. Specific queries:
    ?- diagnose(Disease, [seizures, loss_of_consciousness], [head_trauma]).
    ?- all_treatments(major_depression, Treatments).
    ?- calculate_severity([symptom1, symptom2, symptom3], Severity).
