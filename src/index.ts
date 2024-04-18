import express from 'express';
import { csvUtil } from './csvUtil';

const fastCsv = require("fast-csv");
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Application is running');
});

app.listen(port, async () => {
  console.log(`Server is running`);

  const readOptions = {
    objectMode: true,
    delimiter: "\t",
    quote: null,
    headers: true,
    renameHeaders: false,
  };

  //get all data from the input CSV
  const data = await csvUtil.readCsv("input.csv", readOptions);

  //output headers
  const outputHeaders = ['name','given_name','family_name','middle_name','nickname','preferred_username',
  'profile','picture','website','email','email_verified','gender','birthdate','zoneinfo','locale','phone_number',
  'phone_number_verified','address','updated_at','custom:subscriptions','custom:mc_customer_number','custom:latest_orderId',
  'custom:pending_orderId','custom:customer_number','custom:pending_order_id','custom:external_id','cognito:mfa_enabled','cognito:username'];

  //transform the data to the desired format
  const transformedData = data.map((row: any) => {

    let currentBirthDate = '';
    try {
      const date = new Date(row['birth_date']);
      currentBirthDate = `0${date.getMonth() + 1}`.slice(-2) + '/' + `0${date.getDate()}`.slice(-2) + '/' + date.getFullYear();
    } catch (error) {
      console.log('Error while formatting birth date: ', error);
    }
  
    return {
      name: row['full_name'],
      given_name: row['first_name'],
      family_name: row['last_name'],
      middle_name: '',
      nickname: '',
      preferred_username: '',
      profile: '',
      picture: '',
      website: row['publication'],
      email: row['email'],
      email_verified: true,
      gender: '',
      birthdate: currentBirthDate,
      zoneinfo: '',
      locale: '',
      phone_number: row['phone'],
      phone_number_verified: false,
      address: '',
      updated_at: '',
      'custom:subscriptions': '',
      'custom:mc_customer_number': row['connect_customer_number'],
      'custom:latest_orderId': '',
      'custom:pending_orderId': '',
      'custom:customer_number': row['connect_customer_number'],
      'custom:pending_order_id': '',
      'custom:external_id': row['external_id'],      
      'cognito:mfa_enabled': 'false',
      'cognito:username': 'vipps_'+row['subject_id']
    }
  });

  //write the transformed data to the output CSV
  const writeOptions = {
    delimiter: ",",
    quote: "'",
    writeHeaders: true,
    headers: outputHeaders,
    renameHeaders: false,
    includeEndRowDelimiter: true,
  };

  await csvUtil.writeCsv("output.csv", transformedData, writeOptions);
});


