import json
from  lxml import etree
import pandas as pd


svg_img = etree.parse("svg/italia_regioni-province-comuni.svg")
database = {}

with open("dataset/dati-azzardo.json") as f:
    database = json.load(f)
database =  pd.DataFrame.from_dict(database, orient="index")
database["RACCOLTA_TOT_PROCAPITE_2016"] = database["RACCOLTA_TOT_PROCAPITE_2016"].astype(float)
mean_tm = database["RACCOLTA_TOT_PROCAPITE_2016"].mean()
std_tm = database["RACCOLTA_TOT_PROCAPITE_2016"].std()
missing_municip = 0
min_tm = mean_tm - std_tm
max_tm = mean_tm + std_tm

for id_istat,row in database["RACCOLTA_TOT_PROCAPITE_2016"].iteritems():
    value = (row - min_tm)/(max_tm-min_tm)
    value = value if value < 1 else 1
    value = value if value > 0 else 0
    value = int(value*255)
    try:
        element = svg_img.xpath("//*[contains(@id,'com%s')]"%(id_istat,))[0]
        element.attrib["style"]="fill:#{:02X}00{:02X};stroke-width:0;".format(value,value,value)
    except:
        print("Comune %s non trovato"%(id_istat,))
        missing_municip += 1
print("%d comuni non sono stati trovati"%(missing_municip,))
svg_img.write("ciao.svg")
