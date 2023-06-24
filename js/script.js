var numTabs = 0;
var tableValues = {
    col: {
        min: 0,
        max: 0
    },
    row: {
        min: 0,
        max: 0
    }
}
// Object for displaying label text
var formLabel = {
    minCol: 'Starting Column Value',
    maxCol: 'Ending Column Value',
    minRow: 'Starting Row Value',
    maxRow: 'Ending Row Value',
}
$('#minColLabel').html(formLabel.minCol);
$('#maxColLabel').html(formLabel.maxCol);
$('#minRowLabel').html(formLabel.minRow);
$('#maxRowLabel').html(formLabel.maxRow);
class Tab {
    constructor(num) {
        this.href = `#tabs-${num}`;
        this.id = `tabs-${num}`;
    }

}
var tabs = [new Tab(2)];
// input array for mapping to formLabel object. Much like an enumerated value.
var inputArray = ['minCol', 'maxCol', 'minRow', 'maxRow'];

function saveTab() {
    $('#tabs').tabs();
    numTabs++;
    var header = `<li class="tab"><a href="#tab-${numTabs}"><strong>Table ${numTabs}</strong> [${tableValues.row.max - tableValues.row.min} x ${tableValues.col.max - tableValues.col.min}]</a><span class='ui-icon ui-icon-close' role='presentation'></span></li>`
    $('div#tabs ul').append(header);
    $('div#tabs').append(`<div id="tab-${numTabs}" class="results">${$('#results').html()}</div>`);
    $('#tabs').tabs('refresh');
    // Activate new tab and add close icon.
    $('#tabs').tabs('option', 'active', -1);
    $('#tabs').delegate('span.ui-icon-close', 'click', (e) => {
        console.log('[TAB REMOVAL SPEC]', $(e.target.parentElement).attr('aria-controls'));
        var listItem = $(e.target.parentElement).remove().attr('aria-controls');
        $(`#${listItem}`).remove();
        numTabs--;
        try {
            $('#tabs').tabs('refresh');
        } catch (e) {
            // This wouldn't work without this line
            console.info(e);
        }
        if ($('#tabs ul li.tab').length == 0) {
            try {
                $('#tabs').tabs('destroy');
            }
            catch (e) {
                // This wouldn't work without this line either
                console.info(e);
            }
            return false;
        }
    });
    console.info('[TAB NUM]', $('#tabs ul li.tab').length);
}

