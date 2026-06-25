export interface ParamItem {
  g?: string;
  key?: string;
  lb?: string;
  tag?: string;
  opts?: string[];
  ph?: string;
}

export const CP: Record<string, ParamItem[]> = {
  "chest pain": [
    { g: "SOCRATES" },
    { key: "site", lb: "Site", tag: "S", ph: "Central / retrosternal / left / right" },
    { key: "onset", lb: "Onset", tag: "O", opts: ["Sudden", "Crescendo", "Gradual"] },
    { key: "character", lb: "Character", tag: "C", opts: ["Heaviness/tightness", "Crushing", "Burning", "Sharp/stabbing", "Tearing/ripping", "Dull ache", "Pressure"] },
    { key: "radiation", lb: "Radiation", tag: "R", opts: ["Left arm", "Jaw/neck", "Right arm", "Back/interscapular", "Shoulder", "Epigastric", "None"] },
    { key: "severity", lb: "Severity 0–10", tag: "Se", ph: "0=none, 10=worst ever" },
    { key: "timing", lb: "Duration of episode", tag: "T", ph: "Minutes (angina/PE) vs hours (MI/pericarditis)" },
    { key: "pattern", lb: "Pattern", tag: "T", opts: ["Continuous", "Episodic", "Worsening", "Exertional only", "Rest only"] },
    { key: "provoke", lb: "Provoking", tag: "E", opts: ["Exertion", "Inspiration/cough", "Lying flat", "Food/bending", "Cold weather", "Stress", "Spontaneous"] },
    { key: "relieve", lb: "Relieving", tag: "E", opts: ["Rest", "GTN spray", "Leaning forward", "Antacids", "Analgesia", "Nothing"] },
    { g: "Associated" },
    { key: "assoc", lb: "Associated symptoms", tag: "A", opts: ["Breathlessness", "Sweating", "Nausea/vomiting", "Palpitations", "Syncope", "Haemoptysis", "Fever"] },
    { key: "exert_tol", lb: "Exercise tolerance", ph: "Distance on flat / flights of stairs before pain" },
    { key: "gtn", lb: "GTN response", opts: ["Relieved <5min (angina)", "Relieved >5min", "No relief (ACS/non-cardiac)", "Not tried"] }
  ],
  "dyspnoea": [
    { g: "Onset & Grade" },
    { key: "onset_type", lb: "Onset", tag: "O", opts: ["Minutes (PE/PTX/LVF)", "Hours (asthma/LVF)", "Days (pneumonia)", "Weeks (COPD/effusion)", "Months (fibrosis)"] },
    { key: "mrc", lb: "MRC Grade", tag: "Se", opts: ["1 — strenuous only", "2 — hurrying/hills", "3 — slower than peers", "4 — stops 100m", "5 — housebound"] },
    { key: "pattern", lb: "Pattern", opts: ["Exertional only", "At rest", "Nocturnal", "Worse mornings (asthma)", "Constant"] },
    { g: "Positional / Nocturnal" },
    { key: "ortho", lb: "Orthopnoea", opts: ["None", "1 pillow", "2 pillows", "3+ pillows", "Sleeps sitting"] },
    { key: "pnd", lb: "PND", opts: ["Present — wakes gasping", "Absent"] },
    { g: "Associated" },
    { key: "wheeze", lb: "Wheeze", opts: ["Expiratory", "Inspiratory (stridor — emergency)", "Both", "None"] },
    { key: "cough", lb: "Cough", opts: ["Dry", "Productive", "Nocturnal", "None"] },
    { key: "sputum", lb: "Sputum", opts: ["Clear", "Yellow-green", "Frothy pink (APO)", "Blood-stained", "None"] },
    { key: "ankle_sw", lb: "Ankle swelling", opts: ["Bilateral pitting", "Unilateral", "None"] },
    { key: "triggers", lb: "Triggers", opts: ["Exercise", "Allergens", "Cold air", "Lying flat", "Spontaneous", "None"] }
  ],
  "palpitations": [
    { g: "Character" },
    { key: "rate", lb: "Rate", opts: ["Fast (tachycardia)", "Slow (bradycardia)", "Normal — ectopics"] },
    { key: "rhythm", lb: "Rhythm", opts: ["Regular", "Irregularly irregular (AF)", "Regularly irregular (bigeminy)"] },
    { key: "character", lb: "Character", opts: ["Thumps/dropped beats", "Racing heart", "Fluttering", "Missing beat then strong beat"] },
    { g: "Onset & Timing" },
    { key: "onset", lb: "Onset", opts: ["Sudden on / sudden off (SVT/AF)", "Gradual (sinus tachy)"] },
    { key: "duration", lb: "Duration", ph: "Seconds (ectopics) / minutes-hours (SVT/AF)" },
    { key: "triggers", lb: "Triggers", opts: ["Exertion", "Caffeine", "Alcohol", "Stress", "Lying on left side", "Spontaneous"] },
    { key: "terminate", lb: "Termination", opts: ["Sudden stop", "Valsalva", "Persists until treatment", "Gradual"] },
    { g: "Associated" },
    { key: "presync", lb: "Presyncope/syncope", opts: ["Present (haemodynamic compromise)", "Absent"] },
    { key: "chest", lb: "Chest pain during", opts: ["Present", "Absent"] },
    { key: "polyuria", lb: "Polyuria after", opts: ["Present (SVT — ANP)", "Absent"] }
  ],
  "syncope": [
    { g: "Episode" },
    { key: "duration", lb: "Duration of LOC", ph: "Seconds (syncope) vs minutes (post-ictal)" },
    { key: "recovery", lb: "Recovery", opts: ["Immediate full lucidity (syncope)", "Prolonged confusion (seizure post-ictal)", "Rapid with flushing (vasovagal)"] },
    { g: "Prodrome" },
    { key: "prodrome", lb: "Prodrome", opts: ["Tinnitus", "Dimming vision", "Lightheadedness", "Nausea", "Sweating", "Weakness", "None (cardiac — no warning)"] },
    { g: "Trigger" },
    { key: "trigger", lb: "Trigger", opts: ["Prolonged standing (vasovagal)", "Pain/emotion (vasovagal)", "Exertion (AS/HCM)", "Postural change (orthostatic)", "Head-turning (carotid sinus)", "At rest (arrhythmia)", "Spontaneous"] },
    { g: "During" },
    { key: "pallor", lb: "Pallor", opts: ["Marked pallor + sweating (vasovagal/cardiac)", "Minimal (seizure)"] },
    { key: "motor", lb: "Motor activity", opts: ["Brief limb jerks (cardiac)", "Sustained tonic-clonic (seizure)", "None"] },
    { key: "tongue", lb: "Tongue bite / incontinence", opts: ["Lateral tongue bite (seizure)", "Urinary incontinence", "None"] }
  ],
  "headache": [
    { g: "SOCRATES" },
    { key: "site", lb: "Site", tag: "S", opts: ["Retro-orbital (cluster/migraine)", "Unilateral (migraine/cluster)", "Frontal (tension/sinus)", "Occipital (cervicogenic)", "Generalised (tension/raised ICP)", "Temporal (GCA >50yrs)"] },
    { key: "onset", lb: "Onset", tag: "O", opts: ["Thunderclap — seconds (SAH — EMERGENCY)", "Gradual hours (migraine/tension)", "Progressive weeks (SOL)", "Recurrent episodic"] },
    { key: "character", lb: "Character", tag: "C", opts: ["Throbbing (migraine)", "Tight band (tension)", "Stabbing/lancinating (cluster/TN)", "Explosive severe (SAH/cluster)", "Dull constant (raised ICP)"] },
    { key: "severity", lb: "Severity 0–10", tag: "Se", ph: "10/10 = worst headache of life → SAH" },
    { key: "pattern", lb: "Pattern", tag: "T", opts: ["Single episode", "Recurring episodes", "Daily >50% of days", "Cluster: nightly weeks", "Worsening over weeks"] },
    { g: "Triggers & Relief" },
    { key: "provoke", lb: "Triggers", opts: ["Alcohol (cluster)", "Sleep — wakes (cluster)", "Bright light", "Exertion/cough/Valsalva", "Stress", "Specific foods", "Menstruation"] },
    { key: "relieve", lb: "Relieving", opts: ["Sleep (migraine)", "Dark/quiet room", "Triptans", "Oxygen (cluster)", "Simple analgesia", "None"] },
    { g: "Associated" },
    { key: "nausea", lb: "Nausea/vomiting", opts: ["Projectile (raised ICP)", "Nausea + vomiting (migraine)", "None"] },
    { key: "visual", lb: "Visual aura/symptoms", opts: ["Scintillating scotoma (migraine aura)", "Visual field loss", "Obscurations (raised ICP)", "None"] },
    { key: "photophon", lb: "Photo/phonophobia", opts: ["Photophobia", "Phonophobia", "Both", "Neither"] },
    { key: "neck_stiff", lb: "Neck stiffness + fever", opts: ["Present — MENINGISM (emergency!)", "Absent"] },
    { key: "scalp", lb: "Scalp/jaw tenderness", opts: ["Scalp tender + jaw claudication (GCA >50!)", "Absent"] }
  ],
  "fever": [
    { g: "Fever Pattern (Hutchison's Ch 10)" },
    { key: "duration", lb: "Duration", ph: "Days/weeks/months since first noticed" },
    { key: "onset_type", lb: "Onset", opts: ["Sudden (acute infection/drug)", "Gradual (TB/endocarditis/malignancy)"] },
    { key: "pattern", lb: "Fever pattern", opts: ["Sustained/continuous <1°C variation (pneumonia/meningitis/UTI)", "Remittent >2°C variation but not reaching normal (TB/endocarditis/viral)", "Intermittent/hectic — returns to normal (abscess/malignancy/kala-azar)", "Step-ladder — rising with each spike (typhoid/typhus)", "Relapsing — febrile periods + normal intervals (malaria/borrelia/TB/lymphoma)", "Night sweats only (TB/lymphoma/leukaemia/autoimmune)"] },
    { key: "degree", lb: "Max temperature recorded", ph: "°C or °F — hyperpyrexia >41.5°C = emergency" },
    { key: "pulse_temp", lb: "Pulse-temperature dissociation", opts: ["Slow pulse with high fever (typhoid — relative bradycardia)", "Normal (pulse rises 10bpm per 1°C)"] },
    { g: "Constitutional Symptoms" },
    { key: "rigors", lb: "Rigors", opts: ["Rigors — severe shivering (bacteraemia/malaria/pyelonephritis/cholangitis)", "Night sweats only", "Sweating episodes", "None"] },
    { key: "wt_loss", lb: "Weight loss", opts: ["Significant (TB/malignancy/HIV/endocarditis)", "Mild", "None"] },
    { key: "myalgia", lb: "Myalgia", opts: ["Present (viral/malaria/intracellular pathogens)", "Absent"] },
    { key: "rash", lb: "Rash", opts: ["Maculopapular", "Vesicular/pustular", "Petechial/purpuric (meningococcus/dengue)", "Rose spots (typhoid)", "None"] },
    { g: "Localising — Systematic Review" },
    { key: "resp", lb: "Respiratory", opts: ["Cough + sputum (LRTI)", "Sore throat (URTI)", "Pleuritic pain", "None"] },
    { key: "gi", lb: "GI symptoms", opts: ["Diarrhoea (gastroenteritis/typhoid)", "RUQ pain + jaundice (cholangitis)", "Abdominal pain", "None"] },
    { key: "urinary", lb: "Urinary", opts: ["Dysuria/frequency (UTI)", "Loin pain (pyelonephritis)", "None"] },
    { key: "neuro", lb: "Neurological", opts: ["Altered consciousness (encephalitis/cerebral malaria)", "Neck stiffness (meningitis)", "Seizures", "None"] },
    { g: "Exposure & Epidemiology" },
    { key: "travel", lb: "Travel history", ph: "Countries, dates, activities, malaria prophylaxis" },
    { key: "contact", lb: "Sick contact", opts: ["Similar symptoms in household", "TB contact", "Healthcare exposure", "None"] },
    { key: "immunocomp", lb: "Immune status", opts: ["HIV positive", "Steroids/immunosuppressants", "Chemotherapy", "Diabetes", "Immunocompetent"] }
  ],
  "seizures": [
    { g: "Type" },
    { key: "type", lb: "Type", opts: ["GTCS", "Focal aware", "Focal impaired awareness", "Absence", "Myoclonic", "Tonic", "Atonic (drop)"] },
    { key: "onset", lb: "First vs recurrent", opts: ["First ever seizure", "Known epilepsy — breakthrough", "Increasing frequency"] },
    { key: "duration", lb: "Duration", ph: "Minutes; >5min = status epilepticus risk" },
    { g: "Before" },
    { key: "aura", lb: "Aura", opts: ["Smell/taste (temporal)", "Déjà vu", "Epigastric rising", "Visual (occipital)", "Sensory/motor", "None"] },
    { g: "During" },
    { key: "motor", lb: "Motor activity", opts: ["Tonic then clonic jerking", "Focal twitching", "Automatisms", "Eye deviation"] },
    { key: "colour", lb: "Colour", opts: ["Cyanosis (seizure)", "Pallor (vasovagal)"] },
    { key: "tongue", lb: "Tongue bite/incontinence", opts: ["Lateral tongue bite (seizure)", "Urinary incontinence", "None"] },
    { g: "After" },
    { key: "postictal", lb: "Post-ictal", opts: ["Prolonged confusion (seizure)", "Immediate lucidity (syncope)", "Todd's paresis", "Headache"] },
    { g: "Triggers" },
    { key: "triggers", lb: "Triggers", opts: ["Sleep deprivation", "Alcohol", "Missed medication", "Febrile illness", "Flickering lights", "None"] }
  ],
  "weakness": [
    { g: "Distribution" },
    { key: "onset", lb: "Onset", tag: "O", opts: ["Sudden (stroke)", "Rapid hours (GBS)", "Days-weeks (tumour/demyelination)", "Chronic (MND/myopathy)"] },
    { key: "site", lb: "Distribution", tag: "S", opts: ["Hemiplegia (cortex/capsule)", "Paraplegia (spinal cord)", "Monoplegia", "Proximal — myopathy", "Distal — neuropathy/foot drop", "Quadriplegia"] },
    { key: "pattern", lb: "UMN vs LMN", opts: ["UMN — spastic/brisk reflexes/Babinski", "LMN — flaccid/wasted/fasciculation", "Myopathic — proximal/no sensory", "Mixed"] },
    { g: "Progression" },
    { key: "progress", lb: "Course", opts: ["Sudden then static (stroke)", "Ascending (GBS)", "Relapsing-remitting (MS)", "Slowly progressive (MND/tumour)", "Fluctuating/fatiguable (MG)"] },
    { g: "Associated" },
    { key: "sensory", lb: "Sensory loss", opts: ["Same distribution", "Glove-stocking", "Level on trunk (cord)", "None"] },
    { key: "bladder", lb: "Bladder/bowel", opts: ["Urgency (UMN cord)", "Retention", "Incontinence", "Normal"] },
    { key: "speech", lb: "Speech/swallowing", opts: ["Dysarthria", "Dysphasia", "Dysphagia", "Normal"] }
  ],
  "abdominal pain": [
    { g: "SOCRATES" },
    { key: "site", lb: "Site", tag: "S", opts: ["Epigastric (PUD/pancreatitis)", "RUQ (biliary/liver)", "LUQ (spleen/gastric)", "Periumbilical (small bowel)", "RIF (appendix/Crohn's)", "LIF (diverticulitis)", "Suprapubic (bladder/pelvic)", "Loin (renal)", "Diffuse (peritonitis)"] },
    { key: "onset", lb: "Onset", tag: "O", opts: ["Sudden (perforation/vascular)", "Gradual (inflammatory)", "Colicky (hollow organ obstruction)"] },
    { key: "character", lb: "Character", tag: "C", opts: ["Colicky cramping (bowel/biliary/renal)", "Constant aching (inflammatory)", "Burning (peptic/GORD)", "Boring to back (pancreas/aorta)", "Sharp (peritoneal)"] },
    { key: "severity", lb: "Severity 0–10", tag: "Se", ph: "Worst ever = AAA/pancreatitis" },
    { key: "radiation", lb: "Radiation", tag: "R", opts: ["Right shoulder (biliary)", "Back (pancreatic/renal)", "Loin to groin (renal colic)", "None"] },
    { key: "meals", lb: "Relation to food", opts: ["Worse after meals (pancreatitis/biliary)", "Relieved by food (duodenal ulcer)", "Nocturnal waking (duodenal ulcer)", "Unrelated"] },
    { key: "relieve", lb: "Relieving", opts: ["Antacids (PUD)", "Sitting forward (pancreatitis)", "Bowel motion (IBS)", "Lying still (peritonism)", "Nothing"] },
    { g: "Associated" },
    { key: "nausea", lb: "Nausea/vomiting", opts: ["Relieves pain (biliary/obstruction)", "No relief (appendicitis)", "None"] },
    { key: "bowel", lb: "Bowel change", opts: ["Constipation", "Diarrhoea", "Blood/mucus", "Absolute constipation + no flatus (obstruction)", "Normal"] },
    { key: "jaundice", lb: "Jaundice signs", opts: ["Dark urine + pale stools + itch (obstructive)", "Charcot's triad (cholangitis — EMERGENCY)", "None"] }
  ],
  "cough": [
    { g: "Characterisation" },
    { key: "duration_type", lb: "Duration category", opts: ["Acute <3wks (infection/inhaled)", "Subacute 3-8wks (post-infective)", "Chronic >8wks (COPD/asthma/GORD/ACEi)"] },
    { key: "type", lb: "Type", opts: ["Dry", "Productive/moist"] },
    { key: "timing", lb: "Time of day", opts: ["Nocturnal/early morning (asthma)", "Lying flat (GORD/post-nasal drip)", "Morning (COPD)", "All day"] },
    { key: "triggers", lb: "Triggers", opts: ["Cold air", "Exercise", "Allergens", "Eating (GORD)", "ACE inhibitor", "Post-nasal drip", "None"] },
    { g: "Sputum" },
    { key: "sputum_vol", lb: "Volume", ph: "Teaspoons/day — >1 cup = bronchiectasis" },
    { key: "sputum_col", lb: "Colour", opts: ["Clear", "Yellow-green", "Rusty (pneumococcal)", "Frothy pink (APO)", "Brown/foul (abscess)", "None"] },
    { g: "Associated" },
    { key: "haemopt", lb: "Haemoptysis", opts: ["Streaks", "Frank blood", "None"] },
    { key: "wheeze", lb: "Wheeze", opts: ["Present (asthma/COPD)", "None"] },
    { key: "acei", lb: "ACE inhibitor use", opts: ["Yes", "No"] }
  ],
  "jaundice": [
    { g: "Type Features" },
    { key: "onset", lb: "Onset", opts: ["Acute (hepatitis/stone/haemolysis)", "Gradual (malignancy/cirrhosis)"] },
    { key: "dark_urine", lb: "Dark urine", opts: ["Present (conjugated — hepatocellular/obstructive)", "Absent (haemolytic)"] },
    { key: "pale_stool", lb: "Pale stools", opts: ["Present (obstructive — bile duct blocked)", "Absent"] },
    { key: "itch", lb: "Pruritus", opts: ["Severe (obstructive/cholestatic)", "Mild", "Absent (haemolytic)"] },
    { g: "Cause" },
    { key: "pain", lb: "Pain", opts: ["Colicky RUQ (gallstone)", "Painless progressive (pancreatic Ca)", "Epigastric constant (pancreatitis)", "No pain (viral hepatitis)"] },
    { key: "fever", lb: "Charcot's triad", opts: ["RUQ + fever/rigors + jaundice = cholangitis (EMERGENCY)", "Fever without cholangitis", "No fever"] },
    { key: "alcohol", lb: "Alcohol", opts: ["Significant use", "Minimal", "None"] },
    { key: "drugs", lb: "Drugs/herbals", ph: "Recent new drugs — paracetamol/INH/statins/herbals" },
    { key: "wt_loss", lb: "Weight loss", opts: ["Progressive (pancreatic Ca)", "None"] }
  ],
  "haemoptysis": [
    { g: "Blood" },
    { key: "volume", lb: "Volume", opts: ["Streaks only", "Teaspoons", "Cupfuls", "Massive >200ml/24h"] },
    { key: "character", lb: "Character", opts: ["Bright red (active bleed)", "Frothy pink (APO)", "Mixed purulent sputum (infection)", "Rusty-brown (resolving)"] },
    { g: "Associated" },
    { key: "sob", lb: "Breathlessness", opts: ["Sudden onset (PE/APO)", "Exertional", "None"] },
    { key: "wt_loss", lb: "Weight loss/night sweats", opts: ["Present (TB/malignancy)", "Absent"] },
    { key: "fever", lb: "Fever", opts: ["Present (infection)", "Absent"] },
    { g: "Risk Factors" },
    { key: "smoking", lb: "Smoking", ph: "Pack-years" },
    { key: "tb", lb: "TB contact", opts: ["Known contact", "Previous TB", "None"] },
    { key: "dvt", lb: "DVT/PE risk", opts: ["Immobility", "OCP", "Recent surgery/flight", "None"] }
  ],
  "pedal oedema": [
    { g: "Characterisation" },
    { key: "onset", lb: "Onset", opts: ["Acute (DVT/hypoalbuminaemia)", "Gradual (CCF/CKD/venous)"] },
    { key: "site", lb: "Distribution", opts: ["Bilateral (CCF/hypoalbuminaemia/drugs)", "Unilateral (DVT/lymphoedema)"] },
    { key: "extent", lb: "Extent", opts: ["Ankle only", "Up to knee", "Up to thigh", "Anasarca"] },
    { key: "pitting", lb: "Type", opts: ["Pitting (cardiac/renal/hepatic)", "Non-pitting (lymphoedema/myxoedema)"] },
    { key: "timing", lb: "Diurnal variation", opts: ["Worse evening (CCF)", "Morning periorbital first (nephrotic)", "Constant"] },
    { g: "Associated" },
    { key: "sob", lb: "Breathlessness", opts: ["Orthopnoea", "PND", "Exertional", "None"] },
    { key: "drugs", lb: "Relevant drugs", opts: ["CCBs", "NSAIDs", "Steroids", "Hormones", "None"] }
  ]
};

