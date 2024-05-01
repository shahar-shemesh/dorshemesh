import re
from bs4 import BeautifulSoup as bs
import requests
import json
import pymongo


def load_soup_object(url):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36', "Upgrade-Insecure-Requests": "1","DNT": "1","Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8","Accept-Language": "en-US,en;q=0.5","Accept-Encoding": "gzip, deflate"}
    r = requests.get(url,headers=headers)
    soup = bs(r.content, "html.parser")
    return soup

if __name__ == '__main__':

    baseUrl = "https://dorshemesh.myportfolio.com"
    soup = load_soup_object(baseUrl)
    allProjects = []

    link = soup.find_all("section", {"class": "project-covers"})[0]
    linksToPages = link.find_all("a")

    for link in linksToPages:
        project = {}
        project['projectName'] = re.sub("[^a-zA-Z ]", "", link.get_text())

        project['mainImg'] = link.find_all("img")[0]['data-src']
        projectUrl = baseUrl + link['href']
        projectPhotos = []
        pageSoup = load_soup_object(projectUrl)
        project['projectDesc'] = pageSoup.find_all("p", {"class": "description"})[0].get_text()
        page = pageSoup.find_all("img", {"class": "e2e-site-project-module-image"})
        for photo in page:
            projectPhotos.append(photo['data-src'])

        project['images'] = projectPhotos
        allProjects.append(project)

    stop = 5
    mongodb = pymongo.MongoClient("mongodb+srv://dorshem:8SUoh2bvFZEBk9ge@dorshemeshcluster0.gxbxrux.mongodb.net/dorDB")
    db = mongodb["dorDB"]
    projectsCollection = db["projects"]


    # existProjects = []
    # for x in projectsCollection.find({},{'_id':False}):
    #     existProjects.append(x)
    # for project in existProjects:
    #     if project in allProjects:
    #         allProjects.remove(project)


    newProjectToInsert = allProjects
    projectsCollection.drop()
    response = projectsCollection.insert_many(allProjects)
