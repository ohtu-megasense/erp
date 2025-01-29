import pandas as pd

df = pd.read_parquet("NEI_2017_full_data.parquet")


print(df.columns)  # antaa sarakkeiden nimet listana


"""
Tiedostoon kirjoittaminen tapahtuisi esim

df.to_sql(name,con,schema,if_exists="replace",index=False)

kunhan sql on jollain tapaa ensin määritelty
"""
