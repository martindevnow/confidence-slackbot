# eNPS Slackbot

This is a slackbot that can be added to channels to make it easy to gather eNPS scores from your teams.

## Install

<a href="https://slack.com/oauth/v2/authorize?scope=channels%3Ajoin%2Cchannels%3Aread%2Cchat%3Awrite%2Ccommands&amp;state=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0YWxsT3B0aW9ucyI6eyJzY29wZXMiOlsiY2hhbm5lbHM6am9pbiIsImNoYW5uZWxzOnJlYWQiLCJjaGF0OndyaXRlIiwiY29tbWFuZHMiXX0sIm5vdyI6IjIwMjEtMDMtMjRUMTk6NTk6MzkuNDg4WiIsImlhdCI6MTYxNjYxNTk3OX0.yNnY2LgqES0EWEVH2LlPLviQOm5_MHpa9gxgMzMeaIQ&amp;client_id=1898994931168.1887817242881">
  <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x">
</a>

If there are issues with the above, visit here for the latest link:

https://us-central1-enps-slack.cloudfunctions.net/slack/slack/install

## Commands

```
/enps help

/enps [1-10]

/enps reminder

/enps results
```

## Scopes

![scopes from slack][scopes]

[scopes]: docs/scopes.png "Slack OAuth Scopes"

## Bolt

https://api.slack.com/apps/

https://slack.dev/node-slack-sdk/oauth

https://api.slack.com/start/building/bolt-js#start

https://medium.com/evenbit/building-a-slack-app-with-firebase-as-a-backend-151c1c98641d

https://github.com/DennisAlund/firebase-slack-app/blob/master/functions/index.ts

https://github.com/seratch/bolt-on-cloud-functions-for-firebase/blob/master/functions/index.js

https://medium.com/evenbit/building-a-slack-app-with-firebase-as-a-backend-151c1c98641d
