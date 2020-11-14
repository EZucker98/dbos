# DBOS               
### How to setup
Rename config.json.example > config.json
### Console explainations:
ML -> Message Log - Enabled with `"messageLogging": true`
CL -> Command Log - Enabled with `"commandLogging": true`

**DISCLAIMER:** The following will **not** be displayed on the help command.

(prefix) = custom bot prefix
[ITEM] = parameter 
```
- (prefix)whitelist [ServerID]   - can be used by admins
- (prefix)blacklistlist [ServerID]    - can be used by admins

- (prefix)listremove [UserID] [Reason]    - can be used by moderators
- (prefix)listunremove [UserID]    - can be used by moderators

- (prefix)setuser [userid] (role)    - can be used by moderators (only verify)
- (prefix)unsetuser [userid] (role)    - can be used by moderators (only verify)

- (prefix)premium (serverid) (true/false)    - can be used by moderators

- (prefix)forcebio (Userid) (New bio)    - can be used by admins

- (prefix)resetmessages                  - Can be used by super admins
``` 