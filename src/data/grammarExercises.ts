import type { GrammarExercise } from '../types';

export const grammarExercises: GrammarExercise[] = [
  // Subjunctive
  {
    id: 'subj_001',
    topic: 'subjunctive',
    type: 'fill-in-blank',
    prompt: "Il faut que tu ___ (aller) chez le médecin.",
    correctAnswer: 'ailles',
    explanation: "After 'il faut que', use the subjunctive. 'Aller' → 'ailles' for tu.",
  },
  {
    id: 'subj_002',
    topic: 'subjunctive',
    type: 'multiple-choice',
    prompt: "Je doute qu'il ___ la vérité.",
    correctAnswer: 'dise',
    options: ['dit', 'dise', 'dira', 'disait'],
    explanation: "'Douter que' triggers the subjunctive. 'Dire' → 'dise' in subjunctive.",
  },
  {
    id: 'subj_003',
    topic: 'subjunctive',
    type: 'fill-in-blank',
    prompt: "Bien qu'elle ___ (être) fatiguée, elle continue à travailler.",
    correctAnswer: 'soit',
    explanation: "'Bien que' always requires the subjunctive. 'Être' → 'soit'.",
  },

  // Conditional
  {
    id: 'cond_001',
    topic: 'conditional',
    type: 'multiple-choice',
    prompt: "Si j'avais le temps, je ___ en France.",
    correctAnswer: 'voyagerais',
    options: ['voyage', 'voyagerais', 'voyagerai', 'voyageais'],
    explanation: "Si + imparfait → conditionnel présent. 'Voyager' → 'voyagerais'.",
  },
  {
    id: 'cond_002',
    topic: 'conditional',
    type: 'fill-in-blank',
    prompt: "Si nous avions su, nous ___ (venir) plus tôt.",
    correctAnswer: 'serions venus',
    explanation: "Si + plus-que-parfait → conditionnel passé. 'Venir' uses être as auxiliary.",
  },
  {
    id: 'cond_003',
    topic: 'conditional',
    type: 'multiple-choice',
    prompt: "Elle a dit qu'elle ___ demain.",
    correctAnswer: 'viendrait',
    options: ['vient', 'viendra', 'viendrait', 'venait'],
    explanation: "Reported speech in the past uses the conditional for future actions.",
  },

  // Relative pronouns
  {
    id: 'rel_001',
    topic: 'relative-pronouns',
    type: 'multiple-choice',
    prompt: "C'est le livre ___ je t'ai parlé.",
    correctAnswer: 'dont',
    options: ['que', 'qui', 'dont', 'lequel'],
    explanation: "'Parler de' → use 'dont' to replace 'de + noun' in relative clauses.",
  },
  {
    id: 'rel_002',
    topic: 'relative-pronouns',
    type: 'fill-in-blank',
    prompt: "La ville dans ___ j'ai grandi est très petite.",
    correctAnswer: 'laquelle',
    explanation: "After 'dans' + feminine noun, use 'laquelle'. 'La ville' is feminine.",
  },
  {
    id: 'rel_003',
    topic: 'relative-pronouns',
    type: 'multiple-choice',
    prompt: "Voici la raison pour ___ il est parti.",
    correctAnswer: 'laquelle',
    options: ['que', 'dont', 'laquelle', 'qui'],
    explanation: "After 'pour' + feminine noun, use 'laquelle'. 'La raison' is feminine.",
  },

  // Past tenses
  {
    id: 'past_001',
    topic: 'past-tenses',
    type: 'multiple-choice',
    prompt: "Quand je ___ petit, je jouais dans le jardin.",
    correctAnswer: 'étais',
    options: ['étais', 'ai été', 'fus', 'suis été'],
    explanation: "Descriptions and habitual actions in the past use the imparfait.",
  },
  {
    id: 'past_002',
    topic: 'past-tenses',
    type: 'fill-in-blank',
    prompt: "Hier, elle ___ (sortir) à 20 heures.",
    correctAnswer: 'est sortie',
    explanation: "'Sortir' uses être in passé composé. Feminine agreement: 'sortie'.",
  },
  {
    id: 'past_003',
    topic: 'past-tenses',
    type: 'multiple-choice',
    prompt: "Il pleuvait quand soudain le soleil ___.",
    correctAnswer: 'est apparu',
    options: ['apparaissait', 'est apparu', 'apparut', 'a apparu'],
    explanation: "Sudden action interrupting an ongoing past state uses passé composé.",
  },

  // Hypothetical
  {
    id: 'hyp_001',
    topic: 'hypothetical',
    type: 'fill-in-blank',
    prompt: "Si j'___ (être) riche, j'achèterais une maison.",
    correctAnswer: 'étais',
    explanation: "Hypothetical present: si + imparfait, conditionnel présent.",
  },
  {
    id: 'hyp_002',
    topic: 'hypothetical',
    type: 'multiple-choice',
    prompt: "Si tu avais étudié, tu ___ réussi l'examen.",
    correctAnswer: 'aurais',
    options: ['avais', 'aurais', 'auras', 'as'],
    explanation: "Unreal past: si + plus-que-parfait → conditionnel passé (aurais + participe).",
  },

  // Passive voice
  {
    id: 'pass_001',
    topic: 'passive-voice',
    type: 'fill-in-blank',
    prompt: "Ce château ___ (construire) au XIVe siècle.",
    correctAnswer: 'a été construit',
    explanation: "Passive voice: être + past participle. Agreement with masculine subject.",
  },
  {
    id: 'pass_002',
    topic: 'passive-voice',
    type: 'multiple-choice',
    prompt: "Les résultats ___ annoncés demain.",
    correctAnswer: 'seront',
    options: ['sont', 'seront', 'étaient', 'seraient'],
    explanation: "Passive voice in the future: 'seront' + past participle.",
  },

  // Reported speech
  {
    id: 'rep_001',
    topic: 'reported-speech',
    type: 'fill-in-blank',
    prompt: 'Il a dit qu\'il ___ (être) fatigué.',
    correctAnswer: 'était',
    explanation: "Reported speech: present → imparfait. 'Est' becomes 'était'.",
  },
  {
    id: 'rep_002',
    topic: 'reported-speech',
    type: 'multiple-choice',
    prompt: "Elle m'a demandé ___ j'avais fait le week-end dernier.",
    correctAnswer: 'ce que',
    options: ['que', 'ce que', 'quoi', "qu'est-ce que"],
    explanation: "In reported speech, 'qu'est-ce que' becomes 'ce que'.",
  },

  // Connectors
  {
    id: 'conn_001',
    topic: 'connectors',
    type: 'multiple-choice',
    prompt: "Il a réussi l'examen ___ il n'avait pas beaucoup étudié.",
    correctAnswer: 'bien que',
    options: ['parce que', 'bien que', 'puisque', 'car'],
    explanation: "'Bien que' (although) expresses concession. Note: it requires subjunctive.",
  },
  {
    id: 'conn_002',
    topic: 'connectors',
    type: 'fill-in-blank',
    prompt: "Je reste à la maison ___ il pleut. (because)",
    correctAnswer: 'parce que',
    explanation: "'Parce que' gives a direct cause/reason. 'Parce qu'' before vowels.",
  },
  {
    id: 'conn_003',
    topic: 'connectors',
    type: 'multiple-choice',
    prompt: "Le projet est intéressant ; ___, le budget est insuffisant.",
    correctAnswer: 'cependant',
    options: ['donc', 'cependant', 'alors', 'ensuite'],
    explanation: "'Cependant' (however) introduces a contrast or opposition.",
  },
];
