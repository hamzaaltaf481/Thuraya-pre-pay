import csv


with open('failing.csv', 'r') as f:
    reader = csv.reader(f)
    done = []
    for row in reader:
        modified_row = row[0]
        done.append(modified_row)


# make them unique

done_set = set(done)

# write to the same file

with open('failing.csv', 'w') as f:
    writer = csv.writer(f)
    for row in done_set:
        writer.writerow([row])

