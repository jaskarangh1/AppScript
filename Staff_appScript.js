/** Contains location of Google Sheet to be used 
 * @param {void}
 * @description myFunction gets data from sheet 
 * and inputs data from 'insert sheet name' sheet into JSON object for every row in sheet
 * @return {array} Input returnData object
 */
function main() {
  var data = SpreadsheetApp.openByUrl('Insert URL');
  var sheet = data.getSheetByName('Insert Sheet Name ');

  var range = sheet.getDataRange(); //Selects all data in sheet 'insert sheet name'
  var values = range.getValues(); //Assigns all values within range to values

  var returnData = {};
  for (i = 0; i < values.length; i++) { //Loop through every row, parsing from left to right
    var product = {};
    attributes(i, product, values); //Pass by reference the attributes function to input productobj for every row 
    returnData[i] = product; //Assign product values to every row in 'insert sheet name' sheet
  }
  return returnData;
};

/** 
 * @param {int} Input curent row
 * @param {obj} Input product object
 * @param {int} Input values from sheet 'insert sheet name'
 * @description appends productobj with required information from 'insert sheet name' sheet 
 * @return {void}
 */
function attributes(rows, productobj, values) {
  if (productobj["DefaultCategory"] === undefined) {

    productobj["DefaultCategory"] = values[rows][6]; //adds Department values to Default_Category 
  }

  productobj["name"] = {//Assigns values for first and last name 
    "bold": "Name: ",
    "text": values[rows][1] + ", " + values[rows][0],
    "hidden": false
  };

  productobj["office"] = {//Assigns values for TC office location
    "bold": "Office Location: ",
    "text": values[rows][2],
    "hidden": false
  };

  productobj["Link_email"] = {//Assigns values for email addresses
    "bold": "Email: ",
    "href": "mailto:" + values[rows][4],
    "alttext": values[rows][4],
    "target": "_blank",
    "hidden": false
  };

  productobj["Job Title"] = {//Assigns values for job titles
    "bold": "Title: ",
    "text": values[rows][5],
    "hidden": false
  };

  productobj["Category"] = {//keys to be used for filtering
    "hidden": true,
    "Job Title": {
      "0": values[rows][5]
    },
    "Department": {
      "0": values[rows][6],
    },
    "Unit": {
      "0": values[rows][7],
    }
  };
};

/**
 * @param {*} 
 * @description 
 * Hooks into App Script getMethod() [Allows for API Call]
 * @returns JSON object
 */
function doGet(e) {
  var output = main();
  return ContentService.createTextOutput(JSON.stringify(output)).setMimeType(ContentService.MimeType.JSON);
}