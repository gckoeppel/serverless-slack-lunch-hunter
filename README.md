# Slack Lunch Hunter

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![Build Status](https://travis-ci.org/amuelli/serverless-slack-lunch-hunter.svg?branch=master&style=flat-square)](https://travis-ci.org/amuelli/serverless-slack-lunch-hunter)
[![license](https://img.shields.io/github/license/amuelli/serverless-slack-lunch-hunter.svg)]()

This is a simple Serverless project with a single AWS Lambda function to scrap daily lunch menus and post them to a slack channel.

## Configuration

1. Fork this repository

2. `cd` into project directory and install node modules:
  ```shell
  npm install
  ```

3. Set up an [incoming webhook](https://my.slack.com/services/new/incoming-webhook/) in Slack, copy `.env.example` file to `.env` and insert your Slack incoming webhook url there.
  (You'll see that the webhook is separated into 2 env variabes, this is because of testing.)

4. Customize which websites should be scraped for their daily menus in `config/default.yml`

5. Post a menu summary to your slack channel by running:
  ```shell
  node run.js
  ```
  ![Demo of the Slack integration](http://i.imgur.com/b5p2Ye5.png)

## Deploy with Serverless
Although you can run the lunch hunter locally on your machine or on any server with node.js and a cron job, this project is meant to be run as a Lambda function on AWS and deployed through the serverless framework.
1.  Setup your [AWS Credentials](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md)

2. Install [Serverless.js](https://serverless.com)
  ```shell
  npm install -g serverless
  ```

3. Deploy with Serverless
  ```shell
  serverless deploy
  ```

For testing purposes the main Lambda function can be triggered via API Gateway ( GET /notify ) as well as a [schedule event](https://serverless.com/framework/docs/providers/aws/events/schedule/#schedule) (you can change the specific time in `serverless.yml`).

Memory size limit is set to the lowest value of 128MB.

## Supported Websites
 - [SV Restaurants](http://www.sv-restaurant.ch/)
 - [ZFV Cantines](https://zfv.ch/de/betriebe/personalrestaurants)

Feel free to fork this project and write your own parser or api client for your favourite cantine or restaurant website.


## Credits
This project is based on code and ideas from
 - https://github.com/swissspidy/cafeteria-bot
 - https://github.com/ivanderbu2/serverless-slack-cron
