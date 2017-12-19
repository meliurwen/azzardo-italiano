import csv
import urllib.request as request
import json
import time
comuni = []
with open("dataset/Elenco-comuni-italiani.csv",encoding="ISO-8859-1") as eci:
    eci_reader = csv.reader(eci,delimiter=";")
    header = eci_reader.__next__()
    for row in eci_reader:
        comuni.append({key:value for key,value in zip(header,row)})

dati_azzardo = {}
for comune in comuni:
    indice_istat = comune["Codice Comune formato numerico"]
    print(indice_istat)
    risposta = request.urlopen("http://lab.gruppoespresso.it/finegil/2017/italia-delle-slot/ws/dettaglio.php?codice_istat=%s"%(indice_istat,)).read().decode("UTF-8")
    try:
        dati_azzardo[indice_istat] = json.loads(risposta)[0]
    except:
        pass
with open("dati-azzardo.json","w") as f:
    json.dump(dati_azzardo, f)