export const DEFAULT_PARAMS: ParamItem[] = [
  { g: "SOCRATES" },
  { key: "site", lb: "Site", tag: "S", ph: "Where exactly?" },
  { key: "onset", lb: "Onset", tag: "O", opts: ["Sudden", "Gradual", "Insidious"] },
  { key: "character", lb: "Character", tag: "C", ph: "Nature of symptom" },
  { key: "severity", lb: "Severity 0–10", tag: "Se", ph: "0=none, 10=worst" },
  { key: "radiation", lb: "Radiation", tag: "R", ph: "Spreads anywhere?" },
  { key: "timing", lb: "Timing", tag: "T", ph: "Continuous or episodic; duration; frequency" },
  { key: "provoke", lb: "Provoking", tag: "E", ph: "What makes it worse?" },
  { key: "relieve", lb: "Relieving", tag: "E", ph: "What makes it better?" },
  { key: "progress", lb: "Progression", opts: ["Worsening", "Improving", "Stable", "Fluctuating"] },
  { key: "assoc", lb: "Associated", tag: "A", ph: "Other symptoms at the same time?" },
  { key: "prior", lb: "Prior episodes", ph: "Before? When? How treated?" },
  { key: "impact", lb: "Daily life impact", ph: "Work / sleep / ADLs?" }
];

