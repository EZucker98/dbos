# DBOS               
### How to setup
Rename config.json.example > config.json
Then fill in these values:
```
{
	"bot": {
		"prefix": "?",
		"token": "BOT TOKEN",
		"secret": "CLIENT SECRET",
		"id": "CLIENT ID",
		"commandLogging": true,
		"messageLogging": true,
		"status": {
			"mode": "dnd",
            "activity": "dbt.help"
		},
        "moderation": {
            "blackListing": {
                "enabled": true,
                "errorMessage": "Your server was blacklisted because it violated our terms of service!"
            },
            "server": {
                "id": "759754457520275461",
                "adminRoleId": "771439011293822996",
                "superAdminRoleId": "774226382787313674"
            },
            "entryLogging": {
                "enabled": true,
                "channelLogId": "772014030822572052"
            }
        },
		"ver": "0.0.0"
	},
	"server": {
		"invite": "TJY6Xyg"
	},
	  "siteUrl": "SITE URL",
	  "port": "3000",
	  "db": {
		  "mongodb": "MONGODB"
	  },
	  "siteName": "DBOS",
	  "iconUrl": "https://github.com/wezacon/dbos/blob/main/public/img/logo.PNG?raw=true",
      "owner": "Seer#6054",
      "danger": {
          "debug": false
      }
}
```
### Console explainations:
ML -> Message Log - Enabled with `"messageLogging": true`
CL -> Command Log - Enabled with `"commandLogging": true`

**DISCLAIMER:** The following will **not** be displayed on the help command.

(prefix) = custom bot prefix
[ITEM] = parameter
```
- (prefix)whitelist [ServerID]
- (prefix)blacklistlist [ServerID]

- (prefix)listremove [UserID] [Reason]
- (prefix)listunremove [UserID]

- (prefix)setuser [userid] (role)
- (prefix)unsetuser [userid] (role)

- (prefix)premium (serverid) (true/false)

- (prefix)forcebio (Userid) (New bio)
``` 