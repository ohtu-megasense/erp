import pandas as pd

df_env = pd.read_parquet("NEI_2017_full_data.parquet")
df_rideshare = pd.read_excel("Ride_Sharing_Mockdata.xlsx")

print(df_env.columns)  # prints names of the columns

for i in range(10):
    print("")

print(df_rideshare.columns)

"""
write to a file

df_env.to_sql(name,con,schema,if_exists="replace",index=False)

df_rideshare.to_sql(same as above)

kunhan sql on jollain tapaa ensin määritelty
"""