export function getParams(cc: string): ParamItem[] {
  const l = cc.toLowerCase().trim();
  if (CP[l]) return CP[l];
  const keys = Object.keys(CP);
  for (let i = 0; i < keys.length; i++) {
    if (l.indexOf(keys[i]) >= 0 || keys[i].indexOf(l) >= 0) return CP[keys[i]];
  }
  if (/fever|pyrex|temp/i.test(l)) return CP['fever'];
  if (/breath|sob|dyspno/i.test(l)) return CP['dyspnoea'];
  if (/palpit|racing/i.test(l)) return CP['palpitations'];
  if (/faint|blackout|syncop|collapse/i.test(l)) return CP['syncope'];
  if (/swel|oedem|edema/i.test(l)) return CP['pedal oedema'];
  if (/cough/i.test(l)) return CP['cough'];
  if (/blood.*cough|haemopt/i.test(l)) return CP['haemoptysis'];
  if (/head.*ache|migrain/i.test(l)) return CP['headache'];
  if (/seizure|fit|epilep|convuls/i.test(l)) return CP['seizures'];
  if (/weak|paralys/i.test(l)) return CP['weakness'];
  if (/abdom.*pain|stomach|belly/i.test(l)) return CP['abdominal pain'];
  if (/jaundice|yellow/i.test(l)) return CP['jaundice'];
  return DEFAULT_PARAMS;
}

