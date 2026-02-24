#!/usr/bin/env python3
"""Audit all quiz questions for errors and duplicates"""

import re

with open('src/components/FAQQuiz.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Extract question blocks
questions = {}
current_q = None
current_id = None

for i, line in enumerate(lines):
    if 'id:' in line and ',' in line:
        match = re.search(r'id:\s*(\d+)', line)
        if match:
            current_id = int(match.group(1))
            current_q = {'id': current_id, 'line': i + 1, 'question': '', 'has_options': False, 'has_correctIndex': False}
            questions[current_id] = current_q
    
    elif current_q and 'question:' in line:
        match = re.search(r"question:\s*['\"]([^'\"]+)['\"]", line)
        if match:
            current_q['question'] = match.group(1)
    
    elif current_q and 'options:' in line:
        current_q['has_options'] = True
    
    elif current_q and 'correctIndex:' in line:
        match = re.search(r'correctIndex:\s*(\d+)?', line)
        if match and match.group(1):
            current_q['correctIndex'] = int(match.group(1))
            current_q['has_correctIndex'] = True
        elif not match.group(1):
            current_q['has_correctIndex'] = False  # Empty value
            current_q['error'] = 'Empty correctIndex'

# Report
print("=" * 70)
print("FAQ QUIZ AUDIT REPORT")
print("=" * 70)

total = len(questions)
errors = 0

print(f"\nTotal questions found: {total}")
print("\nQUESTIONS WITH ERRORS:")
print("-" * 70)

for qid in sorted(questions.keys()):
    q = questions[qid]
    if not q['has_correctIndex'] or 'error' in q:
        errors += 1
        print(f"Q{qid} (Line {q['line']}): {q.get('error', 'Missing correctIndex')}")
        if q['question']:
            print(f"  → {q['question'][:60]}...")

if errors == 0:
    print("✓ No errors found!")

# Check for duplicate-like topics
print("\n\nTOPIC ANALYSIS:")
print("-" * 70)

topics = {
    'heures supplémentaires': [],
    'temps partiel': [],
    'télétravail': [],
    'congés': [],
    'CPF': [],
}

for qid in sorted(questions.keys()):
    q = questions[qid]
    question_lower = q['question'].lower()
    
    for topic in topics.keys():
        if topic in question_lower:
            topics[topic].append(qid)

for topic, qids in topics.items():
    if qids:
        print(f"\n{topic.upper()}: {len(qids)} questions")
        for qid in qids:
            print(f"  - Q{qid}: {questions[qid]['question'][:55]}...")

print("\n" + "=" * 70)
print(f"SUMMARY: {total} questions, {errors} errors")
print("=" * 70)
