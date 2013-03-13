headVerts = []
f = open("Infinite-Level_02.OBJ", "r")
for line in f.readlines():
	if line[0] == "v" and line[1] == " ":
		v = [float(c) for c in line.split(" ")[1:]]
		v[0] = v[0] * 14.0 - .1
		v[1] = v[1] * 17.0 + 4.55
		v[2] = (v[2] + 0.085) * 22.9
		headVerts.append(v)
		
f.close()

print "head verts:", len(headVerts)

sculptVerts = []
f = open("sculptureverts", "r")
for line in f.readlines():
	if line[0] == "[":
		sculptVerts.append([float(c.strip()) for c in line[1:-2].split(",")])
f.close()

print "sculpt verts:", len(sculptVerts)

def dist(a,b):
	dx = a[0]-b[0]
	dy = a[1]-b[1]
	dz = a[2]-b[2]

	dy *= 5

	return dx*dx+dy*dy+dz*dz

def calc():
	total = len(headVerts) * len(sculptVerts)
	cur = 0
	f = open("output", "w")
	f.write("[")
	for i in range(8):
		f.write("[0,0,0],\n")
	for v1 in sculptVerts:
		closest = None
		minDist = 999999
		for v2 in headVerts:
			d = dist(v1, v2)
			if d < minDist:
				minDist = d
				closest = v2
			cur += 1
			if cur % (total/100) == 0:
				print (cur * 1.0 / total * 1.0) * 100
		f.write(str(closest)+",\n")
	f.write("]")
	f.close()

def stats(verts):
	xr = [0, 0]
	yr = [0, 0]
	zr = [0, 0]
	for v in verts:
		if v[0] < xr[0]: xr[0] = v[0]
		if v[0] > xr[1]: xr[1] = v[0]
		if v[1] < yr[0]: yr[0] = v[1]
		if v[1] > yr[1]: yr[1] = v[1]
		if v[2] < zr[0]: zr[0] = v[2]
		if v[2] > zr[1]: zr[1] = v[2]
	print xr
	print yr
	print zr

stats(headVerts)
stats(sculptVerts)
calc()
