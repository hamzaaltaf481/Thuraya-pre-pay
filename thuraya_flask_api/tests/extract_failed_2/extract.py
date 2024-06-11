import csv


with open('login_stats.csv', 'r') as f:
    reader = csv.reader(f)
    done = []
    for row in reader:
        if row[2] == 'failed':
            modified_row = row[1]
            done.append(modified_row)



with open('extracted.csv', 'w') as f:
    writer = csv.writer(f)
    for row in done:
        writer.writerow([row])