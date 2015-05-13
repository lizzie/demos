#!/usr/bin/python
#  -*- coding: utf-8 -*-

import sys
import httplib2, urllib
from BeautifulSoup import BeautifulSoup
import re
import json
import HTMLParser


REP = [
    (r'["\']\w+["\']', '"xxx"'),
    (r"(.*)AE\.app\.jsonpRequest\._getHandler\(\d+\)(.*)", r'\1AE.app.jsonpRequest._getHandler(xxx)\2'),
]
def try_download(appName, appID):
    h = httplib2.Http()
    params = urllib.urlencode({
        "action": "errorLogList_action",
        "appName": appName,
        "appId": appID,
        "event_submit_DoGet": "查询"
    })
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Connection": "keep-alive",
        "Referer": "http://jsmonitor.alibaba.com/errorLogList.htm",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:21.0) Gecko/20100101 Firefox/21.0"
    }
    try:
        resp, content = h.request("http://jsmonitor.alibaba.com/errorLogList.htm", method="POST", body=params,
                                  headers=headers)
        if resp.status == 200:
            print "ready: ", appName
            #open("tmp.html", 'w').write(content)
            return content
        else:
            raise
    except Exception, e:
        print e, appName


def get_list_from_html(html, result):
    soup = BeautifulSoup(html)
    htmlparser = HTMLParser.HTMLParser()
    for tr in soup("tr"):
        for idx, tag in enumerate(tr("td")):
            if idx == 2:
                content = tag.contents
                if len(content):
                    content = htmlparser.unescape(content[0].strip())
                    for rep in REP:
                        content = re.sub(rep[0], rep[1], content)
                    if content in result:
                        result[content] += 1
                    else:
                        result[content] = 1


if __name__ == "__main__":
    result = {}
    all = [("defaultApp", 7),
           ("defaultPageId", 9),
           ("SOURCING_HOME", 11), ("SOURCING_DETAIL", 13),
           ("SOURCING_POSTING_POST", 15), ("ALLIN_MAIL_INDEX", 17),
           ]
    for tp in all:
        get_list_from_html(try_download(tp[0], tp[1]), result)
        #get_list_from_html(open("tmp.html").read(), result)
    json.dump(result, open("result.json", 'w'))
    print "Total: ", len(result)
    sys.exit(0)



'''
a = json.load(open("result.json", "r"))
for key,val in a.iteritems():
    print key, val
'''