// Had to remove and add range rule dynamically, or else errors would occur.
function removeRangeValidators() {
    for (let i of inputArray) {
        $(`#${i}`).rules("remove", "range");
    }
}
// Used this to practice jquery. Hides error msgs
function generateTable() {
    for (let i of inputArray) {
        if (i == 'minRow' || i == 'minCol') {
            $(`#${i}`).rules("add", {
                range: (i == 'minRow') ? [tableValues.row.max - 100, tableValues.row.max] : [tableValues.col.max - 100, tableValues.col.max],
                messages: {
                    range: `Must be <= ending ${i.substring(3).toLowerCase()} value`
                }
            });
        } else {
            $(`#${i}`).rules("add", {
                range: (i == 'maxRow') ? [tableValues.row.min, tableValues.row.min + 100] : [tableValues.col.min, tableValues.col.min + 100],
                messages: {
                    range: `Must be >= starting ${i.substring(3).toLowerCase()} value`
                }
            });
        }
    }
    if (!$('#inputForm').valid()) {
        return;
    }
    const colStart = tableValues.col.min;
    const colEnd = tableValues.col.max;
    const rowStart = tableValues.row.min;
    const rowEnd = tableValues.row.max;
    // else check for present table, remove if present
    $('#results').empty();
    let table = $('<table></table>').addClass(['col-xs-12', 'col-sm-6', 'col-md-8', 'results']);
    // $('#tab-wrapper').append($(`<li><a href="${tabs.slice(-1)[0].href}"></a></li>`))
    $('#results').append(table);
    tabs.push(new Tab(tabs.length + 2));
    // create and append tbody
    let tbody = $('<tbody></tbody>');
    // $('#content').append(newTab);
    table.append(tbody);
    // create column header row
    let colHead = $('<tr></tr>');
    let emptyCell = $('<th></th>');
    // empty first header (top left)
    emptyCell.attr('id', 'omitted');
    colHead.append(emptyCell);
    // Iterate from start -> end, appending header with column header to row
    for (let colVal = colStart; colVal <= colEnd; colVal++) {
        let colCell = $(`<th>${colVal}</th>`);
        $(colHead).append(colCell);
    }
    // add column header row
    $(tbody).append(colHead);
    // now create table body and row header for every row until i = rowEnd
    for (let i = rowStart; i <= rowEnd; i++) {
        let rowValue = $('<tr></tr>');
        let rowHead = $(`<th>${i}</th>`);
        // append row header
        $(rowValue).append(rowHead);
        // get multiplication results for every cell in table
        for (let j = colStart; j <= colEnd; j++) {
            let tableCell = $(`<td>${i * j}</td>`);
            $(rowValue).append(tableCell);
        }
        // append whole row to tbody
        $(tbody).append(rowValue);
    }
    return false;
}
$().ready(() => {
    $('#minColLabel').html(formLabel.minCol);
    $('#maxColLabel').html(formLabel.maxCol);
    $('#minRowLabel').html(formLabel.minRow);
    $('#maxRowLabel').html(formLabel.maxRow);

    $('#inputForm').on('submit', (e) => {
        e.preventDefault();
        generateTable();
    });

    $('#minRowSlider').slider({
        min: -50,
        max: 50,
        value: 0,
        step: 1,
        slide: (event, ui) => {
            $('#minRow').val(ui.value);
            $('#minRow').trigger('keyup');
        }
    });
    const initVal = 0;
    $('#minRow').val(initVal);
    $('#minRow').on('keyup mouseup', () => {
        const oldVal = $('#minRowSlider').slider("option", "value");
        const newVal = $('#minRow').val();
        (isNaN(newVal) || newVal < -50 || newVal > 50) ? $('#minRow').val(oldVal) : $("#minRowSlider").slider("option", "value", newVal);
        tableValues.row.min = parseInt($('#minRow').val());
        $('#inputForm').trigger('submit');
    });
    $('#maxRowSlider').slider({
        min: -50,
        max: 50,
        value: 0,
        step: 1,
        slide: (event, ui) => {
            $('#maxRow').val(ui.value);
            $('#maxRow').trigger('keyup');
        }
    });
    $('#maxRow').val(initVal);
    $('#maxRow').on('keyup mouseup', () => {
        const oldVal = $('#maxRowSlider').slider("option", "value");
        const newVal = $('#maxRow').val();
        (isNaN(newVal) || newVal < -50 || newVal > 50) ? $('#maxRow').val(oldVal) : $("#maxRowSlider").slider("option", "value", newVal);
        tableValues.row.max = parseInt($('#maxRow').val());
        $('#inputForm').trigger('submit');
    });
    $('#minColSlider').slider({
        min: -50,
        max: 50,
        value: 0,
        step: 1,
        slide: (event, ui) => {
            $('#minCol').val(ui.value)
            $('#minCol').trigger('keyup');
        }
    });
    $('#minCol').val(initVal);
    $('#minCol').on('keyup mouseup', () => {
        const oldVal = $('#minColSlider').slider("option", "value");
        const newVal = $('#minCol').val();
        (isNaN(newVal) || newVal < -50 || newVal > 50) ? $('#minCol').val(oldVal) : $("#minColSlider").slider("option", "value", newVal);
        tableValues.col.min = parseInt($('#minCol').val());
        $('#inputForm').trigger('submit');
    });
    $('#maxColSlider').slider({
        min: -50,
        max: 50,
        value: 0,
        step: 1,
        slide: (event, ui) => {
            $('#maxCol').val(ui.value);
            $('#maxCol').trigger('keyup');
        }
    });
    $('#maxCol').val(initVal);
    $('#maxCol').on('keyup mouseup', () => {
        const oldVal = $('#maxColSlider').slider("option", "value");
        const newVal = $('#maxCol').val();
        (isNaN(newVal) || newVal < -50 || newVal > 50) ? $('#maxCol').val(oldVal) : $("#maxColSlider").slider("option", "value", newVal);
        tableValues.col.max = parseInt($('#maxCol').val());
        $('#inputForm').trigger('submit');
    });

    // $('#submit').on('click', () => $('#inputForm').submit());

    $('#inputForm').validate({
        debug: true,
        rules: {
            minRow: {
                required: true,
                number: true,
            },
            maxRow: {
                required: true,
                number: true,
            },
            minCol: {
                required: true,
                number: true,
            },
            maxCol: {
                required: true,
                number: true,
            }
        },
        messages: {
            minRow: {
                required: "This field is required.",
                number: "Input must be a number.",
            },
            maxRow: {
                required: "This field is required.",
                number: "Input must be a number.",
            },
            minCol: {
                required: "This field is required.",
                number: "Input must be a number.",
            },
            maxCol: {
                required: "This field is required.",
                number: "Input must be a number.",
            }
        },
        submitHandler: (form) => {
            form.submit();
        },
        invalidHandler: () => {
            for (let i in inputArray) {
                $(`#${i}`).rules("remove", "range");
            }
            $('#results').empty();
        }
    });
});
