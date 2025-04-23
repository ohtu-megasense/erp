import { randomInt } from 'crypto';
import { addCategory, AddItem } from '../database/database_handler';
let laptops: Record<string, string | number | Record<string, string | number>>;
let sensors: Record<string, string | number | Record<string, string | number>>;
let orders: Record<string, string | number | Record<string, string | number>>;
let customers: Record<
  string,
  string | number | Record<string, string | number>
>;
let leads: Record<string, string | number | Record<string, string | number>>;
let smp: Record<string, string | number | Record<string, string | number>>;
let ot: Record<string, string | number | Record<string, string | number>>;
async function addMockCategory() {
  try {
    laptops = await addCategory({
      name: 'Laptops',
      module: 'inventory',
      itemShape: {
        Model: 'TEXT',
        Price: 'FLOAT',
        Owner: 'TEXT',
        'Manufacturing year': 'INTEGER'
      }
    });
    sensors = await addCategory({
      name: 'Sensors',
      module: 'inventory',
      itemShape: {
        Model: 'TEXT',
        Price: 'FLOAT',
        Location: 'TEXT',
        Status: 'TEXT',
        'Serial number': 'INTEGER'
      }
    });
    orders = await addCategory({
      name: 'Orders',
      module: 'crm',
      itemShape: {
        Status: 'TEXT',
        Customer: 'TEXT',
        Cost: 'FLOAT',
        Profit: 'FLOAT',
        Items: 'TEXT'
      }
    });

    customers = await addCategory({
      name: 'Customers',
      module: 'crm',
      itemShape: {
        Name: 'TEXT',
        Location: 'TEXT',
        'Days since last order': 'INTEGER',
        'Order count': 'INTEGER',
        'Order sum': 'FLOAT',
        'Contact person': 'TEXT'
      }
    });
    leads = await addCategory({
      name: 'Leads',
      module: 'crm',
      itemShape: {
        Name: 'TEXT',
        Location: 'TEXT',
        Source: 'TEXT',
        Status: 'TEXT'
      }
    });
    smp = await addCategory({
      name: 'Social media posts',
      module: 'crm',
      itemShape: {
        Platform: 'TEXT',
        Cost: 'FLOAT',
        Interactions: 'INTEGER',
        'Days since posting': 'INTEGER',
        Author: 'TEXT',
        'Link to post': 'TEXT'
      }
    });
    ot = await addCategory({
      name: 'Open Tickets',
      module: 'crm',
      itemShape: {
        Status: 'TEXT',
        Message: 'TEXT',
        'Days since created': 'INTEGER'
      }
    });

    console.log('Categories added');
  } catch (error) {
    console.log('Mockdata failed: ', error);
  }
}

async function addMockdata() {
  const fnOwner = [
    'Jake',
    'Make',
    'Li',
    'Ia',
    'Ian',
    'Jo',
    'Bob',
    'Ted',
    'Pam',
    'Meg',
    'Tom',
    'Jade',
    'Tea',
    'Nea',
    'Lea',
    'Kia',
    'Sal',
    'Al',
    'Tal',
    'Tony',
    'Ber',
    'Per',
    'Slim'
  ];
  const lnOwner = [
    'Smith',
    'Fischer',
    'Wu',
    'Tang',
    'Leaf',
    'House',
    'Fall',
    'Kivi',
    'Tala',
    'Salo',
    'Oja',
    'Tan',
    'Sea',
    'Olin',
    'Tila',
    'Tela',
    'Alto',
    'Alo',
    'Palo',
    'Polo',
    'Puopolo',
    'Vaarasto',
    'Plukka',
    'Laaksonen'
  ];
  const lModels = [
    'Lenovo Thinkpad T14',
    'Lenovo Thinkpad E14',
    'Lenovo Thinkpad T10',
    'Lenovo Yoga',
    'HP HardFace',
    'Macbook Air',
    'Macbook Pro'
  ];
  const status = ['Active', 'Offline'];
  const customer = ['Aalto', 'HU', 'London Council', 'Google'];
  const orderStatus = [
    'Completed',
    'Cancelled',
    'Open',
    'Urgent',
    'Shipping',
    'Refunded'
  ];
  const locations = ['Espoo', 'Helsinki', 'London', 'Riyad'];
  const leadSources = [
    'Email',
    'Contact Form',
    'Facebook',
    'Phone call',
    'Mutuals'
  ];
  const leadStatus = [
    'Approached',
    'Cold',
    'Waiting',
    'Busy',
    'Not interested'
  ];

  for (let i = 0; i < 2000; i++) {
    const lPrice = randomInt(5000, 200000);
    const manYear = randomInt(2018, 2026);

    await AddItem(String(laptops.id), {
      Model: lModels[randomInt(7)],
      Price: lPrice / 100,
      Owner: fnOwner[randomInt(22)] + ' ' + lnOwner[randomInt(23)],
      'Manufacturing year': manYear
    });
  }

  for (let i = 0; i < 2000; i++) {
    await AddItem(String(sensors.id), {
      Model: 'Sensor' + String(i),
      Price: randomInt(2000, 20000) / 100,
      Location: locations[randomInt(4)],
      Status: status[randomInt(2)],
      'Serial number': 10000 + i
    });
  }
  for (let i = 0; i < 100; i++) {
    const costBase = randomInt(800, 15000) / 100;
    await AddItem(String(orders.id), {
      Status: orderStatus[randomInt(6)],
      Customer: customer[randomInt(4)],
      Cost: costBase,
      Profit: Number(((randomInt(105, 350) / 100) * costBase).toPrecision(4)),
      Items: String(randomInt(10)) + ' Sensors'
    });
  }
  for (let i = 0; i < 4; i++) {
    await AddItem(String(customers.id), {
      Name: customer[i],
      Location: locations[i],
      'Days since last order': randomInt(1, 100),
      'Order count': randomInt(30),
      'Order sum': randomInt(1000000) / 100,
      'Contact person': fnOwner[randomInt(5)] + ' ' + lnOwner[randomInt(5)]
    });
  }
  for (let i = 0; i < 100; i++) {
    await AddItem(String(leads.id), {
      Name: fnOwner[randomInt(5)] + ' ' + lnOwner[randomInt(5)],
      Location: locations[randomInt(4)],
      Source: leadSources[randomInt(5)],
      Status: leadStatus[randomInt(5)]
    });
  }
  const socialPlatforms = ['Facebook', 'X', 'Instagram'];
  for (let i = 0; i < 50; i++) {
    await AddItem(String(smp.id), {
      Platform: socialPlatforms[randomInt(3)],
      Cost: randomInt(500, 50000) / 100,
      Interactions: randomInt(2, 200),
      'Days since posting': i * 2,
      Author: fnOwner[randomInt(5, 15)] + ' ' + lnOwner[randomInt(5, 15)],
      'Link to post': '...'
    });
  }
  for (let i = 1; i < 50; i++) {
    await AddItem(String(ot.id), {
      Status: orderStatus[randomInt(4)],
      Message: '...',
      'Days since created': i * 3
    });
  }
}
if (require.main === module) {
  addMockCategory();
  setTimeout(() => {
    console.log('Waiting for categories, adding mockdata next');
    addMockdata();
  }, 3000);
  //addMockdata();
}
