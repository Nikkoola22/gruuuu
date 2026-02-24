#!/usr/bin/env python3
# Correct Q4 and Q5 with proper options

with open('src/components/FAQQuiz.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Q4: Temps partiel  
old_q4 = """  } else if (idx === 4) {
    // explicit options for 'Quelles sont les conditions pour bénéficier du temps partiel ?' (faq slice index 4)
    opts = [
      'Le temps partiel peut être accordé de droit ou sur autorisation selon les situations',
      'Le temps partiel peut être accordé de droit uniquement pour les femmes.',
      'Le temps partiel peut être accordé sur autorisation pour se reposer',
      'Le temps partiel peut être accordé de droit ou sur autorisation a 40 %'
    ];
    correctIndex = 0; // first option is correct"""

new_q4 = """  } else if (idx === 4) {
    // explicit options for 'Quelles sont les conditions pour bénéficier du temps partiel ?' (faq slice index 4)
    opts = [
      'Le temps partiel peut être accordé de droit ou sur autorisation selon les situations',
      'Le temps partiel n\'est accordé que sur demande sans justification',
      'Le temps partiel est réservé aux femmes ayant des enfants',
      'Le temps partiel n\'existe pas à Gennevilliers'
    ];
    correctIndex = 0; // first option is correct"""

content = content.replace(old_q4, new_q4)

# Fix Q5: Heures supplémentaires
old_q5 = """  } else if (idx === 5) {
    // explicit options for 'Comment sont rémunérées les heures supplémentaires ?' (faq slice index 5)
    opts = [
      'Les heures supplémentaires sont rémunérées uniquement les 15 premieres',
      'Les heures supplémentaires sont rémunérées uniquement si elles sont effectuées à la demande de la hiérarchie.',
      'Les heures supplémentaires sont rémunérées uniquement si vous le demandez',
      'Les heures supplémentaires sont rémunérées uniquement si votre indice est en dessous de 545'
    ];
    correctIndex = 1; // second option is correct (à la demande de la hiérarchie)"""

new_q5 = """  } else if (idx === 5) {
    // explicit options for 'Comment sont rémunérées les heures supplémentaires ?' (faq slice index 5)
    opts = [
      'Les 15 premières heures supplémentaires uniquement sont payées',
      'Les heures supplémentaires sont accordées à titre gratuit (repos compensateur)',
      'Les heures supplémentaires sont rémunérées si elles sont demandées par la hiérarchie',
      'Les heures supplémentaires ne sont jamais rémunérées'
    ];
    correctIndex = 2; // third option is correct (à la demande de la hiérarchie)"""

content = content.replace(old_q5, new_q5)

# Write back
with open('src/components/FAQQuiz.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Q4 and Q5 corrected")
