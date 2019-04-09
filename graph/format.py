import sys

def format(string):
	"""Transform an HH:MM:SS string into its second representation in type float."""
	parts = string.strip().split(":")
	return (float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2]))	
	
fh = open(sys.argv[1])
writer = open("data.csv", "w")
writer.write("x,y\n")

day = 0
week = 0
counter = 0
for line in fh:
	splitted = line.split(";")
	if (day < 7):
		counter += format(splitted[3])
	else:
		writer.write(str(week) + "," + str(counter / 3600) + "\n")
		counter = format(splitted[3])
		day = 0
		week += 1
	day += 1
fh.close()
writer.close()
