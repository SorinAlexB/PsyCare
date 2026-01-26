import xml.etree.ElementTree as ET
import json

def parse_xml_to_dict(xml_file_path):
    """Parse the neurological expert system XML into a dictionary"""
    
    tree = ET.parse(xml_file_path)
    root = tree.getroot()
    
    # Initialize the main dictionary
    data = {}
    
    # Parse Knowledge Base
    knowledge_base = root.find('knowledge_base')
    data['knowledge_base'] = {}
    
    # Parse Symptoms
    symptoms_section = knowledge_base.find('symptoms')
    data['knowledge_base']['symptoms'] = {}
    for symptom in symptoms_section.findall('symptom'):
        symptom_id = symptom.get('id')
        data['knowledge_base']['symptoms'][symptom_id] = {
            'name': symptom.get('name')
        }
    
    # Parse Diseases
    diseases_section = knowledge_base.find('diseases')
    data['knowledge_base']['diseases'] = {}
    for disease in diseases_section.findall('disease'):
        disease_id = disease.get('id')
        data['knowledge_base']['diseases'][disease_id] = {
            'name': disease.get('name')
        }
    
    # Parse Risk Factors
    risk_factors_section = knowledge_base.find('risk_factors')
    data['knowledge_base']['risk_factors'] = {}
    for rf in risk_factors_section.findall('risk_factor'):
        rf_id = rf.get('id')
        data['knowledge_base']['risk_factors'][rf_id] = {
            'name': rf.get('name')
        }
    
    # Parse Treatments
    treatments_section = knowledge_base.find('treatments')
    data['knowledge_base']['treatments'] = {}
    for treatment in treatments_section.findall('treatment'):
        treatment_id = treatment.get('id')
        data['knowledge_base']['treatments'][treatment_id] = {
            'name': treatment.get('name')
        }
    
    # Parse Investigations
    investigations_section = knowledge_base.find('investigations')
    data['knowledge_base']['investigations'] = {}
    for investigation in investigations_section.findall('investigation'):
        inv_id = investigation.get('id')
        data['knowledge_base']['investigations'][inv_id] = {
            'name': investigation.get('name')
        }
    
    # Parse Diagnostic Rules
    diagnostic_rules_section = root.find('diagnostic_rules')
    data['diagnostic_rules'] = {}
    for rule in diagnostic_rules_section.findall('rule'):
        rule_id = rule.get('id')
        data['diagnostic_rules'][rule_id] = {
            'disease': rule.get('disease'),
            'required_symptoms': parse_required_symptoms(rule),
            'required_risk_factors': parse_required_risk_factors(rule)
        }
    
    # Parse Treatment Recommendations
    treatment_recommendations_section = root.find('treatment_recommendations')
    data['treatment_recommendations'] = {}
    for disease_treatment in treatment_recommendations_section.findall('disease_treatment'):
        disease = disease_treatment.get('disease')
        treatments = [t.get('ref') for t in disease_treatment.findall('treatment')]
        data['treatment_recommendations'][disease] = treatments
    
    # Parse Investigation Recommendations
    investigation_recommendations_section = root.find('investigation_recommendations')
    data['investigation_recommendations'] = {}
    for disease_investigation in investigation_recommendations_section.findall('disease_investigation'):
        disease = disease_investigation.get('disease')
        investigations = [i.get('ref') for i in disease_investigation.findall('investigation')]
        data['investigation_recommendations'][disease] = investigations
    
    # Parse Severity Levels
    severity_levels_section = root.find('severity_levels')
    data['severity_levels'] = []
    for level in severity_levels_section.findall('level'):
        data['severity_levels'].append({
            'name': level.get('name'),
            'min_symptoms': int(level.get('min_symptoms')),
            'max_symptoms': int(level.get('max_symptoms'))
        })
    
    # Parse Clinical Examples
    clinical_examples_section = root.find('clinical_examples')
    data['clinical_examples'] = {}
    for example in clinical_examples_section.findall('example'):
        example_id = example.get('id')
        
        # Parse symptoms
        symptoms = []
        symptoms_elem = example.find('symptoms')
        if symptoms_elem is not None:
            symptoms = [s.get('ref') for s in symptoms_elem.findall('symptom')]
        
        # Parse risk factors
        risk_factors = []
        rf_elem = example.find('risk_factors')
        if rf_elem is not None:
            risk_factors = [rf.get('ref') for rf in rf_elem.findall('risk_factor')]
        
        data['clinical_examples'][example_id] = {
            'name': example.get('name'),
            'symptoms': symptoms,
            'risk_factors': risk_factors
        }
    
    return data


def parse_required_symptoms(rule_element):
    """Parse required symptoms from a rule"""
    req_symptoms_elem = rule_element.find('required_symptoms')
    if req_symptoms_elem is None:
        return {}
    
    result = {
        'minimum_count': int(req_symptoms_elem.get('minimum_count', 0)),
        'symptoms': [],
        'symptom_groups': []
    }
    
    # Parse individual symptoms
    for symptom in req_symptoms_elem.findall('symptom'):
        result['symptoms'].append({
            'ref': symptom.get('ref'),
            'required': symptom.get('required') == 'true'
        })
    
    # Parse symptom groups
    for group in req_symptoms_elem.findall('symptom_group'):
        group_data = {
            'operator': group.get('operator'),
            'required': group.get('required') == 'true',
            'symptoms': [s.get('ref') for s in group.findall('symptom')]
        }
        result['symptom_groups'].append(group_data)
    
    return result


def parse_required_risk_factors(rule_element):
    """Parse required risk factors from a rule"""
    req_rf_elem = rule_element.find('required_risk_factors')
    if req_rf_elem is None:
        return {}
    
    result = {
        'risk_factors': [],
        'risk_factor_groups': []
    }
    
    # Parse individual risk factors
    for rf in req_rf_elem.findall('risk_factor'):
        result['risk_factors'].append({
            'ref': rf.get('ref'),
            'required': rf.get('required') == 'true'
        })
    
    # Parse risk factor groups
    for group in req_rf_elem.findall('risk_factor_group'):
        group_data = {
            'operator': group.get('operator'),
            'required': group.get('required') == 'true',
            'risk_factors': [rf.get('ref') for rf in group.findall('risk_factor')]
        }
        result['risk_factor_groups'].append(group_data)
    
    return result


def print_dictionary(data):
    """Print the dictionary in a readable format"""
    print("=" * 80)
    print("NEUROLOGICAL EXPERT SYSTEM - COMPLETE DATA")
    print("=" * 80)
    print(json.dumps(data, indent=2))


if __name__ == "__main__":
    xml_file = '../data/xml/neurological_system.xml'
    data_dict = parse_xml_to_dict(xml_file)

    print(f"Total Symptoms: {len(data_dict['knowledge_base']['symptoms'])}")
    print(f"Total Diseases: {len(data_dict['knowledge_base']['diseases'])}")
    print(f"Total Risk Factors: {len(data_dict['knowledge_base']['risk_factors'])}")
    print(f"Total Treatments: {len(data_dict['knowledge_base']['treatments'])}")
    print(f"Total Investigations: {len(data_dict['knowledge_base']['investigations'])}")
    print(f"Total Diagnostic Rules: {len(data_dict['diagnostic_rules'])}")
    print(f"Total Clinical Examples: {len(data_dict['clinical_examples'])}")

    with open('../data/json/neurological_system.json', 'w') as f:
        json.dump(data_dict, f, indent=2, ensure_ascii=False)