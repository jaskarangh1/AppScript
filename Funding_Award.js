/**
 * @description function main links to 'insert sheet name' sheet in Google Sheets program by URL
 * Selects all data in cells then loops through rows and columns of data
 * If a certain tyoe of funding is selected, pass by reference attributes function
 * @param {void}
 * @returns {array}
 * function returns arrays of rows filled with column values
 */
function main() {
    var data = SpreadsheetApp.openByUrl('Insert URL');
    var sheet = data.getSheetByName('Insert Sheet Name');

    var range = sheet.getDataRange();
    var values = range.getValues();

    var returnData = {};
    for (var i = 0; i < values.length; i++) {
        var fund = {};
        if (values[i][2] === "Award") {
            attributes(i, fund, values);
            returnData[i] = fund;
        }
    };
    return returnData;
};


/** Contains switch case to append to object
 * @param {int} Input curent row
 * @param {int} Input current column
 * @param {obj} Input product object
 * @param {int} Input values from sheet 'insert sheet name'
 * @description appends fundobj with required column information form 'insert sheet name' sheet 
 * @return {void}
 */
function attributes(rows, fundobj, values) {
    if (fundobj["DefaultCategory"] === undefined) {
        fundobj["DefaultCategory"] = values[rows][2];
    }
    fundobj["Name"] = {//Case for name
        "bold": "Funding: ",
        "text": values[rows][0],
        "hidden": false
    }

    fundobj["Link_URL"] = {//Case for URL 
        "bold": "Click here to learn more",
        "href": values[rows][1],
        "alttext": values[rows][1],
        "target": "_blank",
        "hidden": false
    }

    fundobj["Category"] = {//Cases to be used in filtering
        "hidden": true,
        "Type": {
            "0": values[rows][2] //Case for type of funding
        },
        "Location": {
            "0": values[rows][3] //Case for location
        },
        "Deadline": {
            "0": values[rows][8] //Case for deadline
        },
        "Co-op Specific": {
            "0": values[rows][9] //Case for co-op or non co-op
        },
        "Student Type": {
            "0": values[rows][10] //Case for undergraduate, graduate, or other
        },
        "Industry": {} //Create object before runnning indLoop function
    };
    indLoop(rows, values, fundobj); //pass by reference from function below

    fundobj["info"] = {//Case for eligibility
        "bold": "Who can apply: ",
        "text": values[rows][5],
        "hidden": true
    };

    fundobj["apply"] = {
        "bold": "How to apply: ",
        "text": values[rows][6],
        "hidden": true
    };
}
/**
 * @description select cells in industry columns
 * Splits cell values into array seperated by semi-colon
 * function loops through cells in Industry column
 * if index is of ; skip through, else add in an object key, value pair to fundobj object
 * @param {int} input current row
 * @param {int} input current value
 * @return {void}
 */
function indLoop(rows, values, fundobj) {
    var ind_col = values[rows][11];
    var array_ind = ind_col.split(";");
    for (var indval in array_ind) { //for every value in array_ind add key:value pair
        //assigns numbered key from array to industry values
        fundobj["Category"]["Industry"][indval] = array_ind[indval];
    };
}
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