export function getParamName(cc: string): string {
  const names: Record<string, string> = {
    "chest pain": "Box 13.1", "dyspnoea": "Box 12.1", "palpitations": "Ch 13",
    "syncope": "Table 16.1", "headache": "Table 16.2", "fever": "Ch 10 Fig 10.4",
    "seizures": "Table 16.1", "weakness": "Ch 16", "abdominal pain": "Box 14.2",
    "jaundice": "Ch 14", "haemoptysis": "Box 12.6", "cough": "Box 12.3", "pedal oedema": "Ch 13"
  };
  const l = cc.toLowerCase().trim();
  if (names[l]) return "Hutchison's " + names[l];
  const keys = Object.keys(names);
  for (let i = 0; i < keys.length; i++) {
    if (l.indexOf(keys[i]) >= 0) return "Hutchison's " + names[keys[i]];
  }
  return "Hutchison's Box 1.8";
}

export interface SystemExtraField { key: string; lb: string; ph: string; }
export interface SystemDetail {
  name: string; short: string; col: string; lt: string;
  pos: string[]; neg: string[]; risk: string[];
  sym?: string; extra?: SystemExtraField[];
  ex: { I: string[]; P: string[]; Pe: string[]; A: string[]; };
}

export const SYS: Record<string, SystemDetail> = {
  CVS: {
    name: "Cardiovascular", short: "CVS", col: "#c0392b", lt: "#fdf3f2",
    sym: "Chest pain, dyspnoea, palpitations, syncope, ankle swelling",
    pos: ["Fever with sore throat (Rheumatic fever)", "Migratory joint pains", "Subcutaneous nodules/rash", "Chorea/involuntary movements", "Cyanotic episodes (childhood)", "Squatting episodes", "Recurrent chest infections", "Hemoptysis", "Voice change/dysphagia"],
    neg: ["No pedal oedema", "No abdominal distension", "No exertional syncope", "No oliguria", "No squatting episodes", "No cyanotic spells"],
    risk: ["Hypertension", "Diabetes Mellitus", "Hyperlipidaemia", "Smoking", "Family H/o CAD/SCD", "Obesity", "Sedentary lifestyle", "Previous rheumatic fever"],
    extra: [
      { key: "nyha", lb: "NYHA Class", ph: "I / II / III / IV" },
      { key: "pnd_f", lb: "PND frequency", ph: "Episodes/week" },
      { key: "ortho", lb: "Orthopnoea pillows", ph: "Number" },
      { key: "gtn", lb: "GTN response", ph: "Relieved? Minutes?" }
    ],
    ex: {
      I: ["Chest wall symmetry", "Apical impulse visible", "Precordial bulge", "Dilated veins", "Scars (sternotomy/thoracotomy/pacemaker)"],
      P: ["Apical impulse site (ICS/MCL)", "Apex character (tapping/heaving/thrusting)", "Parasternal heave", "Thrills", "Palpable P2"],
      Pe: ["Right cardiac border", "Left cardiac border", "Upper cardiac border", "Liver dullness"],
      A: ["Mitral area (5th ICS MCL) — S1/S2/murmur", "Aortic area (2nd ICS RSB) — A2/ESM", "Pulmonary area (2nd ICS LSB) — P2/split", "Tricuspid area (5th ICS LSB)", "Left sternal edge — EDM", "S3/S4 gallop", "Pericardial rub"]
    }
  },
  CNS: {
    name: "Neurological", short: "CNS", col: "#7b5800", lt: "#fffbf0",
    sym: "Headache, seizures, weakness, sensory loss, speech / swallow changes",
    pos: ["Fever + headache + photophobia (meningism)", "Recent head trauma", "TB contact/HIV risk", "Focal neurological deficit", "Diplopia/ptosis/facial weakness", "Vascular risk factors (HTN/DM/AF)"],
    neg: ["No bladder/bowel dysfunction", "No neck stiffness", "No focal deficit", "No papilloedema", "No meningeal signs", "No seizures"],
    risk: ["Hypertension", "Diabetes mellitus", "Atrial fibrillation", "Smoking", "Hyperlipidaemia", "Family H/o stroke/epilepsy", "Anticoagulant use", "Previous TIA/stroke"],
    extra: [
      { key: "cn", lb: "Cranial nerve symptoms", ph: "Diplopia/facial weakness/dysphagia" },
      { key: "bladder", lb: "Bladder/bowel", ph: "Urgency/retention/incontinence" },
      { key: "memory", lb: "Memory/cognition", ph: "Short/long-term; orientation" }
    ],
    ex: {
      I: ["Consciousness (GCS)", "Orientation (time/place/person)", "Speech (fluency/comprehension)", "Gait on entry", "Involuntary movements"],
      P: ["Cranial nerves I–XII", "Motor: tone UL+LL", "Motor: power MRC 0-5", "Coordination (FNT/HKT/RAM/Romberg)", "Meningeal signs (Kernig/Brudzinski)"],
      Pe: ["DTR: biceps/triceps/supinator C5-7", "Knee L3-4 / Ankle S1", "Plantar response (Babinski)", "Abdominal reflexes", "Clonus"],
      A: ["Carotid bruits", "Cardiac murmurs (embolic source)", "Sensory: LT/PP/proprioception/vibration"]
    }
  },
  RS: {
    name: "Respiratory", short: "RS", col: "#1a4f7a", lt: "#f0f7ff",
    sym: "Cough, sputum, haemoptysis, dyspnoea, wheeze, chest pain",
    pos: ["Childhood chest infections/asthma", "TB contact/treatment", "Occupational exposure (asbestos/silica/bird)", "Atopy (eczema/rhinitis/urticaria)", "Night sweats + weight loss", "Travel to TB-endemic area", "Recurrent pneumonias (same lobe)"],
    neg: ["No haemoptysis", "No weight loss", "No night sweats", "No TB contact", "No significant occupational exposure", "No atopy", "No recurrent infections"],
    risk: ["Smoking (pack-years)", "Occupational dust/asbestos", "Family H/o asthma/COPD/CF", "Recurrent childhood infections", "Immunocompromised", "Biomass fuel exposure"],
    extra: [
      { key: "mrc", lb: "MRC Dyspnoea Grade", ph: "1-5" },
      { key: "inhalers", lb: "Inhalers", ph: "Type/frequency/compliance" },
      { key: "pf", lb: "Peak flow/spirometry", ph: "Best known values" },
      { key: "noct", lb: "Nocturnal symptoms", ph: "Waking with breathlessness/wheeze" }
    ],
    ex: {
      I: ["Resp rate + rhythm", "Chest shape (barrel/pectus/kyphoscoliosis)", "Accessory muscles + tracheal tug", "Cyanosis + clubbing grade", "Tracheal position", "Intercostal recession"],
      P: ["Tracheal position (suprasternal notch)", "Chest expansion upper (clavicle)", "Chest expansion lower (thumbs, normal ≥5cm)", "Vocal fremitus bilaterally", "Subcutaneous emphysema"],
      Pe: ["Bilateral systematic (apex→base)", "Resonance/Dullness/Stony dullness/Hyperresonance", "Liver upper border", "Traube's space", "Shifting dullness if indicated"],
      A: ["Breath sounds (vesicular/bronchial/reduced)", "Crackles — fine/medium/coarse; timing", "Wheeze — monophonic/polyphonic", "Pleural rub", "Vocal resonance (bronchophony/aegophony/WPL)"]
    }
  },
  GIT: {
    name: "Gastrointestinal", short: "GIT", col: "#1e6b45", lt: "#f0faf5",
    sym: "Abdominal pain, nausea, vomiting, jaundice, bowel habit change, weight loss",
    pos: ["Alcohol intake (units/week)", "NSAID/steroid/anticoagulant use", "H. pylori history/treatment", "Previous abdominal surgery", "IBD diagnosis", "Family H/o GI malignancy", "Recent foreign travel", "IV drug use (hepatitis)"],
    neg: ["No weight loss", "No rectal bleeding", "No jaundice", "No dysphagia", "No family H/o CRC", "No significant alcohol", "No NSAID use", "No bowel habit change"],
    risk: ["Alcohol", "NSAID/aspirin", "H. pylori", "Family H/o GI malignancy", "IBD", "Obesity", "Smoking", "Previous GI surgery"],
    extra: [
      { key: "alc", lb: "Alcohol — units + pattern", ph: "Type/binge vs daily/years" },
      { key: "stool", lb: "Stool details", ph: "Bristol type/colour/frequency/blood" },
      { key: "appetite", lb: "Appetite", ph: "Normal/reduced/increased/food avoidance" },
      { key: "wt_det", lb: "Weight loss amount", ph: "kg over how many months" }
    ],
    ex: {
      I: ["Abdominal contour (flat/distended/scaphoid)", "Visible veins (caput medusae/IVC)", "Skin signs (jaundice/spider naevi/scratch marks)", "Scars/stomas", "Visible peristalsis", "Umbilicus"],
      P: ["Superficial palpation 9 regions (tenderness/guarding/rigidity)", "Deep palpation (masses)", "Hepatomegaly (span/surface/edge/consistency)", "Splenomegaly (notch/oblique)", "Murphy's sign / Rebound / Fluid thrill"],
      Pe: ["Liver span (5th ICS MCL, normal 6-12cm)", "Splenic dullness (Traube's/Castell's/Nixon's)", "Shifting dullness (ascites)", "Suprapubic (bladder)"],
      A: ["Bowel sounds (normal/absent/tinkling)", "Aortic bruit", "Renal artery bruit", "Hepatic bruit/rub", "Succession splash (>4h post-meal)"]
    }
  }
};
