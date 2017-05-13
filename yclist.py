import bs4
import urllib.request
import csv

url = 'http://yclist.com'
url_data = urllib.request.urlopen(url).read()
soup = bs4.BeautifulSoup(url_data, "html.parser")
startups = soup.select("#companies table tbody .operating")

names = [val.select('td')[1].text for val in startups]
urls = [val.select('td')[2].text for val in startups]
all_urls = [val.select('td a')[0].text for val in startups if bool(val.select('td a')) and bool(val.select('td a')[0].text)]
startup_descriptions = [val.select('td')[5].text for val in startups]

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

url_results = {}

TLDs = [".com", ".ai",".io",".net",".org"]

def url_trend_checker(websites, TLD):
	return "{} companies with the '{}' TLD".format(len([url.find(TLD) for url in websites if url.find(TLD) > 0]),TLD)

def url_trendy(websites, TLD):
	if TLD not in url_results:
		url_results[TLD] = len([website for website in websites if website.find(TLD) > 0])
	return url_results

with open('TLD.csv', 'a+') as csvfile:
    writer = csv.writer(csvfile, delimiter=",")
    writer.writerow(["Count","TLD"])
    for key in url_results:
    	writer.writerow([key,url_results[key]])

buzzwords_per_company = {}   ## object that holds buzzword as key, and as a value: a list of companies that have that list

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

with open('companies.csv', 'a+') as csvfile:
    writer = csv.writer(csvfile, delimiter=",")
    for key in buzzwords_per_company:
    	writer.writerow([key,buzzwords_per_company[key]])






# scraping crunchbase to get funding data
# company_name = "airbnb"
company_names = names
for company_name in company_names:
	url_two = "https://www.crunchbase.com/organization/{}#/entity".format(company_name.lower())

	req = urllib.request.Request(
    url_two, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
    }
)

response = urllib.request.urlopen(req).read().decode('utf-8')
soup_two = bs4.BeautifulSoup(response, "html.parser")

funding_amount = soup_two.select(".funding_amount")[0].text[1:]  ## returns 3.4B 
    


# company_names = names ## note that names is a list of all 968 companies
