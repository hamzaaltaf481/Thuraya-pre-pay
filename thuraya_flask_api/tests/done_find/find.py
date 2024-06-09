import csv


with open('all_done.csv', 'r') as f:
    reader = csv.reader(f)
    done = []
    for row in reader:
        modified_row = row[0][5:]
        done.append(modified_row)

with open('stats.csv', 'r') as f:
    reader = csv.reader(f)
    stats = []
    for row in reader:
        stats.append(row[1])



done_set = set(done)
stats_set = set(stats)

# Find values in done but not in stats
difference = done_set - stats_set

print(len(difference))

with open('difference.csv', 'w') as f:
    writer = csv.writer(f)
    for row in difference:
        writer.writerow([row])