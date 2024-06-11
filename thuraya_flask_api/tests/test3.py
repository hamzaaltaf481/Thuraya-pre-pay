import csv
from collections import Counter

with open('check_dupes.csv', 'r') as f:
    reader = csv.reader(f)
    done = []
    for row in reader:
        modified_row = row[0]
        done.append(modified_row)

# Count occurrences
counts = Counter(done)

# Print duplicates and their counts
for item, count in counts.items():
    if count > 1:
        print(f"Item: {item}, Count: {count}")