const $tableID = $('#table');
const $BTN = $('#export-btn');
const $EXPORT = $('#export');

const newTr = `
        <tr class="hide">
        <td class="pt-3-half">
            <input id="testBarcode" name="testList">
        </td>
        <td>
            <span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 waves-effect waves-light">Remove</button></span>
        </td>
        </tr>`;

function fetchSavedResults(patientID) {
    return fetch(`http://localhost:8080/patientResults/${patientID}`).then(result => {
        return result.json();
    }).then(function (data) {
        return data;
    }).catch((error) => {
        console.log(error);
        return null;
    });
}

async function displaySavedResults() {
    let queryStringID = location.search.substring(1);
    const $clone = $tableID.find('tbody tr').last().clone(true).removeClass('hide table-line');
    let savedResults = await fetchSavedResults(queryStringID);
    console.log(savedResults);
    if (savedResults == null) return;

    if ($tableID.find('tbody tr').length === 0) {
        for (let i = 0; i < savedResults.length; i++) {
            const newTr = `
                            <tr class="hide">
                                <td class="pt-3-half"><p name="collectionTime">${savedResults[i]["testingEndTime"]}</p></td>
                                <td class="pt-3-half"><p name="barcode">${savedResults[i]["testBarcode"]}</p></td>
                                <td class="pt-3-half"><p name="result">${savedResults[i]["result"]}</p></td>
                            </tr>`;
            $('tbody').append(newTr);
        }
    }
    $tableID.find('table').append($clone);
}

displaySavedResults();

$('#add-button').on('click', () => {

    const $clone = $tableID.find('tbody tr').last().clone(true).removeClass('hide table-line');

    if ($tableID.find('tbody tr').length === 0) {
        $('tbody').append(newTr);
    }

    $tableID.find('table').append($clone);
});

$tableID.on('click', '.table-remove', function () {

    $(this).parents('tr').detach();
});

$tableID.on('click', '.table-up', function () {

    const $row = $(this).parents('tr');

    if ($row.index() === 0) {
        return;
    }

    $row.prev().before($row.get(0));
});

$tableID.on('click', '.table-down', function () {

    const $row = $(this).parents('tr');
    $row.next().after($row.get(0));
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.on('click', () => {

    const $rows = $tableID.find('tr:not(:hidden)');
    const headers = [];
    const data = [];

    // Get the headers (add special header logic here)
    $($rows.shift()).find('th:not(:empty)').each(function () {

        headers.push($(this).text().toLowerCase());
    });

    // Turn all existing rows into a loopable array
    $rows.each(function () {
        const $td = $(this).find('td');
        const h = {};

        // Use the headers from earlier to name our hash keys
        headers.forEach((header, i) => {

            h[header] = $td.eq(i).text();
        });

        data.push(h);
    });

    // Output the result
    $EXPORT.text(JSON.stringify(data));
});