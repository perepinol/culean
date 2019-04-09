def format(time):
	parts = time.split(":")
	return float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])

def updateTuple(previous, parts, machines):
	tuple = ()
	for i in range(len(parts)):
		value = previous[i] * (machines - 1) # Undo average
		value = (value + format(parts[i])) / machines # Redo average
		tuple += (value,)
	return tuple
	
header = ""
accum = []
i = 0
while (True):
	try:
		reader = open("machine" + str(i+1) + ".csv", "r")
		i += 1
	except:
		break
	header = reader.readline()
	j = 0
	for line in reader:
		if (len(accum) <= j):
			accum.append((0, 0, 0))
		
		accum[j] = updateTuple(accum[j], line.split(";")[1:], i)
		j += 1

reader.close()

if (header != ""):
	writer = open("global.csv", "w")
	writer.write(header)
	i = 0
	for entry in accum:
		writer.write(";".join(map(str, (i,) + entry)) + "\n")
		i += 1
else:
	pass
writer.close()
