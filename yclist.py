import bs4
import urllib.request
import csv
import math

url = 'http://yclist.com'
url_data = urllib.request.urlopen(url).read()
soup = bs4.BeautifulSoup(url_data, "html.parser")
operating_startups = soup.select("#companies table tbody .operating")

names = [val.select('td')[1].text for val in operating_startups]
urls = [val.select('td')[2].text for val in operating_startups]
all_urls = [val.select('td a')[0].text for val in operating_startups if bool(val.select('td a')) and bool(val.select('td a')[0].text)]
startup_descriptions = [val.select('td')[5].text for val in operating_startups]

result = {}

keywords = ["platform", "marketplace", "on-demand","data", "virtual reality", "robots", "diagnostics","payments", "automated", "chatbot","analytics", "health", 
			"labs", "mission", "app", "best", "developers", "build", "new", "free", "open", "the world", "drones", "blockchain",
			"biology", "mobile","online", "video","social network"]

def buzzword_counter(kwords, descriptions,result):
	for keyword in keywords:
		if keyword.lower() not in result:
			result[keyword.lower()] = 0
		for description in descriptions:
			if keyword.lower() in description.lower():
				result[keyword.lower()]+=1 

buzzword_counter(keywords,startup_descriptions,result)

# acquired is in a span.annotation class. So I can get that and assign that to  the result object before it is converted to csv

with open('yclist.csv', 'w') as csvfile:
    writer = csv.writer(csvfile, delimiter=",")
    writer.writerow(["Buzzword", "NumberOfCompanies"])
    for key in result:
        writer.writerow([key, result[key]])


buzzwords_per_company = {}  

def categorizer(names, buzzword, startup_descriptions):
	arr	= []
	for i, description in enumerate(startup_descriptions):
		if buzzword in description:
			arr.append(names[i])
	return arr 

categorizer(names, "platform", startup_descriptions)

def create_array_per_buzzword(obj,keywords ):
	for keyword in keywords:
		obj[keyword] = categorizer(names, keyword, startup_descriptions)


create_array_per_buzzword(buzzwords_per_company, keywords)


dead_companies = soup.select("#companies table tbody .dead")
names_of_dead_companies = [val.select('td')[1].text for val in dead_companies]

exited_companies = soup.select("#companies table tbody .exited")
names_of_exited_companies = [val.select('td')[1].text for val in exited_companies]

## total percent dead, exited and active
percent_dead = math.floor(100*len(names_of_dead_companies)/(len(names_of_exited_companies) + len(names_of_dead_companies) + len(names)))
percent_exited = math.floor(100*len(names_of_exited_companies)/(len(names_of_exited_companies) + len(names_of_dead_companies) + len(names)))
percent_active = 100 - (percent_dead + percent_exited)

year_names = ["05","06", "07", "08", "09", "10", "11" ]

all_comps = soup.select("#companies table tbody tr")
names_of_all_comps = [val.select('td')[1].text for val in all_comps]
classes_of_all_comps = [val.select('td')[3].text for val in all_comps]

status_of_startups = {}

def categorize_by_status():
	for i, comp in enumerate(names_of_all_comps):
			if names_of_all_comps[i] in names_of_exited_companies:
				status_of_startups[comp] = "Exited"
			elif names_of_all_comps[i] in names_of_dead_companies:
				status_of_startups[comp] = "Dead"
			else:
				status_of_startups[comp] = "Active"
	return status_of_startups		

categorize_by_status()

comps_by_year ={}

def categorize_by_year(classes_of_all_comps, year):
	arr = [0, 0, 0]
	for i, comp in enumerate(classes_of_all_comps):
		if year in comp:
			if status_checker(names_of_all_comps[i],"Dead"):
				arr[0] += 1
				comps_by_year[year] = arr
			elif status_checker(names_of_all_comps[i], "Active"):
				arr[1] +=1
				comps_by_year[year] = arr
			elif status_checker(names_of_all_comps[i], "Exited"):
				arr[2] +=1
				comps_by_year[year] = arr
	return arr

def status_checker (company,status):
	return status_of_startups[company] == status

def execute_categorize_by_year(func, arr):
	for val in arr:
		categorize_by_year(classes_of_all_comps, val)

execute_categorize_by_year(categorize_by_year,year_names)

with open('startups_by_year.csv', 'a+') as csvfile:
	data = ["Year", "Summary"]
	writer = csv.writer(csvfile, delimiter=",")
	writer = csv.DictWriter(csvfile, fieldnames=year_names)
	writer.writerow(comps_by_year)

with open('companies.csv', 'a+') as csvfile:
    writer = csv.writer(csvfile, delimiter=",")
    for key in buzzwords_per_company:
    	writer.writerow([key,buzzwords_per_company[key]])
